import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { AlertTriangle } from 'lucide-react';

const METRIC_DATA = [
  { metric: 'MAE (mm/day)', randomForest: 0.215553, xgboost: 0.224959, description: 'Mean Absolute Error (Lower is better)' },
  { metric: 'RMSE (mm/day)', randomForest: 0.319741, xgboost: 0.293889, description: 'Root Mean Squared Error (Lower is better)' },
];

export const MetricsComparison: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#D8E4D0]">
        <div>
          <h3 className="text-lg font-bold text-[#26352B]">
            Model Evaluation Metrics on Held-Out Test Split
          </h3>
          <p className="text-xs text-[#536B5C]">
            Evaluated on 14,608 daily records across 8 completely unseen test locations
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white border border-[#D8E4D0] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#EDF4E7] border-b border-[#C5DAC0] text-[#245C3A] font-extrabold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Evaluation Metric</th>
                <th className="py-3 px-4">Random Forest Regressor</th>
                <th className="py-3 px-4">XGBoost Regressor</th>
                <th className="py-3 px-4">Metric Trade-off & Best Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8F0E4] font-medium">
              <tr className="hover:bg-[#F8F7EF]">
                <td className="py-3 px-4 font-bold text-[#26352B]">
                  MAE <span className="text-xs text-[#536B5C] font-normal">(Mean Absolute Error)</span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-[#245C3A] bg-[#EDF4E7]/40">
                  0.215553 mm/day
                </td>
                <td className="py-3 px-4 font-mono text-[#26352B]">
                  0.224959 mm/day
                </td>
                <td className="py-3 px-4 text-xs text-[#245C3A] font-bold">
                  ✓ Random Forest achieves lower average absolute error
                </td>
              </tr>
              <tr className="hover:bg-[#F8F7EF]">
                <td className="py-3 px-4 font-bold text-[#26352B]">
                  RMSE <span className="text-xs text-[#536B5C] font-normal">(Root Mean Squared Error)</span>
                </td>
                <td className="py-3 px-4 font-mono text-[#26352B]">
                  0.319741 mm/day
                </td>
                <td className="py-3 px-4 font-mono font-bold text-[#3F86B5] bg-[#E8F1F7]/40">
                  0.293889 mm/day
                </td>
                <td className="py-3 px-4 text-xs text-[#3F86B5] font-bold">
                  ✓ XGBoost reduces large residual outliers
                </td>
              </tr>
              <tr className="hover:bg-[#F8F7EF]">
                <td className="py-3 px-4 font-bold text-[#26352B]">
                  R² <span className="text-xs text-[#536B5C] font-normal">(Coefficient of Determination)</span>
                </td>
                <td className="py-3 px-4 font-mono text-[#26352B]">
                  0.997057
                </td>
                <td className="py-3 px-4 font-mono font-bold text-[#3F86B5] bg-[#E8F1F7]/40">
                  0.997514
                </td>
                <td className="py-3 px-4 text-xs text-[#3F86B5] font-bold">
                  ✓ XGBoost accounts for marginally higher target variance
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Recharts Bar Comparison */}
      <div className="bg-white border border-[#D8E4D0] rounded-3xl p-6 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-[#26352B]">
          Error Metric Visual Comparison (Lower is Better)
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={METRIC_DATA} margin={{ top: 15, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F0E4" vertical={false} />
              <XAxis dataKey="metric" stroke="#536B5C" fontSize={12} tickLine={false} />
              <YAxis stroke="#536B5C" fontSize={12} domain={[0, 0.4]} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#C5DAC0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar name="Random Forest (200 trees)" dataKey="randomForest" fill="#3E7C45" radius={[6, 6, 0, 0]} />
              <Bar name="XGBoost (300 trees)" dataKey="xgboost" fill="#3F86B5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metric Definitions & Plain-Language Explanation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-white border border-[#D8E4D0] space-y-1.5 shadow-xs">
          <strong className="text-[#245C3A] block text-sm font-extrabold">MAE (Mean Absolute Error)</strong>
          <p className="text-[#536B5C] leading-relaxed">
            The average magnitude of errors between the prediction and formula target, treating all deviations equally. Both models stay within ~0.22 mm/day average deviation.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#D8E4D0] space-y-1.5 shadow-xs">
          <strong className="text-[#3F86B5] block text-sm font-extrabold">RMSE (Root Mean Squared Error)</strong>
          <p className="text-[#536B5C] leading-relaxed">
            Squares errors before averaging, penalizing larger outliers more severely. XGBoost achieves a lower RMSE (0.2939 vs 0.3197 mm/day).
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#D8E4D0] space-y-1.5 shadow-xs">
          <strong className="text-[#8B6848] block text-sm font-extrabold">R² (Coefficient of Determination)</strong>
          <p className="text-[#536B5C] leading-relaxed">
            Measures the proportion of variance in the formula target explained by the inputs relative to a horizontal mean baseline. Both exceed 0.997 on the test dataset.
          </p>
        </div>
      </div>

      {/* Critical Scientific Disclaimer on R² & Accuracy */}
      <div className="p-4 rounded-2xl bg-[#FFF9E6] border border-[#F0D58C] text-xs text-[#5C450B] flex items-start gap-2.5 leading-relaxed">
        <AlertTriangle className="w-4 h-4 text-[#D99A2B] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#8C6200] block mb-0.5">Scientific Evaluation Transparency:</strong>
          These results measure how accurately the algorithms approximate the simulated formula target on the selected test dataset. <strong>They do not establish real-world irrigation accuracy.</strong> R² is a measure of variance explanation, not an accuracy percentage, and must not be described as "99.7% accurate" in real-world agricultural conditions.
        </div>
      </div>
    </div>
  );
};
