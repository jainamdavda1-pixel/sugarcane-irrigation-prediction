// ML Experiments Verified Dataset from sugarcane_ml_experiments_results
// Target: Formula-derived simulated daily irrigation-deficit proxy (mm/day)

export interface BaselineMetricRow {
  model: 'Random Forest' | 'XGBoost';
  split: 'train' | 'held_out_locations';
  n: number;
  mae: number;
  rmse: number;
  r2: number;
}

export interface LearningCurveRow {
  model: 'Random Forest' | 'XGBoost';
  training_fraction: number;
  training_rows: number;
  train_mae: number;
  val_mae: number;
  train_rmse: number;
  val_rmse: number;
}

export interface FeatureImportanceRow {
  model: 'Random Forest' | 'XGBoost';
  feature: string;
  importance: number;
}

export interface ShapImportanceRow {
  model: 'Random Forest' | 'XGBoost';
  feature: string;
  mean_absolute_shap_value: number;
}

export interface FeatureAblationRow {
  model: 'Random Forest' | 'XGBoost';
  feature_group: string;
  feature_group_label: string;
  n_features: number;
  test_mae: number;
  test_rmse: number;
  test_r2: number;
  description: string;
}

export interface PcaExperimentRow {
  model: 'Random Forest' | 'XGBoost';
  n_components: number;
  explained_variance_ratio_sum: number;
  test_mae: number;
  test_rmse: number;
  test_r2: number;
}

export interface WeatherClusterRow {
  cluster: number;
  name: string;
  n_test_rows: number;
  mean_temperature_c: number;
  mean_precipitation_mm_day: number;
  mean_relative_humidity_percent: number;
  rf_mae: number;
  rf_rmse: number;
  xgb_mae: number;
  xgb_rmse: number;
  description: string;
}

export interface LocationWiseErrorRow {
  location: string;
  state: string;
  district: string;
  model: 'Random Forest' | 'XGBoost';
  n: number;
  mae: number;
  rmse: number;
  mean_residual: number;
}

export interface SensitivityPoint {
  feature: string;
  feature_value: number;
  rf_pred: number;
  xgb_pred: number;
}

// 1. Baseline Metrics (from tables/new_split_baseline_metrics.csv)
export const BASELINE_METRICS: BaselineMetricRow[] = [
  { model: 'Random Forest', split: 'train', n: 56606, mae: 0.105643, rmse: 0.162570, r2: 0.999300 },
  { model: 'Random Forest', split: 'held_out_locations', n: 14608, mae: 0.215553, rmse: 0.319741, r2: 0.997057 },
  { model: 'XGBoost', split: 'train', n: 56606, mae: 0.175826, rmse: 0.229468, r2: 0.998604 },
  { model: 'XGBoost', split: 'held_out_locations', n: 14608, mae: 0.224959, rmse: 0.293889, r2: 0.997514 },
];

// 2. Learning Curves (from tables/learning_curves.csv)
export const LEARNING_CURVES: LearningCurveRow[] = [
  { model: 'Random Forest', training_fraction: 0.10, training_rows: 5660, train_mae: 0.187095, val_mae: 0.451869, train_rmse: 0.269405, val_rmse: 0.621027 },
  { model: 'Random Forest', training_fraction: 0.25, training_rows: 14151, train_mae: 0.151741, val_mae: 0.365110, train_rmse: 0.222967, val_rmse: 0.510813 },
  { model: 'Random Forest', training_fraction: 0.50, training_rows: 28303, train_mae: 0.127088, val_mae: 0.292758, train_rmse: 0.190225, val_rmse: 0.420604 },
  { model: 'Random Forest', training_fraction: 0.75, training_rows: 42454, train_mae: 0.114315, val_mae: 0.249443, train_rmse: 0.173510, val_rmse: 0.363854 },
  { model: 'Random Forest', training_fraction: 1.00, training_rows: 56606, train_mae: 0.105945, val_mae: 0.215870, train_rmse: 0.162903, val_rmse: 0.320577 },
  { model: 'XGBoost', training_fraction: 0.10, training_rows: 5660, train_mae: 0.130007, val_mae: 0.306353, train_rmse: 0.168337, val_rmse: 0.410150 },
  { model: 'XGBoost', training_fraction: 0.25, training_rows: 14151, train_mae: 0.158493, val_mae: 0.256376, train_rmse: 0.204187, val_rmse: 0.338239 },
  { model: 'XGBoost', training_fraction: 0.50, training_rows: 28303, train_mae: 0.167981, val_mae: 0.234692, train_rmse: 0.218906, val_rmse: 0.310308 },
  { model: 'XGBoost', training_fraction: 0.75, training_rows: 42454, train_mae: 0.172573, val_mae: 0.229867, train_rmse: 0.224856, val_rmse: 0.301365 },
  { model: 'XGBoost', training_fraction: 1.00, training_rows: 56606, train_mae: 0.174782, val_mae: 0.221871, train_rmse: 0.228398, val_rmse: 0.289496 },
];

// 3. Feature Importance (from tables/feature_importance.csv)
export const FEATURE_IMPORTANCE_DATA: FeatureImportanceRow[] = [
  { model: 'Random Forest', feature: 'temperature_max_c', importance: 0.636280 },
  { model: 'Random Forest', feature: 'precipitation_mm_day', importance: 0.320100 },
  { model: 'Random Forest', feature: 'solar_radiation_kwh_m2_day', importance: 0.013919 },
  { model: 'Random Forest', feature: 'temperature_min_c', importance: 0.008395 },
  { model: 'Random Forest', feature: 'sin_day_of_year', importance: 0.007242 },
  { model: 'Random Forest', feature: 'latitude', importance: 0.004351 },
  { model: 'Random Forest', feature: 'cos_day_of_year', importance: 0.004068 },
  { model: 'Random Forest', feature: 'relative_humidity_percent', importance: 0.003819 },
  { model: 'Random Forest', feature: 'longitude', importance: 0.000783 },
  { model: 'Random Forest', feature: 'temperature_mean_c', importance: 0.000534 },
  { model: 'Random Forest', feature: 'wind_speed_m_s', importance: 0.000508 },
  { model: 'XGBoost', feature: 'temperature_max_c', importance: 0.427859 },
  { model: 'XGBoost', feature: 'precipitation_mm_day', importance: 0.330101 },
  { model: 'XGBoost', feature: 'solar_radiation_kwh_m2_day', importance: 0.090946 },
  { model: 'XGBoost', feature: 'relative_humidity_percent', importance: 0.048034 },
  { model: 'XGBoost', feature: 'temperature_mean_c', importance: 0.046342 },
  { model: 'XGBoost', feature: 'sin_day_of_year', importance: 0.021661 },
  { model: 'XGBoost', feature: 'temperature_min_c', importance: 0.013080 },
  { model: 'XGBoost', feature: 'cos_day_of_year', importance: 0.010647 },
  { model: 'XGBoost', feature: 'latitude', importance: 0.006612 },
  { model: 'XGBoost', feature: 'longitude', importance: 0.003495 },
  { model: 'XGBoost', feature: 'wind_speed_m_s', importance: 0.001222 },
];

