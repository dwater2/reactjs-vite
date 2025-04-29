import { Survey, SurveyResponse } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock data in "localStorage"
const STORAGE_KEY = 'survey-engine-data';

interface StoredData {
  surveys: Survey[];
  responses: SurveyResponse[];
}

// Initialize mock data if it doesn't exist
const initializeStorage = (): StoredData => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (storedData) {
    return JSON.parse(storedData);
  }

  const initialData: StoredData = {
    surveys: [],
    responses: []
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
};

// Get stored data
const getStoredData = (): StoredData => {
  return initializeStorage();
};

// Save data to storage
const saveData = (data: StoredData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// API service for surveys
export const surveyApi = {
  // Get all surveys
  getSurveys: async (): Promise<Survey[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getStoredData();
        resolve(data.surveys);
      }, 300);
    });
  },

  // Get survey by ID
  getSurveyById: async (id: string): Promise<Survey | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getStoredData();
        const survey = data.surveys.find(s => s.id === id) || null;
        resolve(survey);
      }, 300);
    });
  },

  // Create a new survey
  createSurvey: async (survey: Omit<Survey, 'id' | 'createdAt'>): Promise<Survey> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getStoredData();
        const newSurvey: Survey = {
          ...survey,
          id: uuidv4(),
          createdAt: new Date().toISOString()
        };
        data.surveys.push(newSurvey);
        saveData(data);
        resolve(newSurvey);
      }, 500);
    });
  },

  // Update an existing survey
  updateSurvey: async (id: string, survey: Omit<Survey, 'id' | 'createdAt'>): Promise<Survey> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = getStoredData();
        const index = data.surveys.findIndex(s => s.id === id);
        
        if (index === -1) {
          reject(new Error('Survey not found'));
          return;
        }
        
        const updatedSurvey: Survey = {
          ...survey,
          id,
          createdAt: data.surveys[index].createdAt
        };
        
        data.surveys[index] = updatedSurvey;
        saveData(data);
        resolve(updatedSurvey);
      }, 500);
    });
  },

  // Delete a survey
  deleteSurvey: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getStoredData();
        data.surveys = data.surveys.filter(s => s.id !== id);
        saveData(data);
        resolve();
      }, 500);
    });
  },

  // Get all existing questions (for reuse)
  getAllQuestions: async (): Promise<{ id: string; title: string; type: string }[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getStoredData();
        const questions: { id: string; title: string; type: string }[] = [];
        
        data.surveys.forEach(survey => {
          survey.sections.forEach(section => {
            section.questions.forEach(question => {
              // Only add if not already in the array (by title)
              if (!questions.some(q => q.title === question.title)) {
                questions.push({
                  id: question.id,
                  title: question.title,
                  type: question.type
                });
              }
            });
          });
        });
        
        resolve(questions);
      }, 300);
    });
  },

  // Get a specific question by ID
  getQuestionById: async (id: string): Promise<any | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getStoredData();
        let foundQuestion = null;
        
        outerLoop:
        for (const survey of data.surveys) {
          for (const section of survey.sections) {
            for (const question of section.questions) {
              if (question.id === id) {
                foundQuestion = question;
                break outerLoop;
              }
            }
          }
        }
        
        resolve(foundQuestion);
      }, 300);
    });
  }
};

// API service for survey responses
export const responseApi = {
  // Submit a survey response
  submitResponse: async (response: Omit<SurveyResponse, 'id' | 'submittedAt'>): Promise<SurveyResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getStoredData();
        const newResponse: SurveyResponse = {
          ...response,
          id: uuidv4(),
          submittedAt: new Date().toISOString()
        };
        data.responses.push(newResponse);
        saveData(data);
        resolve(newResponse);
      }, 500);
    });
  },

  // Get responses for a specific survey
  getResponsesBySurveyId: async (surveyId: string): Promise<SurveyResponse[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getStoredData();
        const responses = data.responses.filter(r => r.surveyId === surveyId);
        resolve(responses);
      }, 300);
    });
  }
};