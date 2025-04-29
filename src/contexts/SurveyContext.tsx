import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Survey, SurveyResponse } from '../types';
import { surveyApi, responseApi } from '../services/api';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface SurveyContextType {
  surveys: Survey[];
  loading: boolean;
  createSurvey: (survey: Omit<Survey, 'id' | 'createdAt'>) => Promise<Survey>;
  updateSurvey: (id: string, survey: Omit<Survey, 'id' | 'createdAt'>) => Promise<Survey>;
  deleteSurvey: (id: string) => Promise<void>;
  getSurveyById: (id: string) => Promise<Survey | null>;
  submitResponse: (response: Omit<SurveyResponse, 'id' | 'submittedAt'>) => Promise<SurveyResponse>;
  refreshSurveys: () => Promise<void>;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const data = await surveyApi.getSurveys();
      setSurveys(data);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const createSurvey = async (survey: Omit<Survey, 'id' | 'createdAt'>) => {
    try {
      const newSurvey = await surveyApi.createSurvey(survey);
      setSurveys(prev => [...prev, newSurvey]);
      toast.success(t('common.success'));
      return newSurvey;
    } catch (error) {
      console.error('Error creating survey:', error);
      toast.error(t('common.error'));
      throw error;
    }
  };

  const updateSurvey = async (id: string, survey: Omit<Survey, 'id' | 'createdAt'>) => {
    try {
      const updatedSurvey = await surveyApi.updateSurvey(id, survey);
      setSurveys(prev => prev.map(s => s.id === id ? updatedSurvey : s));
      toast.success(t('common.success'));
      return updatedSurvey;
    } catch (error) {
      console.error('Error updating survey:', error);
      toast.error(t('common.error'));
      throw error;
    }
  };

  const deleteSurvey = async (id: string) => {
    try {
      await surveyApi.deleteSurvey(id);
      setSurveys(prev => prev.filter(s => s.id !== id));
      toast.success(t('common.success'));
    } catch (error) {
      console.error('Error deleting survey:', error);
      toast.error(t('common.error'));
      throw error;
    }
  };

  const getSurveyById = async (id: string) => {
    try {
      return await surveyApi.getSurveyById(id);
    } catch (error) {
      console.error('Error getting survey:', error);
      toast.error(t('common.error'));
      throw error;
    }
  };

  const submitResponse = async (response: Omit<SurveyResponse, 'id' | 'submittedAt'>) => {
    try {
      return await responseApi.submitResponse(response);
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error(t('common.error'));
      throw error;
    }
  };

  const refreshSurveys = async () => {
    await fetchSurveys();
  };

  return (
    <SurveyContext.Provider
      value={{
        surveys,
        loading,
        createSurvey,
        updateSurvey,
        deleteSurvey,
        getSurveyById,
        submitResponse,
        refreshSurveys
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};