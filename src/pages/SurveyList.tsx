import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash, Search, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSurvey } from '../contexts/SurveyContext';
import { Survey } from '../types';

const SurveyList: React.FC = () => {
  const { surveys, loading, deleteSurvey, refreshSurveys } = useSurvey();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSurveys, setFilteredSurveys] = useState<Survey[]>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Filter surveys based on search term
  useEffect(() => {
    if (surveys.length > 0) {
      if (searchTerm.trim() === '') {
        setFilteredSurveys(surveys);
      } else {
        const term = searchTerm.toLowerCase();
        const filtered = surveys.filter(
          survey => 
            survey.name.toLowerCase().includes(term) || 
            survey.description.toLowerCase().includes(term)
        );
        setFilteredSurveys(filtered);
      }
    } else {
      setFilteredSurveys([]);
    }
  }, [searchTerm, surveys]);

  // Format date function
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    // Get user's browser locale as fallback
    const browserLocale = navigator.language;
    // Get locale from translations with browser locale as fallback
    const locale = t('common.locale', { defaultValue: browserLocale }) || 'en-US';
    
    try {
      return new Intl.DateTimeFormat(locale, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      // If the locale is invalid, fallback to en-US
      return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }
  };

  // Handle delete survey
  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (window.confirm(t('common.confirmDelete'))) {
      await deleteSurvey(id);
      await refreshSurveys();
    }
  };

  // Calculate total questions
  const getTotalQuestions = (survey: Survey): number => {
    return survey.sections.reduce((total, section) => {
      return total + section.questions.length;
    }, 0);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('surveyList.title')}</h1>
        <Link
          to="/surveys/new"
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          <span>{t('surveyList.createButton')}</span>
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder={t('surveyList.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredSurveys.length === 0 ? (
        <div className="card py-16">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ClipboardIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {t('surveyList.emptyMessage')}
            </h2>
            <Link to="/surveys/new" className="btn btn-primary inline-flex items-center mt-2">
              <Plus size={18} className="mr-1" />
              <span>{t('surveyList.createButton')}</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('surveyList.table.name')}
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    {t('surveyList.table.description')}
                  </th>
                  <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    {t('surveyList.table.sections')}
                  </th>
                  <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    {t('surveyList.table.questions')}
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    {t('surveyList.table.createdAt')}
                  </th>
                  <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('surveyList.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSurveys.map((survey) => (
                  <tr 
                    key={survey.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/surveys/edit/${survey.id}`)}
                  >
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{survey.name}</div>
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell">
                      <div className="text-sm text-gray-500 line-clamp-1">{survey.description}</div>
                    </td>
                    <td className="py-4 px-6 text-center hidden sm:table-cell">
                      <div className="text-sm text-gray-500">{survey.sections.length}</div>
                    </td>
                    <td className="py-4 px-6 text-center hidden sm:table-cell">
                      <div className="text-sm text-gray-500">{getTotalQuestions(survey)}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm text-gray-500">{formatDate(survey.createdAt)}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <Link
                          to={`/surveys/respond/${survey.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          onClick={(e) => e.stopPropagation()}
                          title={t('surveyList.actions.respond')}
                        >
                          <MessageSquare size={18} />
                        </Link>
                        <Link
                          to={`/surveys/edit/${survey.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          onClick={(e) => e.stopPropagation()}
                          title={t('surveyList.actions.edit')}
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={(e) => handleDelete(survey.id, e)}
                          className="text-red-600 hover:text-red-900"
                          title={t('surveyList.actions.delete')}
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple clipboard icon component
const ClipboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    />
  </svg>
);

export default SurveyList;