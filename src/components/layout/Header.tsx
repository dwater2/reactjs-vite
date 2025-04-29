import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-primary-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <ClipboardList size={24} />
            <span className="text-xl font-bold">{t('app.title')}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/surveys"
              className={`hover:text-primary-200 transition-colors ${
                isActive('/surveys') ? 'text-white font-medium' : 'text-primary-100'
              }`}
            >
              {t('navigation.surveys')}
            </Link>
            <Link
              to="/surveys/new"
              className={`hover:text-primary-200 transition-colors ${
                isActive('/surveys/new') ? 'text-white font-medium' : 'text-primary-100'
              }`}
            >
              {t('navigation.createSurvey')}
            </Link>
            <div className="relative group">
              <button className="flex items-center space-x-1 hover:text-primary-200 transition-colors">
                <Globe size={18} />
                <span>{t('navigation.language')}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <button
                  onClick={() => changeLanguage('pt')}
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                    i18n.language === 'pt' ? 'font-medium bg-gray-50' : ''
                  }`}
                >
                  Português
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                    i18n.language === 'en' ? 'font-medium bg-gray-50' : ''
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link
                to="/surveys"
                className={`hover:text-primary-200 transition-colors ${
                  isActive('/surveys') ? 'text-white font-medium' : 'text-primary-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.surveys')}
              </Link>
              <Link
                to="/surveys/new"
                className={`hover:text-primary-200 transition-colors ${
                  isActive('/surveys/new') ? 'text-white font-medium' : 'text-primary-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.createSurvey')}
              </Link>
              <div className="py-2 border-t border-primary-700">
                <p className="text-primary-200 mb-2">{t('navigation.language')}</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => changeLanguage('pt')}
                    className={`text-sm ${
                      i18n.language === 'pt' ? 'text-white font-medium' : 'text-primary-100'
                    }`}
                  >
                    Português
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`text-sm ${
                      i18n.language === 'en' ? 'text-white font-medium' : 'text-primary-100'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;