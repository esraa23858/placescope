import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const SENTIMENT_COLORS = ["#22c55e", "#ef4444"];
const BAR_COLOR = "#3b82f6";

export default function ChartsSection({ charts }) {
  if (!charts) {
    return (
      <div className="bg-slate-800 p-4 rounded-xl mb-4 border border-slate-700">
        <p className="text-slate-400">لا توجد بيانات للرسوم البيانية</p>
      </div>
    );
  }

  const { stars = [], sentiment = [], categories = [] } = charts;

  return (
    <div className="bg-slate-800 p-5 rounded-xl mb-4 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-4">📊 الرسومات البيانية</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Bar: توزيع التقييمات حسب عدد النجوم (1-5) */}
        <div>
          <h3 className="text-slate-300 text-sm mb-2">توزيع النجوم</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stars} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Bar dataKey="value" fill={BAR_COLOR} name="عدد المراجعات" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie: نسبة الإيجابي vs السلبي */}
        <div>
          <h3 className="text-slate-300 text-sm mb-2">نسبة الآراء الإيجابية والسلبية</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={sentiment}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {sentiment.map((_, i) => (
                  <Cell key={i} fill={SENTIMENT_COLORS[i % SENTIMENT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Radar: تقييم الفئات */}
        <div>
          <h3 className="text-slate-300 text-sm mb-2">تقييم الفئات</h3>
          {categories.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={categories} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  tickLine={false}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "#64748b", fontSize: 10 }}
                />
                <Radar
                  name="التقييم"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-sm">لا توجد بيانات الرادار</p>
          )}
        </div>
      </div>
    </div>
  );
}
