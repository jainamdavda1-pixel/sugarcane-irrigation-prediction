import React, { createContext, useContext, useState, useEffect } from 'react';
import type { PredictionResponse, StoredPredictionRecord } from '../types/api';

interface HistoryContextType {
  history: StoredPredictionRecord[];
  addRecord: (pred: PredictionResponse) => void;
  clearHistory: () => void;
  removeRecord: (id: string) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const STORAGE_KEY = 'sugarcane_prediction_history_v1';

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<StoredPredictionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Could not save history to localStorage', e);
    }
  }, [history]);

  const addRecord = (pred: PredictionResponse) => {
    const newRecord: StoredPredictionRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      location: pred.location,
      plantingDate: pred.planting_date,
      predictionDate: pred.prediction_date,
      cropAgeDays: pred.crop_age_days,
      weather: pred.weather,
      soil: pred.soil,
      predictions: pred.predictions,
    };

    setHistory((prev) => [newRecord, ...prev.slice(0, 19)]); // keep last 20
  };

  const removeRecord = (id: string) => {
    setHistory((prev) => prev.filter((r) => r.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <HistoryContext.Provider value={{ history, addRecord, clearHistory, removeRecord }}>
      {children}
    </HistoryContext.Provider>
  );
};

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
