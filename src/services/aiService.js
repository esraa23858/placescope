import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function analyzeReviews(reviewsText) {
  const prompt = `
حلل مراجعات المطعم التالية واعطني:
- التقييم العام
- أهم الإيجابيات
- أهم السلبيات
- هل تنصح به أم لا

المراجعات:
${reviewsText}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}