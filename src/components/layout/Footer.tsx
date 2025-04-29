import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">{t('app.title')}</h3>
            <p className="text-gray-400 text-sm mt-1">{t('app.description')}</p>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-400">
              &copy; {currentYear} {t('app.title')}
            </span>
            <span className="mx-2 text-gray-500">•</span>
            <span className="text-sm text-gray-400 flex items-center">
              {t('common.loading')}
              <Heart size={14} className="ml-1 text-red-500" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;