import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Save, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSurvey } from '../contexts/SurveyContext';
import { Survey, Section } from '../types';
import SectionForm from '../components/SurveyForm/SectionForm';
import { v4 as uuidv4 } from 'uuid';

const SurveyForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { createSurvey, updateSurvey, getSurveyById } = useSurvey();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [survey, setSurvey] = useState<Omit<Survey, 'id' | 'createdAt'>>({
    name: '',
    description: '',
    sections: []
  });

  const isEditMode = !!id;

  // Fetch survey data if in edit mode
  useEffect(() => {
    const fetchSurvey = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const surveyData = await getSurveyById(id);
          if (surveyData) {
            setSurvey({
              name: surveyData.name,
              description: surveyData.description,
              sections: surveyData.sections
            });
          }
        } catch (error) {
          console.error('Error fetching survey:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSurvey();
  }, [id, getSurveyById]);

  // Add a new section
  const handleAddSection = () => {
    const newSection: Section = {
      id: uuidv4(),
      title: '',
      description: '',
      questions: []
    };
    
    setSurvey(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  // Update a section
  const handleSectionChange = (sectionIndex: number, updatedSection: Section) => {
    const updatedSections = [...survey.sections];
    updatedSections[sectionIndex] = updatedSection;
    
    setSurvey(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  // Delete a section
  const handleDeleteSection = (sectionIndex: number) => {
    setSurvey(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== sectionIndex)
    }));
  };

  // Save the survey
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isEditMode && id) {
        await updateSurvey(id, survey);
      } else {
        await createSurvey(survey);
      }
      navigate('/surveys');
    } catch (error) {
      console.error('Error saving survey:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
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
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? t('surveyForm.editTitle') : t('surveyForm.createTitle')}
        </h1>
      </div>

      <div className="card mb-6">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-800">{t('surveyForm.surveyDetails')}</h2>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="survey-name" className="form-label">
              {t('surveyForm.name')} <span className="text-red-500">*</span>
            </label>
            <input
              id="survey-name"
              type="text"
              className="input"
              value={survey.name}
              onChange={(e) => setSurvey(prev => ({ ...prev, name: e.target.value }))}
              placeholder={t('surveyForm.name')}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="survey-description" className="form-label">
              {t('surveyForm.description')}
            </label>
            <textarea
              id="survey-description"
              className="input"
              value={survey.description}
              onChange={(e) => setSurvey(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t('surveyForm.description')}
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-medium text-gray-800">{t('surveyForm.sections')}</h2>
          <button
            type="button"
            className="btn btn-primary flex items-center gap-1"
            onClick={handleAddSection}
          >
            <Plus size={18} />
            <span>{t('surveyForm.addSection')}</span>
          </button>
        </div>

        {survey.sections.length === 0 ? (
          <div className="card py-12">
            <div className="text-center">
              <p className="text-gray-600 mb-4">{t('surveyForm.noSections')}</p>
              <button
                type="button"
                className="btn btn-primary flex items-center gap-1 mx-auto"
                onClick={handleAddSection}
              >
                <Plus size={18} />
                <span>{t('surveyForm.addSection')}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {survey.sections.map((section, sectionIndex) => (
              <SectionForm
                key={section.id}
                section={section}
                onChange={(updatedSection) => handleSectionChange(sectionIndex, updatedSection)}
                onDelete={() => handleDeleteSection(sectionIndex)}
                index={sectionIndex}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => navigate('/surveys')}
        >
          {t('surveyForm.cancelButton')}
        </button>
        <button
          type="button"
          className="btn btn-primary flex items-center gap-2"
          onClick={handleSave}
          disabled={isSaving || !survey.name.trim() || survey.sections.length === 0}
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            <Save size={18} />
          )}
          <span>{t('surveyForm.saveButton')}</span>
        </button>
      </div>
    </div>
  );
};

export default SurveyForm;