// 4. SHAP Global Importance (from tables/shap_global_importance.csv)
export const SHAP_IMPORTANCE_DATA: ShapImportanceRow[] = [
  { model: 'Random Forest', feature: 'temperature_max_c', mean_absolute_shap_value: 3.182325 },
  { model: 'Random Forest', feature: 'precipitation_mm_day', mean_absolute_shap_value: 2.755008 },
  { model: 'Random Forest', feature: 'temperature_min_c', mean_absolute_shap_value: 0.330638 },
  { model: 'Random Forest', feature: 'solar_radiation_kwh_m2_day', mean_absolute_shap_value: 0.327021 },
  { model: 'Random Forest', feature: 'cos_day_of_year', mean_absolute_shap_value: 0.309096 },
  { model: 'Random Forest', feature: 'sin_day_of_year', mean_absolute_shap_value: 0.241013 },
  { model: 'Random Forest', feature: 'latitude', mean_absolute_shap_value: 0.182455 },
  { model: 'Random Forest', feature: 'relative_humidity_percent', mean_absolute_shap_value: 0.113882 },
  { model: 'Random Forest', feature: 'longitude', mean_absolute_shap_value: 0.029437 },
  { model: 'Random Forest', feature: 'temperature_mean_c', mean_absolute_shap_value: 0.014102 },
  { model: 'Random Forest', feature: 'wind_speed_m_s', mean_absolute_shap_value: 0.008269 },
  { model: 'XGBoost', feature: 'temperature_max_c', mean_absolute_shap_value: 2.756232 },
  { model: 'XGBoost', feature: 'precipitation_mm_day', mean_absolute_shap_value: 2.589777 },
  { model: 'XGBoost', feature: 'cos_day_of_year', mean_absolute_shap_value: 0.653267 },
  { model: 'XGBoost', feature: 'temperature_min_c', mean_absolute_shap_value: 0.624669 },
  { model: 'XGBoost', feature: 'solar_radiation_kwh_m2_day', mean_absolute_shap_value: 0.404897 },
  { model: 'XGBoost', feature: 'relative_humidity_percent', mean_absolute_shap_value: 0.241405 },
  { model: 'XGBoost', feature: 'latitude', mean_absolute_shap_value: 0.233910 },
  { model: 'XGBoost', feature: 'sin_day_of_year', mean_absolute_shap_value: 0.233613 },
  { model: 'XGBoost', feature: 'temperature_mean_c', mean_absolute_shap_value: 0.142349 },
  { model: 'XGBoost', feature: 'longitude', mean_absolute_shap_value: 0.042915 },
  { model: 'XGBoost', feature: 'wind_speed_m_s', mean_absolute_shap_value: 0.014664 },
];

// 5. Feature Ablation Results (from tables/feature_ablation_results.csv)
export const FEATURE_ABLATION_DATA: FeatureAblationRow[] = [
  { model: 'Random Forest', feature_group: 'all_11_features', feature_group_label: 'Full Baseline (11 Features)', n_features: 11, test_mae: 0.215553, test_rmse: 0.319741, test_r2: 0.997057, description: 'All spatial, meteorological, and cyclical calendar harmonics.' },
  { model: 'Random Forest', feature_group: 'without_location', feature_group_label: 'Without Location (9 Features)', n_features: 9, test_mae: 0.267160, test_rmse: 0.387243, test_r2: 0.995684, description: 'Removed latitude and longitude.' },
  { model: 'Random Forest', feature_group: 'without_seasonal', feature_group_label: 'Without Seasonal Harmonics (9 Features)', n_features: 9, test_mae: 0.310448, test_rmse: 0.447712, test_r2: 0.994231, description: 'Removed sin_day_of_year and cos_day_of_year.' },
  { model: 'Random Forest', feature_group: 'weather_only', feature_group_label: 'Weather Only (7 Features)', n_features: 7, test_mae: 0.374534, test_rmse: 0.535415, test_r2: 0.991749, description: 'Only 7 meteorological variables without coordinates or calendar.' },
  { model: 'Random Forest', feature_group: 'location_and_seasonal_only', feature_group_label: 'Location & Seasonal Only (4 Features)', n_features: 4, test_mae: 2.572189, test_rmse: 3.622975, test_r2: 0.622195, description: 'Removed all 7 weather variables; relies only on geometry and date.' },
  { model: 'XGBoost', feature_group: 'all_11_features', feature_group_label: 'Full Baseline (11 Features)', n_features: 11, test_mae: 0.224959, test_rmse: 0.293889, test_r2: 0.997514, description: 'All spatial, meteorological, and cyclical calendar harmonics.' },
  { model: 'XGBoost', feature_group: 'without_location', feature_group_label: 'Without Location (9 Features)', n_features: 9, test_mae: 0.325995, test_rmse: 0.431476, test_r2: 0.994641, description: 'Removed latitude and longitude.' },
  { model: 'XGBoost', feature_group: 'without_seasonal', feature_group_label: 'Without Seasonal Harmonics (9 Features)', n_features: 9, test_mae: 0.415362, test_rmse: 0.553851, test_r2: 0.991171, description: 'Removed sin_day_of_year and cos_day_of_year.' },
  { model: 'XGBoost', feature_group: 'weather_only', feature_group_label: 'Weather Only (7 Features)', n_features: 7, test_mae: 0.480015, test_rmse: 0.639434, test_r2: 0.988231, description: 'Only 7 meteorological variables without coordinates or calendar.' },
  { model: 'XGBoost', feature_group: 'location_and_seasonal_only', feature_group_label: 'Location & Seasonal Only (4 Features)', n_features: 4, test_mae: 2.743239, test_rmse: 3.800986, test_r2: 0.584157, description: 'Removed all 7 weather variables; relies only on geometry and date.' },
];

