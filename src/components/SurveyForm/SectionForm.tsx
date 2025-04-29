import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trash, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Section, Question, QuestionType } from '../../types';
import QuestionForm from './QuestionForm';
import { v4 as uuidv4 } from 'uuid';

interface SectionFormProps {
  section: Section;
  onChange: (updatedSection: Section) => void;
  onDelete: () => void;
  index: number;
}

const SectionForm: React.FC<SectionFormProps> = ({ section, onChange, onDelete, index }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleQuestionChange = (questionIndex: number, updatedQuestion: Question) => {
    const updatedQuestions = [...section.questions];
    updatedQuestions[questionIndex] = updatedQuestion;
    onChange({
      ...section,
      questions: updatedQuestions
    });
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: uuidv4(),
      title: '',
      type: QuestionType.TEXT,
      required: false,
      options: []
    };
    
    onChange({
      ...section,
      questions: [...section.questions, newQuestion]
    });
  };

  const handleDeleteQuestion = (questionIndex: number) => {
    const updatedQuestions = section.questions.filter((_, i) => i !== questionIndex);
    onChange({
      ...section,
      questions: updatedQuestions
    });
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50 mb-6 shadow-sm">
      <div className="bg-gray-100 px-4 py-3 border-b border-gray-300 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-800">
            {t('surveyForm.section.title')} {index + 1}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? t('surveyForm.section.collapse') : t('surveyForm.section.expand')}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <button
            type="button"
            className="p-1 text-red-500 hover:text-red-700 focus:outline-none"
            onClick={onDelete}
            aria-label={t('surveyForm.section.delete')}
          >
            <Trash size={20} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="mb-4">
            <label htmlFor={`section-title-${index}`} className="form-label">
              {t('surveyForm.section.title')}
            </label>
            <input
              id={`section-title-${index}`}
              type="text"
              className="input"
              value={section.title}
              onChange={(e) => onChange({ ...section, title: e.target.value })}
              placeholder={t('surveyForm.section.title')}
            />
          </div>

          <div className="mb-4">
            <label htmlFor={`section-description-${index}`} className="form-label">
              {t('surveyForm.section.description')}
            </label>
            <textarea
              id={`section-description-${index}`}
              className="input"
              value={section.description}
              onChange={(e) => onChange({ ...section, description: e.target.value })}
              placeholder={t('surveyForm.section.description')}
              rows={2}
            />
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-md font-medium text-gray-700">
                {t('surveyForm.section.questions')}
              </h4>
              <button
                type="button"
                className="btn btn-primary btn-sm flex items-center gap-1"
                onClick={handleAddQuestion}
              >
                <Plus size={16} />
                <span>{t('surveyForm.section.addQuestion')}</span>
              </button>
            </div>

            {section.questions.length === 0 ? (
              <div className="bg-blue-50 text-blue-700 p-4 rounded-md text-center">
                <p>{t('surveyForm.section.noQuestions')}</p>
                <button
                  type="button"
                  className="btn btn-outline btn-sm mt-2 flex items-center gap-1 mx-auto"
                  onClick={handleAddQuestion}
                >
                  <Plus size={16} />
                  <span>{t('surveyForm.section.addQuestion')}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {section.questions.map((question, questionIndex) => (
                  <QuestionForm
                    key={question.id}
                    question={question}
                    onChange={(updatedQuestion) => handleQuestionChange(questionIndex, updatedQuestion)}
                    onDelete={() => handleDeleteQuestion(questionIndex)}
                    index={questionIndex}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionForm;