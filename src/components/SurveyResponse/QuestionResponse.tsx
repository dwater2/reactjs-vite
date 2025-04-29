import React from 'react';
import { QuestionType, Question } from '../../types';

interface QuestionResponseProps {
  question: Question;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

const QuestionResponse: React.FC<QuestionResponseProps> = ({
  question,
  value,
  onChange
}) => {
  // Handle text input change
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Handle radio button change (single choice)
  const handleSingleChoiceChange = (optionId: string) => {
    onChange(optionId);
  };

  // Handle checkbox change (multiple choice)
  const handleMultipleChoiceChange = (optionId: string, checked: boolean) => {
    const currentValue = Array.isArray(value) ? value : [];
    
    if (checked) {
      onChange([...currentValue, optionId]);
    } else {
      onChange(currentValue.filter(id => id !== optionId));
    }
  };

  // Handle dropdown change
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  // Render input based on question type
  const renderInput = () => {
    switch (question.type) {
      case QuestionType.TEXT:
        return (
          <input
            type="text"
            className="input"
            value={value as string}
            onChange={handleTextChange}
            required={question.required}
          />
        );
        
      case QuestionType.TEXTAREA:
        return (
          <textarea
            className="input"
            value={value as string}
            onChange={handleTextChange}
            rows={4}
            required={question.required}
          />
        );
        
      case QuestionType.SINGLE_CHOICE:
        return (
          <div className="space-y-2">
            {question.options.map(option => (
              <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  checked={(value as string) === option.id}
                  onChange={() => handleSingleChoiceChange(option.id)}
                  required={question.required && value === ''}
                />
                <span className="text-gray-700">{option.text}</span>
              </label>
            ))}
          </div>
        );
        
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <div className="space-y-2">
            {question.options.map(option => (
              <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  checked={Array.isArray(value) && value.includes(option.id)}
                  onChange={(e) => handleMultipleChoiceChange(option.id, e.target.checked)}
                  required={question.required && Array.isArray(value) && value.length === 0}
                />
                <span className="text-gray-700">{option.text}</span>
              </label>
            ))}
          </div>
        );
        
      case QuestionType.DROPDOWN:
        return (
          <select
            className="select"
            value={value as string}
            onChange={handleDropdownChange}
            required={question.required}
          >
            <option value="">-- Selecione uma opção --</option>
            {question.options.map(option => (
              <option key={option.id} value={option.id}>
                {option.text}
              </option>
            ))}
          </select>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="mb-6">
      <label className="block mb-2">
        <span className="text-gray-700 font-medium">
          {question.title}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </label>
      {renderInput()}
    </div>
  );
};

export default QuestionResponse;