// 6. PCA Experiment Results (from tables/pca_experiment_results.csv)
export const PCA_EXPERIMENT_DATA: PcaExperimentRow[] = [
  { model: 'Random Forest', n_components: 3, explained_variance_ratio_sum: 0.719761, test_mae: 1.291863, test_rmse: 1.960591, test_r2: 0.889360 },
  { model: 'Random Forest', n_components: 5, explained_variance_ratio_sum: 0.877020, test_mae: 0.992471, test_rmse: 1.541157, test_r2: 0.931635 },
  { model: 'Random Forest', n_components: 8, explained_variance_ratio_sum: 0.986106, test_mae: 0.630119, test_rmse: 0.916802, test_r2: 0.975807 },
  { model: 'XGBoost', n_components: 3, explained_variance_ratio_sum: 0.719761, test_mae: 1.398566, test_rmse: 2.065201, test_r2: 0.877239 },
  { model: 'XGBoost', n_components: 5, explained_variance_ratio_sum: 0.877020, test_mae: 1.178382, test_rmse: 1.758245, test_r2: 0.911019 },
  { model: 'XGBoost', n_components: 8, explained_variance_ratio_sum: 0.986106, test_mae: 0.688415, test_rmse: 0.911902, test_r2: 0.976065 },
];

// 7. Weather Cluster Summary (from tables/weather_cluster_error_summary.csv)
export const WEATHER_CLUSTER_DATA: WeatherClusterRow[] = [
  {
    cluster: 0,
    name: 'High Rain / Monsoon Regime',
    n_test_rows: 1365,
    mean_temperature_c: 26.14,
    mean_precipitation_mm_day: 20.47,
    mean_relative_humidity_percent: 85.74,
    rf_mae: 0.121672,
    rf_rmse: 0.246400,
    xgb_mae: 0.191802,
    xgb_rmse: 0.276006,
    description: 'Heavy precipitation spells, near-saturated atmospheric humidity. Deficit is frequently 0 mm/day due to high effective rainfall offset.',
  },
  {
    cluster: 1,
    name: 'Cool / Dry Winter Regime',
    n_test_rows: 2056,
    mean_temperature_c: 17.84,
    mean_precipitation_mm_day: 0.31,
    mean_relative_humidity_percent: 57.48,
    rf_mae: 0.160273,
    rf_rmse: 0.228542,
    xgb_mae: 0.192636,
    xgb_rmse: 0.243293,
    description: 'Mild daytime temperatures, low solar radiation, negligible rain. Low evaporative demand leads to modest, steady deficit estimates.',
  },
  {
    cluster: 2,
    name: 'Moderate / Humid Transition Regime',
    n_test_rows: 7159,
    mean_temperature_c: 25.50,
    mean_precipitation_mm_day: 2.93,
    mean_relative_humidity_percent: 77.25,
    rf_mae: 0.256425,
    rf_rmse: 0.367132,
    xgb_mae: 0.249724,
    xgb_rmse: 0.321081,
    description: 'Most common cluster in the test set. Moderate temperatures, fluctuating humidity and scattered light rainfall creating higher variance.',
  },
  {
    cluster: 3,
    name: 'Hot / Semi-Arid Summer Regime',
    n_test_rows: 4028,
    mean_temperature_c: 30.43,
    mean_precipitation_mm_day: 0.53,
    mean_relative_humidity_percent: 41.43,
    rf_mae: 0.202942,
    rf_rmse: 0.289785,
    xgb_mae: 0.208678,
    xgb_rmse: 0.271987,
    description: 'Intense shortwave solar flux, elevated temperatures, dry air. Peak evapotranspiration demand drives high simulated irrigation deficits.',
  },
];

// 8. Location-Wise Held-Out Errors (from tables/location_wise_errors_new_split.csv)
export const LOCATION_WISE_ERRORS: LocationWiseErrorRow[] = [
  { location: 'GJ02', state: 'Gujarat', district: 'Surat Belt', model: 'Random Forest', n: 1826, mae: 0.228469, rmse: 0.331161, mean_residual: -0.049477 },
  { location: 'GJ02', state: 'Gujarat', district: 'Surat Belt', model: 'XGBoost', n: 1826, mae: 0.197594, rmse: 0.261615, mean_residual: 0.035989 },
  { location: 'GJ04', state: 'Gujarat', district: 'Navsari Belt', model: 'Random Forest', n: 1826, mae: 0.154899, rmse: 0.234787, mean_residual: -0.007354 },
  { location: 'GJ04', state: 'Gujarat', district: 'Navsari Belt', model: 'XGBoost', n: 1826, mae: 0.215816, rmse: 0.282062, mean_residual: -0.050760 },
  { location: 'KA04', state: 'Karnataka', district: 'Belagavi Region', model: 'Random Forest', n: 1826, mae: 0.144925, rmse: 0.202833, mean_residual: 0.075430 },
  { location: 'KA04', state: 'Karnataka', district: 'Belagavi Region', model: 'XGBoost', n: 1826, mae: 0.192468, rmse: 0.245162, mean_residual: -0.000534 },
  { location: 'TN02', state: 'Tamil Nadu', district: 'Coimbatore Belt', model: 'Random Forest', n: 1826, mae: 0.332415, rmse: 0.449003, mean_residual: 0.091007 },
  { location: 'TN02', state: 'Tamil Nadu', district: 'Coimbatore Belt', model: 'XGBoost', n: 1826, mae: 0.268812, rmse: 0.340204, mean_residual: 0.139067 },
  { location: 'TN03', state: 'Tamil Nadu', district: 'Erode Belt', model: 'Random Forest', n: 1826, mae: 0.343902, rmse: 0.451612, mean_residual: 0.015150 },
  { location: 'TN03', state: 'Tamil Nadu', district: 'Erode Belt', model: 'XGBoost', n: 1826, mae: 0.301368, rmse: 0.380812, mean_residual: 0.192414 },
  { location: 'TS02', state: 'Telangana', district: 'Nizamabad Belt', model: 'Random Forest', n: 1826, mae: 0.121812, rmse: 0.181827, mean_residual: 0.013824 },
  { location: 'TS02', state: 'Telangana', district: 'Nizamabad Belt', model: 'XGBoost', n: 1826, mae: 0.197853, rmse: 0.256691, mean_residual: 0.064887 },
  { location: 'UP03', state: 'Uttar Pradesh', district: 'Meerut Belt', model: 'Random Forest', n: 1826, mae: 0.163184, rmse: 0.242940, mean_residual: 0.053925 },
  { location: 'UP03', state: 'Uttar Pradesh', district: 'Meerut Belt', model: 'XGBoost', n: 1826, mae: 0.218538, rmse: 0.278299, mean_residual: -0.077902 },
  { location: 'UP06', state: 'Uttar Pradesh', district: 'Muzaffarnagar Belt', model: 'Random Forest', n: 1826, mae: 0.234817, rmse: 0.338090, mean_residual: 0.019087 },
  { location: 'UP06', state: 'Uttar Pradesh', district: 'Muzaffarnagar Belt', model: 'XGBoost', n: 1826, mae: 0.207221, rmse: 0.280645, mean_residual: 0.006051 },
];

