import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSurvey } from '../contexts/SurveyContext';
import { Survey, QuestionType, QuestionResponse } from '../types';
import QuestionResponseComponent from '../components/SurveyResponse/QuestionResponse';
import { toast } from 'react-toastify';

const SurveyResponse: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getSurveyById, submitResponse } = useSurvey();
  
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  
  // Fetch survey data
  useEffect(() => {
    const fetchSurvey = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const surveyData = await getSurveyById(id);
          if (surveyData) {
            setSurvey(surveyData);
            
            // Initialize empty responses
            const initialResponses: Record<string, string | string[]> = {};
            surveyData.sections.forEach(section => {
              section.questions.forEach(question => {
                // Initialize based on question type
                if (question.type === QuestionType.MULTIPLE_CHOICE) {
                  initialResponses[question.id] = [];
                } else {
                  initialResponses[question.id] = '';
                }
              });
            });
            
            setResponses(initialResponses);
          }
        } catch (error) {
          console.error('Error fetching survey:', error);
          toast.error(t('common.error'));
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSurvey();
  }, [id, getSurveyById, t]);

  // Handle response change
  const handleResponseChange = (questionId: string, value: string | string[]) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !survey) return;
    
    // Validate required questions
    let isValid = true;
    let firstInvalidQuestion: HTMLElement | null = null;
    
    survey.sections.forEach(section => {
      section.questions.forEach(question => {
        if (question.required) {
          const response = responses[question.id];
          
          if (
            response === undefined || 
            response === '' || 
            (Array.isArray(response) && response.length === 0)
          ) {
            isValid = false;
            const element = document.getElementById(`question-${question.id}`);
            if (!firstInvalidQuestion && element) {
              firstInvalidQuestion = element;
            }
          }
        }
      });
    });
    
    if (!isValid) {
      toast.error(t('surveyResponse.incompleteForm'));
      if (firstInvalidQuestion) {
        firstInvalidQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Format responses for submission
    const formattedResponses: QuestionResponse[] = [];
    
    survey.sections.forEach(section => {
      section.questions.forEach(question => {
        const response = responses[question.id];
        
        formattedResponses.push({
          questionId: question.id,
          type: question.type,
          textValue: 
            (question.type === QuestionType.TEXT || 
             question.type === QuestionType.TEXTAREA) ? 
            (response as string) : undefined,
          selectedOptions: 
            (question.type === QuestionType.SINGLE_CHOICE || 
             question.type === QuestionType.MULTIPLE_CHOICE || 
             question.type === QuestionType.DROPDOWN) ? 
            (Array.isArray(response) ? response : [response as string]) : undefined
        });
      });
    });
    
    // Submit response
    setIsSubmitting(true);
    try {
      await submitResponse({
        surveyId: id,
        responses: formattedResponses
      });
      
      toast.success(t('surveyResponse.successMessage'));
      navigate('/surveys');
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error(t('surveyResponse.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold text-red-500">{t('surveyResponse.notFound')}</h2>
        <button
          className="btn btn-primary mt-4"
          onClick={() => navigate('/surveys')}
        >
          {t('common.back')}
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <button
          type="button"
          className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          onClick={() => navigate('/surveys')}
          aria-label={t('common.back')}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {t('surveyResponse.title')}
        </h1>
      </div>

      <div className="card mb-6">
        <div className="card-header">
          <h2 className="text-xl font-bold text-gray-800">{survey.name}</h2>
          {survey.description && (
            <p className="text-gray-600 mt-1">{survey.description}</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {survey.sections.map((section, sectionIndex) => (
          <div key={section.id} className="card mb-6 shadow-sm">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-800">
                {section.title || `${t('surveyForm.section.title')} ${sectionIndex + 1}`}
              </h3>
              {section.description && (
                <p className="text-gray-600 mt-1">{section.description}</p>
              )}
            </div>
            <div className="card-body">
              {section.questions.map(question => (
                <div key={question.id} id={`question-${question.id}`}>
                  <QuestionResponseComponent
                    question={question}
                    value={responses[question.id]}
                    onChange={(value) => handleResponseChange(question.id, value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/surveys')}
          >
            {t('surveyResponse.cancelButton')}
          </button>
          <button
            type="submit"
            className="btn btn-primary flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <Send size={18} />
            )}
            <span>{t('surveyResponse.submitButton')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SurveyResponse;