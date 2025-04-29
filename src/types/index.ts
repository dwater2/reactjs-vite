export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  required: boolean;
  options: Option[];
}

export enum QuestionType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SINGLE_CHOICE = 'singleChoice',
  MULTIPLE_CHOICE = 'multipleChoice',
  DROPDOWN = 'dropdown'
}

export interface Section {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface Survey {
  id: string;
  name: string;
  description: string;
  sections: Section[];
  createdAt: string;
}

export interface QuestionResponse {
  questionId: string;
  type: QuestionType;
  textValue?: string;
  selectedOptions?: string[];
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  responses: QuestionResponse[];
  submittedAt: string;
}