// 9. Selected Feature Sensitivity Samples (from tables/prediction_sensitivity.csv)
export const SENSITIVITY_SAMPLES: Record<string, SensitivityPoint[]> = {
  temperature_max_c: [
    { feature: 'temperature_max_c', feature_value: 15.0, rf_pred: 4.12, xgb_pred: 4.05 },
    { feature: 'temperature_max_c', feature_value: 20.0, rf_pred: 5.48, xgb_pred: 5.32 },
    { feature: 'temperature_max_c', feature_value: 25.0, rf_pred: 6.84, xgb_pred: 6.71 },
    { feature: 'temperature_max_c', feature_value: 30.0, rf_pred: 8.35, xgb_pred: 8.24 },
    { feature: 'temperature_max_c', feature_value: 35.0, rf_pred: 10.12, xgb_pred: 9.98 },
    { feature: 'temperature_max_c', feature_value: 40.0, rf_pred: 12.05, xgb_pred: 11.87 },
    { feature: 'temperature_max_c', feature_value: 45.0, rf_pred: 13.92, xgb_pred: 13.65 },
  ],
  precipitation_mm_day: [
    { feature: 'precipitation_mm_day', feature_value: 0.0, rf_pred: 9.54, xgb_pred: 9.38 },
    { feature: 'precipitation_mm_day', feature_value: 2.0, rf_pred: 7.94, xgb_pred: 7.78 },
    { feature: 'precipitation_mm_day', feature_value: 5.0, rf_pred: 5.54, xgb_pred: 5.38 },
    { feature: 'precipitation_mm_day', feature_value: 8.0, rf_pred: 3.14, xgb_pred: 2.98 },
    { feature: 'precipitation_mm_day', feature_value: 12.0, rf_pred: 0.00, xgb_pred: 0.00 },
    { feature: 'precipitation_mm_day', feature_value: 20.0, rf_pred: 0.00, xgb_pred: 0.00 },
    { feature: 'precipitation_mm_day', feature_value: 50.0, rf_pred: 0.00, xgb_pred: 0.00 },
  ],
  solar_radiation_kwh_m2_day: [
    { feature: 'solar_radiation_kwh_m2_day', feature_value: 2.0, rf_pred: 6.25, xgb_pred: 5.92 },
    { feature: 'solar_radiation_kwh_m2_day', feature_value: 4.0, rf_pred: 7.82, xgb_pred: 7.64 },
    { feature: 'solar_radiation_kwh_m2_day', feature_value: 6.0, rf_pred: 9.54, xgb_pred: 9.38 },
    { feature: 'solar_radiation_kwh_m2_day', feature_value: 8.0, rf_pred: 11.20, xgb_pred: 11.05 },
    { feature: 'solar_radiation_kwh_m2_day', feature_value: 10.0, rf_pred: 12.65, xgb_pred: 12.48 },
  ],
  relative_humidity_percent: [
    { feature: 'relative_humidity_percent', feature_value: 20.0, rf_pred: 10.45, xgb_pred: 10.22 },
    { feature: 'relative_humidity_percent', feature_value: 40.0, rf_pred: 9.88, xgb_pred: 9.65 },
    { feature: 'relative_humidity_percent', feature_value: 60.0, rf_pred: 9.54, xgb_pred: 9.38 },
    { feature: 'relative_humidity_percent', feature_value: 80.0, rf_pred: 8.92, xgb_pred: 8.75 },
    { feature: 'relative_humidity_percent', feature_value: 95.0, rf_pred: 8.15, xgb_pred: 8.02 },
  ],
  wind_speed_m_s: [
    { feature: 'wind_speed_m_s', feature_value: 1.0, rf_pred: 9.42, xgb_pred: 9.30 },
    { feature: 'wind_speed_m_s', feature_value: 2.5, rf_pred: 9.54, xgb_pred: 9.38 },
    { feature: 'wind_speed_m_s', feature_value: 4.0, rf_pred: 9.72, xgb_pred: 9.55 },
    { feature: 'wind_speed_m_s', feature_value: 6.0, rf_pred: 9.95, xgb_pred: 9.80 },
    { feature: 'wind_speed_m_s', feature_value: 8.0, rf_pred: 10.15, xgb_pred: 10.02 },
  ],
};
