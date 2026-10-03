import React, { useState } from 'react';
import {
  BrainCircuit,
  Award,
  TrendingUp,
  Sparkles,
  Layers,
  Network,
  CloudRain,
  Sliders,
  MapPin,
  Database,
} from 'lucide-react';

import { ModelOverviewCard } from '../components/ml/ModelOverviewCard';
import { BaselineEvaluationSection } from '../components/research/BaselineEvaluationSection';
import { LearningCurvesSection } from '../components/research/LearningCurvesSection';
import { FeatureImportanceShapSection } from '../components/research/FeatureImportanceShapSection';
import { FeatureAblationSection } from '../components/research/FeatureAblationSection';
import { PcaExperimentSection } from '../components/research/PcaExperimentSection';
import { WeatherClustersSection } from '../components/research/WeatherClustersSection';
import { SensitivityAnalysisSection } from '../components/research/SensitivityAnalysisSection';
import { LocationResidualsSection } from '../components/research/LocationResidualsSection';
import { DataQualityAuditSection } from '../components/research/DataQualityAuditSection';

type TabKey =
  | 'baseline'
  | 'overview'
  | 'learning'
  | 'shap'
  | 'ablation'
  | 'pca'
  | 'clusters'
  | 'sensitivity'
  | 'locations'
  | 'quality';

export const ModelLabPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('baseline');

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'baseline', label: '1. Baseline Metrics', icon: Award },
    { key: 'overview', label: '2. Architectures & Target', icon: BrainCircuit },
    { key: 'learning', label: '3. Learning Curves', icon: TrendingUp },
    { key: 'shap', label: '4. Importance & SHAP', icon: Sparkles },
    { key: 'ablation', label: '5. Feature Ablation', icon: Layers },
    { key: 'pca', label: '6. PCA Experiments', icon: Network },
    { key: 'clusters', label: '7. Weather Regimes', icon: CloudRain },
    { key: 'sensitivity', label: '8. 1D Sensitivity', icon: Sliders },
    { key: 'locations', label: '9. Location Errors', icon: MapPin },
    { key: 'quality', label: '10. Data Quality Audit', icon: Database },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-[#D8E4D0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#EDF4E7] text-[#245C3A]">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#26352B]">
                ML Research Lab & Experiment Analytics
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EDF4E7] text-[#245C3A] border border-[#C5DAC0]">
                Verified Colab Suite
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#536B5C]">
              Interactive visualization of all 10 ML experiments: baseline performance, bias-variance learning curves, SHAP interpretability, feature ablation, PCA, weather clustering, and spatial generalization.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#E8F0E4]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#245C3A] text-white shadow-xs'
                    : 'bg-[#F8F7EF] text-[#536B5C] hover:bg-[#EDF4E7] hover:text-[#26352B]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Content */}
      <div className="space-y-8">
        {activeTab === 'baseline' && <BaselineEvaluationSection />}
        {activeTab === 'overview' && <ModelOverviewCard />}
        {activeTab === 'learning' && <LearningCurvesSection />}
        {activeTab === 'shap' && <FeatureImportanceShapSection />}
        {activeTab === 'ablation' && <FeatureAblationSection />}
        {activeTab === 'pca' && <PcaExperimentSection />}
        {activeTab === 'clusters' && <WeatherClustersSection />}
        {activeTab === 'sensitivity' && <SensitivityAnalysisSection />}
        {activeTab === 'locations' && <LocationResidualsSection />}
        {activeTab === 'quality' && <DataQualityAuditSection />}
      </div>
    </div>
  );
};
