import React, { useState, useEffect } from 'react';
import { Trash, Plus, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Question, QuestionType, Option } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { surveyApi } from '../../services/api';

interface QuestionFormProps {
  question: Question;
  onChange: (updatedQuestion: Question) => void;
  onDelete: () => void;
  index: number;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  onChange,
  onDelete,
  index
}) => {
  const { t } = useTranslation();
  const [showReuseModal, setShowReuseModal] = useState(false);
  const [existingQuestions, setExistingQuestions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filter questions based on search term
  const filteredQuestions = searchTerm.trim() === ''
    ? existingQuestions
    : existingQuestions.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Handle question type change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as QuestionType;
    
    let newOptions: Option[] = [];
    if (
      (newType === QuestionType.SINGLE_CHOICE ||
        newType === QuestionType.MULTIPLE_CHOICE ||
        newType === QuestionType.DROPDOWN) &&
      question.options.length === 0
    ) {
      // Add two default options when changing to option-based types
      newOptions = [
        { id: uuidv4(), text: `${t('common.option')} 1` },
        { id: uuidv4(), text: `${t('common.option')} 2` }
      ];
    } else {
      newOptions = question.options;
    }

    onChange({
      ...question,
      type: newType,
      options: newOptions
    });
  };

  // Add new option
  const handleAddOption = () => {
    const newOption: Option = {
      id: uuidv4(),
      text: ''
    };
    
    onChange({
      ...question,
      options: [...question.options, newOption]
    });
  };

  // Update option text
  const handleOptionChange = (id: string, value: string) => {
    onChange({
      ...question,
      options: question.options.map(option =>
        option.id === id ? { ...option, text: value } : option
      )
    });
  };

  // Delete option
  const handleDeleteOption = (id: string) => {
    onChange({
      ...question,
      options: question.options.filter(option => option.id !== id)
    });
  };

  // Fetch existing questions
  const fetchExistingQuestions = async () => {
    setIsLoading(true);
    try {
      const questions = await surveyApi.getAllQuestions();
      setExistingQuestions(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reuse question
  const handleReuseQuestion = async (questionId: string) => {
    try {
      const fetchedQuestion = await surveyApi.getQuestionById(questionId);
      if (fetchedQuestion) {
        onChange({
          ...fetchedQuestion,
          id: question.id // Maintain the current question ID
        });
      }
      setShowReuseModal(false);
    } catch (error) {
      console.error('Error reusing question:', error);
    }
  };

  // Load existing questions when modal is opened
  useEffect(() => {
    if (showReuseModal) {
      fetchExistingQuestions();
    }
  }, [showReuseModal]);

  return (
    <div className="border border-gray-200 rounded-md p-4 mb-4 bg-white shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <div className="flex-1">
          <label htmlFor={`question-title-${index}`} className="form-label">
            {t('surveyForm.question.title')}
          </label>
          <input
            id={`question-title-${index}`}
            type="text"
            className="input"
            value={question.title}
            onChange={(e) => onChange({ ...question, title: e.target.value })}
            placeholder={t('surveyForm.question.title')}
          />
        </div>
        <div className="w-full md:w-1/3">
          <label htmlFor={`question-type-${index}`} className="form-label">
            {t('surveyForm.question.type')}
          </label>
          <select
            id={`question-type-${index}`}
            className="select"
            value={question.type}
            onChange={handleTypeChange}
          >
            <option value={QuestionType.TEXT}>{t('surveyForm.question.types.text')}</option>
            <option value={QuestionType.TEXTAREA}>{t('surveyForm.question.types.textarea')}</option>
            <option value={QuestionType.SINGLE_CHOICE}>{t('surveyForm.question.types.singleChoice')}</option>
            <option value={QuestionType.MULTIPLE_CHOICE}>{t('surveyForm.question.types.multipleChoice')}</option>
            <option value={QuestionType.DROPDOWN}>{t('surveyForm.question.types.dropdown')}</option>
          </select>
        </div>
      </div>

      <div className="flex items-center mb-4">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={question.required}
            onChange={(e) => onChange({ ...question, required: e.target.checked })}
          />
          <span className="ml-2 text-sm text-gray-700">{t('surveyForm.question.required')}</span>
        </label>
        
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            className="btn btn-outline btn-sm flex items-center gap-1"
            onClick={() => setShowReuseModal(true)}
          >
            <RefreshCw size={16} />
            <span>{t('surveyForm.question.reuseQuestion')}</span>
          </button>
          
          <button
            type="button"
            className="btn btn-outline btn-sm text-red-500 border-red-200 hover:bg-red-50"
            onClick={onDelete}
          >
            <Trash size={16} />
          </button>
        </div>
      </div>

      {/* Answer options for selection-type questions */}
      {(question.type === QuestionType.SINGLE_CHOICE ||
        question.type === QuestionType.MULTIPLE_CHOICE ||
        question.type === QuestionType.DROPDOWN) && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">{t('surveyForm.question.options')}</h4>
            <button
              type="button"
              className="btn btn-outline btn-sm flex items-center gap-1"
              onClick={handleAddOption}
            >
              <Plus size={16} />
              <span>{t('surveyForm.question.addOption')}</span>
            </button>
          </div>
          
          {question.options.length === 0 && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 text-yellow-800 rounded-md">
              <AlertCircle size={18} />
              <p className="text-sm">
                {t('surveyForm.question.option.noOptions')}
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            {question.options.map((option, optIndex) => (
              <div key={option.id} className="flex items-center gap-2">
                <div className="flex-grow">
                  <input
                    type="text"
                    className="input"
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    placeholder={`${t('surveyForm.question.option.text')} ${optIndex + 1}`}
                  />
                </div>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteOption(option.id)}
                >
                  <Trash size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reuse Question Modal */}
      {showReuseModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowReuseModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {t('surveyForm.question.reuseQuestion')}
                </h3>
                
                <div className="mb-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="input pl-10"
                      placeholder={t('surveyForm.question.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : filteredQuestions.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    {t('surveyForm.question.noQuestionsFound')}
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                      {filteredQuestions.map((q) => (
                        <li
                          key={q.id}
                          className="py-2 px-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                          onClick={() => handleReuseQuestion(q.id)}
                        >
                          <div>
                            <div className="text-sm font-medium text-gray-900">{q.title}</div>
                            <div className="text-xs text-gray-500 mt-1">{t(`surveyForm.question.types.${q.type}`)}</div>
                          </div>
                          <button className="text-blue-500 hover:text-blue-700">
                            <RefreshCw size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowReuseModal(false)}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionForm;