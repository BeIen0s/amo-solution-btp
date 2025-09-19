import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="text-center">
        <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page non trouvée</h1>
        <p className="text-xl text-gray-600 mb-8">
          Désolé, la page que vous recherchez n'existe pas.
        </p>
        <div className="space-x-4">
          <Link
            to="/app"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            Retour au Dashboard
          </Link>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
          >
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;