import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GOOGLE_KEY = process.env.PLACES_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

app.post("/analyze", async (req, res) => {
  try {
    const { query, lang = "ar" } = req.body;
    const isEnglish = lang === "en";

    // 1️⃣ البحث عن المكان
    const placeRes = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_KEY,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.priceLevel,places.location,places.types,places.primaryType,places.reviews",
        },
        body: JSON.stringify({ textQuery: query }),
      }
    );

    const placeData = await placeRes.json();
    const place = placeData.places?.[0];

    if (!place) {
      // مساعدة في التشخيص: هل المشكلة من المفتاح أم عدم وجود نتائج؟
      if (!placeRes.ok) {
        console.warn("[PlaceScope] Google Places API error:", placeRes.status, placeData?.error?.message || placeData);
      } else if (!GOOGLE_KEY) {
        console.warn("[PlaceScope] PLACES_API_KEY غير موجود في .env");
      } else {
        console.warn("[PlaceScope] لا توجد نتائج من Google Places للاستعلام:", query);
      }
      return res.json({
        place: null,
        reviews: [],
        analysis: null,
      });
    }

    // 2️⃣ تجهيز المراجعات
    const reviews = (place.reviews || [])
      .map((r) => ({
        text: r.text?.text || "",
        rating: typeof r.rating === "number" ? r.rating : null,
      }))
      .filter((r) => r.text || r.rating != null);

    const reviewsText = reviews.length
      ? reviews
          .map(
            (r) =>
              `[${r.rating != null ? r.rating + " stars" : "no rating"}] ${r.text}`
          )
          .join("\n\n")
      : "No reviews found";

    const placeName = place.displayName?.text || query;
    const placeRating = place.rating;
    const priceLevel = place.priceLevel || "PRICE_LEVEL_UNSPECIFIED";

    // 3️⃣ توزيع النجوم (1-5) للـ Bar Chart
    const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      if (r.rating != null && r.rating >= 1 && r.rating <= 5) {
        const star = Math.round(r.rating);
        starCounts[star] = (starCounts[star] || 0) + 1;
      }
    });

    const chartsStars = [1, 2, 3, 4, 5].map((s) => ({
      name: String(s),
      value: starCounts[s] || 0,
    }));

    // 3.1 حساب نسبة الإيجابي/السلبي من المراجعات (لـ Pie Chart عند غياب AI)
    let positiveCount = 0;
    let negativeCount = 0;
    reviews.forEach((r) => {
      if (r.rating != null) {
        if (r.rating >= 4) positiveCount++;
        else if (r.rating <= 2) negativeCount++;
      }
    });
    const neutralCount = reviews.filter((r) => r.rating != null && r.rating > 2 && r.rating < 4).length;
    const defaultSentiment = [
      { name: "إيجابي", value: positiveCount || 0 },
      { name: "سلبي", value: negativeCount || 0 },
    ];
    if (neutralCount > 0) defaultSentiment.push({ name: "محايد", value: neutralCount });

    // الفئات المطلوبة للرادار: جودة الطعام، الخدمة، الأجواء، القيمة مقابل السعر، النظافة، الموقع
    const radarSubjects = [
      "جودة الطعام",
      "الخدمة",
      "الأجواء",
      "القيمة مقابل السعر",
      "النظافة",
      "الموقع",
    ];
    const defaultCategories = radarSubjects.map((subject) => ({
      subject,
      score: placeRating != null ? Math.min(100, Math.round(placeRating * 20)) : 50,
      fullMark: 100,
    }));

    // 4️⃣ تحليل Gemini – بنية كاملة حسب متطلبات المشروع
    let analysis = {
      summary: "",
      pros: [],
      cons: [],
      price: {},
      popularDishes: [],
      recommendation: "",
      bestTimeToVisit: "",
      charts: {
        sentiment: [],
        categories: [],
      },
    };

    const geminiPrompt = `أنت محلل مراجعات. حلل المراجعات التالية لمكان باسم "${placeName}".
التقييم العام من المصدر: ${placeRating} من 5. مستوى السعر: ${priceLevel}.
عدد المراجعات: ${reviews.length}.

المراجعات:
${reviewsText}

تعليمات مهمة:
- summary: اكتب ملخصاً عاماً يتضمن: (1) حديث عن المطعم/المكان ووصفه، (2) الأطباق أو الخدمات التي يقدمها، (3) أنسب وقت لزيارته، (4) هل يُنصح بالذهاب إليه حسب رأي الناس (نعم/لا مع سبب قصير). لا تذكر التقييم بالأرقام ولا عدد المراجعات ولا العنوان.
- pros و cons: استخرج الإيجابيات والسلبيات من المراجعات فقط (من API). يجب أن تكون نقاطاً محددة مع شرح مختصر لكل نقطة. لا تترك القوائم فارغة.
- price: يجب أن تعطي تقديراً فعلياً من تحليل المراجعات بالدينار الأردني (د.أ). لا تكتب أبداً "استنتج من المراجعات" أو "راجع المراجعات"—أعطِ متوسط تكلفة تقريبي للشخص بالدينار الأردني (مثلاً: 5-15 د.أ)، ومقارنة بالمنطقة، وهل يستحق السعر (نعم/لا مع سبب).
- bestTimeToVisit: حدد أنسب وقت لزيارة المكان (مثلاً: وقت الغداء، أيام العطلة، تجنب أوقات الازدحام).

المطلوب: أرجع JSON فقط بدون أي نص قبله أو بعده. استخدم البنية التالية بالضبط:

{
  "summary": "ملخص عام: حديث عن المطعم ووصفه، الأطباق التي يقدمها، أنسب وقت لزيارته، وهل يُنصح بالذهاب حسب رأي الناس.",
  "pros": [
    { "point": "عنوان النقطة", "explanation": "شرح مختصر" }
  ],
  "cons": [
    { "point": "عنوان النقطة", "explanation": "شرح مختصر" }
  ],
  "price": {
    "averageCost": "تقدير فعلي لمتوسط التكلفة للشخص بالدينار الأردني (مثلاً: 5-12 د.أ)",
    "comparison": "مقارنة بالمنطقة (أعلى/مماثل/أقل من متوسط المنطقة)",
    "worthIt": "نعم/لا مع سبب مختصر"
  },
  "popularDishes": [
    { "name": "اسم الطبق", "rating": "تقييم أو وصف" }
  ],
  "recommendation": "التوصية النهائية: هل تنصح بالزيارة ولماذا",
  "bestTimeToVisit": "أنسب وقت لزيارة المكان (مثلاً: الغداء، العشاء، أيام الأسبوع)",
  "charts": {
    "sentiment": [
      { "name": "إيجابي", "value": عدد صحيح },
      { "name": "سلبي", "value": عدد صحيح }
    ],
    "categories": [
      { "subject": "جودة الطعام", "score": عدد 0-100, "fullMark": 100 },
      { "subject": "الخدمة", "score": عدد 0-100, "fullMark": 100 },
      { "subject": "الأجواء", "score": عدد 0-100, "fullMark": 100 },
      { "subject": "القيمة مقابل السعر", "score": عدد 0-100, "fullMark": 100 },
      { "subject": "النظافة", "score": عدد 0-100, "fullMark": 100 },
      { "subject": "الموقع", "score": عدد 0-100, "fullMark": 100 }
    ]
  }
}

احسب sentiment من المراجعات. قيّم كل فئة في categories من 0 إلى 100 بناءً على المراجعات.
${isEnglish ? "Return all text fields in English. Keep JSON keys as they are." : ""}`;

    try {
      const aiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: geminiPrompt }],
              },
            ],
            generationConfig: { temperature: 0.4 },
          }),
        }
      );

      const aiData = await aiRes.json();
      let rawText = aiData?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (rawText) {
        rawText = rawText.replace(/```json|```/g, "").trim();
        const firstBrace = rawText.indexOf("{");
        const lastBrace = rawText.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
          const cleanJson = rawText.substring(firstBrace, lastBrace + 1);
          try {
            analysis = JSON.parse(cleanJson);
          } catch (_) {
            console.warn("[PlaceScope] Failed to parse Gemini JSON");
          }
        }
      }
    } catch (err) {
      console.log("Gemini failed → Continuing without AI analysis", err.message);
    }

    // تطبيع الإيجابيات والسلبيات (دعم نص أو كائن)
    const toPoint = (item) => {
      if (typeof item === "string" && item.trim()) return { point: item.trim(), explanation: "" };
      if (item && typeof item === "object") {
        const point = item.point ?? item.title ?? item.name ?? "";
        const explanation = item.explanation ?? item.desc ?? item.description ?? "";
        if (String(point).trim()) return { point: String(point).trim(), explanation: String(explanation).trim() };
      }
      return null;
    };
    const prosRaw = analysis.pros || [];
    const consRaw = analysis.cons || [];
    let pros = prosRaw.map(toPoint).filter(Boolean);
    let cons = consRaw.map(toPoint).filter(Boolean);

    // إيجابيات وسلبيات افتراضية من بيانات API (المراجعات والتقييم) عند غياب ردّ AI
    if (!pros.length && (reviews.length > 0 || placeRating != null)) {
      pros = [];
      if (placeRating != null && placeRating >= 4)
        pros.push({ point: "تقييم مرتفع من الزبائن", explanation: "حسب بيانات التقييم من المصدر (API)." });
      if (positiveCount > negativeCount && positiveCount > 0)
        pros.push({ point: "غالبية المراجعات إيجابية", explanation: `عدد المراجعات الإيجابية (${positiveCount}) أعلى من السلبية.` });
      if (reviews.length >= 5 && placeRating >= 3.5)
        pros.push({ point: "عدد جيد من المراجعات الإيجابية", explanation: "بناءً على مراجعات المصدر." });
      if (!pros.length) pros.push({ point: "تقييم موجود من المصدر", explanation: "المراجعات متوفرة في المصدر للاطلاع." });
    }
    if (!cons.length && (reviews.length > 0 || placeRating != null)) {
      cons = [];
      if (placeRating != null && placeRating <= 2)
        cons.push({ point: "تقييم منخفض من الزبائن", explanation: "حسب بيانات التقييم من المصدر (API)." });
      if (negativeCount > 0)
        cons.push({ point: "وجود مراجعات سلبية", explanation: `بعض المراجعين أعطوا تقييماً منخفضاً (${negativeCount} مراجعة سلبية).` });
      if (reviews.length > 0 && !cons.length)
        cons.push({ point: "تقييمات متفاوتة", explanation: "راجع قائمة المراجعات للتفاصيل." });
    }

    // تطبيع تحليل الأسعار — نعطي تقديراً فعلياً وليس "استنتج من المراجعات"
    const priceRaw = analysis.price || {};
    const priceLevelText = priceLevel === "PRICE_LEVEL_INEXPENSIVE" ? "رخيص" : priceLevel === "PRICE_LEVEL_MODERATE" ? "متوسط" : priceLevel === "PRICE_LEVEL_EXPENSIVE" ? "غالي" : "غير محدد";
    const fallbackAverageCost = priceLevel === "PRICE_LEVEL_INEXPENSIVE"
      ? "تقريباً 3–8 دينار أردني للشخص (نطاق رخيص)"
      : priceLevel === "PRICE_LEVEL_MODERATE"
        ? "تقريباً 8–16 دينار أردني للشخص (نطاق متوسط)"
        : priceLevel === "PRICE_LEVEL_EXPENSIVE"
          ? "تقريباً 16 دينار أردني فأكثر للشخص (نطاق غالي)"
          : "يتراوح حسب نوع الطلب ونطاق السعر المعتمد للمكان (بالدينار الأردني)";
    const fallbackWorthIt = placeRating != null && placeRating >= 4
      ? "نعم، ينصح به حسب رأي المراجعين"
      : placeRating != null && placeRating <= 2
        ? "غالباً لا، حسب المراجعات السلبية"
        : "متوسط، انظر التوصية النهائية للتفاصيل";
    const price = {
      priceRange: priceLevelText,
      averageCost: priceRaw.averageCost ?? priceRaw.average_cost ?? fallbackAverageCost,
      comparison: priceRaw.comparison ?? priceRaw.comparison_to_area ?? "مماثل لمتوسط المنطقة تقريباً",
      worthIt: priceRaw.worthIt ?? priceRaw.worth_it ?? fallbackWorthIt,
    };

    // ملخص عام: معلومات عن المكان وهل يُنصح بالذهاب حسب رأي الناس
    const summary = (analysis.summary && String(analysis.summary).trim())
      ? String(analysis.summary).trim()
      : (placeRating != null && placeRating >= 4
          ? `${placeName}: مكان يُنصح بزيارته حسب رأي الناس والمراجعات الإيجابية.`
          : placeRating != null && placeRating <= 2
            ? `${placeName}: لا يُنصح بزيارته حسب رأي المراجعين.`
            : `${placeName}: معلومات عامة عن المكان. يُنصح بمراجعة التوصية والمراجعات.`);

    // دمج نتائج AI مع القيم الافتراضية من API المراجعات
    const charts = {
      stars: chartsStars,
      sentiment:
        Array.isArray(analysis.charts?.sentiment) && analysis.charts.sentiment.length > 0
          ? analysis.charts.sentiment
          : defaultSentiment,
      categories:
        Array.isArray(analysis.charts?.categories) && analysis.charts.categories.length > 0
          ? analysis.charts.categories
          : defaultCategories,
    };

    res.json({
      place,
      reviews,
      analysis: {
        summary,
        pros,
        cons,
        price,
        popularDishes: analysis.popularDishes || [],
        recommendation: analysis.recommendation ?? "",
        bestTimeToVisit: analysis.bestTimeToVisit ?? (reviews.length ? "حسب المراجعات: يُفضّل تجربة أوقات غير الذروة للخدمة الأفضل." : "—"),
        charts,
      },
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
    });
  }
});

app.listen(5000, () =>
  console.log("Server running on 5000")
);