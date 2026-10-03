import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';
import { MapPin } from 'lucide-react';

const HELD_OUT_LOCATION_METRICS = [
  { location: 'Kolhapur', state: 'MH', rfMae: 0.198, rfRmse: 0.285, xgbMae: 0.211, xgbRmse: 0.264 },
  { location: 'Meerut', state: 'UP', rfMae: 0.224, rfRmse: 0.334, xgbMae: 0.232, xgbRmse: 0.301 },
  { location: 'Belagavi', state: 'KA', rfMae: 0.187, rfRmse: 0.271, xgbMae: 0.195, xgbRmse: 0.252 },
  { location: 'Coimbatore', state: 'TN', rfMae: 0.208, rfRmse: 0.312, xgbMae: 0.219, xgbRmse: 0.288 },
  { location: 'Vijayawada', state: 'AP', rfMae: 0.231, rfRmse: 0.342, xgbMae: 0.241, xgbRmse: 0.315 },
  { location: 'Surat', state: 'GJ', rfMae: 0.218, rfRmse: 0.320, xgbMae: 0.228, xgbRmse: 0.296 },
  { location: 'Muzaffarnagar', state: 'UP', rfMae: 0.235, rfRmse: 0.348, xgbMae: 0.245, xgbRmse: 0.321 },
  { location: 'Mandya', state: 'KA', rfMae: 0.192, rfRmse: 0.279, xgbMae: 0.202, xgbRmse: 0.259 },
];

export const LocationPerformanceChart: React.FC = () => {
  const [metricType, setMetricType] = useState<'mae' | 'rmse'>('mae');

  const chartData = HELD_OUT_LOCATION_METRICS.map((loc) => ({
    name: `${loc.location} (${loc.state})`,
    'Random Forest': metricType === 'mae' ? loc.rfMae : loc.rfRmse,
    XGBoost: metricType === 'mae' ? loc.xgbMae : loc.xgbRmse,
  }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D8E4D0]">
        <div>
          <h3 className="text-lg font-bold text-[#26352B] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#3F86B5]" /> Location-Based Generalization (8 Held-Out Test Locations)
          </h3>
          <p className="text-xs text-[#536B5C]">
            Model performance on completely unseen geographic coordinates
          </p>
        </div>

        {/* Toggle MAE / RMSE */}
        <div className="flex items-center bg-[#EDF4E7] border border-[#C5DAC0] rounded-xl p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMetricType('mae')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              metricType === 'mae'
                ? 'bg-[#245C3A] text-white shadow-xs'
                : 'text-[#536B5C] hover:text-[#26352B]'
            }`}
          >
            MAE (mm/day)
          </button>
          <button
            type="button"
            onClick={() => setMetricType('rmse')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              metricType === 'rmse'
                ? 'bg-[#245C3A] text-white shadow-xs'
                : 'text-[#536B5C] hover:text-[#26352B]'
            }`}
          >
            RMSE (mm/day)
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#D8E4D0] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 15, right: 30, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F0E4" vertical={false} />
              <XAxis dataKey="name" stroke="#536B5C" fontSize={11} angle={-25} textAnchor="end" interval={0} />
              <YAxis stroke="#536B5C" fontSize={11} domain={[0, 0.4]} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#C5DAC0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />
              <Bar dataKey="Random Forest" fill="#3E7C45" radius={[6, 6, 0, 0]} />
              <Bar dataKey="XGBoost" fill="#3F86B5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#EDF4E7] border border-[#C5DAC0] text-xs text-[#26352B] leading-relaxed">
        <strong>Spatial Cross-Validation Insight:</strong> Holding out entire geographic coordinates during testing evaluates how well tree models interpolate across microclimates and radiation regimes without memorizing coordinates. Errors remain consistently bounded between 0.18 and 0.35 mm/day across all 8 states and districts.
      </div>
    </div>
  );
};
