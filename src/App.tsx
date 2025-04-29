import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SurveyList from './pages/SurveyList';
import SurveyForm from './pages/SurveyForm';
import SurveyResponse from './pages/SurveyResponse';
import { SurveyProvider } from './contexts/SurveyContext';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <SurveyProvider>
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/surveys" replace />} />
            <Route path="/surveys" element={<SurveyList />} />
            <Route path="/surveys/new" element={<SurveyForm />} />
            <Route path="/surveys/edit/:id" element={<SurveyForm />} />
            <Route path="/surveys/respond/:id" element={<SurveyResponse />} />
          </Routes>
        </main>
        <Footer />
      </SurveyProvider>
    </div>
  );
}

export default App;