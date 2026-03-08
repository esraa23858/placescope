export default function Loading({ text = "جاري التحليل بالذكاء الاصطناعي..." }) {
  return (
    <div className="text-center text-xl mt-6">
      ⏳ {text}
    </div>
  );
}