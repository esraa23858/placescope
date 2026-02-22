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
    const { query } = req.body;

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

    // 3️⃣ توزيع النجوم
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

    // 4️⃣ تحليل Gemini (اختياري - لو فشل ما يوقف السيرفر)
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
                parts: [
                  {
                    text: `حلل مراجعات هذا المكان: "${placeName}"
التقييم العام: ${placeRating}
مستوى السعر: ${priceLevel}

المراجعات:
${reviewsText}

ارجع فقط JSON بدون شرح:
{
  "summary": "",
  "pros": [],
  "cons": [],
  "price": {},
  "popularDishes": [],
  "recommendation": "",
  "bestTimeToVisit": "",
  "charts": {
    "sentiment": [],
    "categories": []
  }
}`,
                  },
                ],
              },
            ],
            generationConfig: { temperature: 0.4 },
          }),
        }
      );

      const aiData = await aiRes.json();
      let rawText =
        aiData?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (rawText) {
        rawText = rawText.replace(/```json|```/g, "").trim();
        const firstBrace = rawText.indexOf("{");
        const lastBrace = rawText.lastIndexOf("}");

        if (firstBrace !== -1 && lastBrace !== -1) {
          const cleanJson = rawText.substring(
            firstBrace,
            lastBrace + 1
          );
          analysis = JSON.parse(cleanJson);
        }
      }
    } catch (err) {
      console.log("Gemini failed → Continuing without AI analysis");
    }

    const charts = {
      stars: chartsStars,
      sentiment: analysis.charts?.sentiment || [
        { name: "إيجابي", value: 0 },
        { name: "سلبي", value: 0 },
      ],
      categories: analysis.charts?.categories || [],
    };

    res.json({
      place,
      reviews,
      analysis: {
        summary: analysis.summary,
        pros: analysis.pros || [],
        cons: analysis.cons || [],
        price: analysis.price || {},
        popularDishes: analysis.popularDishes || [],
        recommendation: analysis.recommendation,
        bestTimeToVisit: analysis.bestTimeToVisit,
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