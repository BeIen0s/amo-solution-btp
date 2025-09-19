import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">
            A.M.O Solution BTP
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Plateforme SaaS modulaire pour la gestion d'entreprises du secteur BTP
          </p>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">🚀 Application en cours de déploiement</h2>
            <p className="text-lg mb-6">
              Notre plateforme complète sera bientôt disponible avec :
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div>
                <h3 className="font-semibold mb-2">📊 Gestion Commerciale</h3>
                <ul className="space-y-1 text-sm opacity-90">
                  <li>• Clients et prospects</li>
                  <li>• Devis et factures</li>
                  <li>• Suivi des commandes</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🏗️ Gestion Opérationnelle</h3>
                <ul className="space-y-1 text-sm opacity-90">
                  <li>• Stock et inventaire</li>
                  <li>• Planning des chantiers</li>
                  <li>• Interventions techniques</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">👥 Gestion RH</h3>
                <ul className="space-y-1 text-sm opacity-90">
                  <li>• Équipes et permissions</li>
                  <li>• Suivi du temps</li>
                  <li>• Tableau de bord RH</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📈 Business Intelligence</h3>
                <ul className="space-y-1 text-sm opacity-90">
                  <li>• Tableaux de bord</li>
                  <li>• Rapports personnalisés</li>
                  <li>• Analytics avancées</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 p-4 bg-green-500/20 rounded-lg">
              <p className="text-green-100">
                ✅ Frontend déployé avec succès sur Netlify
              </p>
              <p className="text-green-100 text-sm mt-1">
                Backend et fonctionnalités à venir...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Helmet defaultTitle="A.M.O Solution BTP">
        <meta name="description" content="Plateforme SaaS modulaire pour la gestion d'entreprises du secteur BTP" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;