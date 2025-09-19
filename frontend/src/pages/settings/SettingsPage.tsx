import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

type Tab = 'entreprise' | 'modules' | 'utilisateurs' | 'integrations' | 'facturation' | 'sauvegardes';

const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('entreprise');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  
  const [companySettings, setCompanySettings] = useState({
    name: 'A.M.O Solution BTP',
    siret: '12345678901234',
    address: '123 Rue de la Construction',
    city: 'Paris',
    zipCode: '75001',
    phone: '01 23 45 67 89',
    email: 'contact@amo-solution-btp.fr',
    website: 'www.amo-solution-btp.fr',
    logo: null,
    tvaNumber: 'FR12345678901',
    rcsNumber: 'RCS Paris B 123 456 789'
  });

  const [moduleSettings, setModuleSettings] = useState({
    stock: { enabled: true, autoAlerts: true, minStockThreshold: 10 },
    factures: { enabled: true, autoNumbering: true, defaultPaymentTerm: 30 },
    devis: { enabled: true, validityPeriod: 30, autoConvertToInvoice: false },
    clients: { enabled: true, duplicateCheck: true, mandatoryFields: ['name', 'email'] }
  });

  const [users] = useState([
    { id: '1', name: 'Admin Principal', email: 'admin@amo-solution.fr', role: 'admin', status: 'active', lastLogin: '2024-01-15' },
    { id: '2', name: 'Marie Dupont', email: 'marie@amo-solution.fr', role: 'manager', status: 'active', lastLogin: '2024-01-14' },
    { id: '3', name: 'Jean Martin', email: 'jean@amo-solution.fr', role: 'user', status: 'inactive', lastLogin: '2024-01-10' },
    { id: '4', name: 'Sophie Bernard', email: 'sophie@amo-solution.fr', role: 'comptable', status: 'active', lastLogin: '2024-01-15' }
  ]);

  const [integrations, setIntegrations] = useState({
    comptabilite: { sage: false, cegid: false, ebp: true },
    banque: { creditAgricole: true, bnp: false, societGenerale: false },
    paiement: { stripe: true, paypal: false, sumup: false },
    stockage: { dropbox: false, googleDrive: true, oneDrive: false }
  });

  const [billingSettings, setBillingSettings] = useState({
    defaultTva: 20,
    paymentTerms: [15, 30, 45, 60],
    lateFees: true,
    lateFeesRate: 3,
    reminderDays: [7, 3, 1],
    invoicePrefix: 'FACT-',
    quotePrefix: 'DEV-',
    logoOnDocuments: true
  });

  const tabs = [
    { id: 'entreprise', label: 'Entreprise', icon: '🏢' },
    { id: 'modules', label: 'Modules', icon: '🔧' },
    { id: 'utilisateurs', label: 'Utilisateurs', icon: '👥' },
    { id: 'integrations', label: 'Intégrations', icon: '🔗' },
    { id: 'facturation', label: 'Facturation', icon: '💰' },
    { id: 'sauvegardes', label: 'Sauvegardes', icon: '💾' }
  ];

  const handleCompanyChange = (field: string, value: any) => {
    setCompanySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleModuleToggle = (module: string, setting: string, value: any) => {
    setModuleSettings(prev => ({
      ...prev,
      [module]: { ...prev[module as keyof typeof prev], [setting]: value }
    }));
  };

  const handleIntegrationToggle = (category: string, service: string, value: boolean) => {
    setIntegrations(prev => ({
      ...prev,
      [category]: { ...prev[category as keyof typeof prev], [service]: value }
    }));
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-purple-100 text-purple-800',
      comptable: 'bg-orange-100 text-orange-800',
      user: 'bg-green-100 text-green-800'
    };
    return colors[role as keyof typeof colors] || colors.user;
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-8 mb-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl">
            ⚙️
          </div>
          <div>
            <h1 className="text-3xl font-bold">Paramètres système</h1>
            <p className="text-purple-100 text-lg">Configuration générale de A.M.O Solution BTP</p>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-6 px-6 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          {activeTab === 'entreprise' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Informations de l'entreprise</h2>
                <button
                  onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    isEditing
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {isEditing ? '✅ Enregistrer' : '✏️ Modifier'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise
                  </label>
                  <input
                    type="text"
                    value={companySettings.name}
                    onChange={(e) => handleCompanyChange('name', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                      isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SIRET
                  </label>
                  <input
                    type="text"
                    value={companySettings.siret}
                    onChange={(e) => handleCompanyChange('siret', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                      isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    N° TVA
                  </label>
                  <input
                    type="text"
                    value={companySettings.tvaNumber}
                    onChange={(e) => handleCompanyChange('tvaNumber', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                      isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'
                    }`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={companySettings.address}
                    onChange={(e) => handleCompanyChange('address', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                      isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    value={companySettings.zipCode}
                    onChange={(e) => handleCompanyChange('zipCode', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                      isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={companySettings.phone}
                    onChange={(e) => handleCompanyChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                      isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={companySettings.email}
                    onChange={(e) => handleCompanyChange('email', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                      isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site web
                  </label>
                  <input
                    type="url"
                    value={companySettings.website}
                    onChange={(e) => handleCompanyChange('website', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                      isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'
                    }`}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Logo de l'entreprise</h3>
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    {companySettings.logo ? (
                      <img src={companySettings.logo} alt="Logo" className="w-20 h-20 object-contain" />
                    ) : (
                      <span className="text-gray-400 text-2xl">🏢</span>
                    )}
                  </div>
                  {isEditing && (
                    <div>
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm">
                        📷 Changer le logo
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        Format recommandé : PNG, JPG (max. 2MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'modules' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Configuration des modules</h2>
              
              <div className="space-y-6">
                {Object.entries(moduleSettings).map(([module, settings]) => (
                  <div key={module} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 capitalize">
                        📦 Module {module}
                      </h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.enabled}
                          onChange={(e) => handleModuleToggle(module, 'enabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    
                    {settings.enabled && (
                      <div className="space-y-3 pl-6 border-l-2 border-purple-200">
                        {Object.entries(settings).filter(([key]) => key !== 'enabled').map(([setting, value]) => (
                          <div key={setting} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 capitalize">
                              {setting.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </span>
                            {typeof value === 'boolean' ? (
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={value}
                                  onChange={(e) => handleModuleToggle(module, setting, e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            ) : (
                              <input
                                type="number"
                                value={value as number}
                                onChange={(e) => handleModuleToggle(module, setting, parseInt(e.target.value))}
                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'utilisateurs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Gestion des utilisateurs</h2>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    ➕ Ajouter un utilisateur
                  </button>
                )}
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dernière connexion
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status === 'active' ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.lastLogin).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 p-1 rounded" title="Modifier">
                              ✏️
                            </button>
                            <button className="text-red-600 hover:text-red-900 p-1 rounded" title="Supprimer">
                              🗑️
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

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Intégrations tierces</h2>
              
              <div className="space-y-6">
                {Object.entries(integrations).map(([category, services]) => (
                  <div key={category} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 capitalize">
                      🔗 {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(services).map(([service, enabled]) => (
                        <div key={service} className="flex items-center justify-between p-3 bg-white rounded border">
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {service}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={(e) => handleIntegrationToggle(category, service, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'facturation' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Paramètres de facturation</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TVA par défaut (%)
                    </label>
                    <input
                      type="number"
                      value={billingSettings.defaultTva}
                      onChange={(e) => setBillingSettings(prev => ({ ...prev, defaultTva: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Préfixe des factures
                    </label>
                    <input
                      type="text"
                      value={billingSettings.invoicePrefix}
                      onChange={(e) => setBillingSettings(prev => ({ ...prev, invoicePrefix: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Préfixe des devis
                    </label>
                    <input
                      type="text"
                      value={billingSettings.quotePrefix}
                      onChange={(e) => setBillingSettings(prev => ({ ...prev, quotePrefix: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={billingSettings.lateFees}
                        onChange={(e) => setBillingSettings(prev => ({ ...prev, lateFees: e.target.checked }))}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Pénalités de retard</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={billingSettings.logoOnDocuments}
                        onChange={(e) => setBillingSettings(prev => ({ ...prev, logoOnDocuments: e.target.checked }))}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Logo sur les documents</span>
                    </label>
                  </div>
                </div>
              </div>

              <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                💾 Enregistrer les paramètres
              </button>
            </div>
          )}

          {activeTab === 'sauvegardes' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Sauvegardes et maintenance</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-green-900 mb-4">💾 Sauvegarde automatique</h3>
                  <p className="text-sm text-green-700 mb-4">
                    Dernière sauvegarde : Aujourd'hui à 03:00
                  </p>
                  <div className="space-y-3">
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                      🔄 Lancer une sauvegarde manuelle
                    </button>
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      📥 Télécharger la dernière sauvegarde
                    </button>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-orange-900 mb-4">🔧 Maintenance</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700">
                      🧹 Nettoyer les fichiers temporaires
                    </button>
                    <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                      📊 Optimiser la base de données
                    </button>
                    <button className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                      🔄 Redémarrer le système
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-yellow-900 mb-4">⚠️ Zone dangereuse</h3>
                <p className="text-sm text-yellow-700 mb-4">
                  Ces actions peuvent affecter le fonctionnement de l'application. Utilisez avec précaution.
                </p>
                <div className="space-x-4">
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                    🗑️ Réinitialiser les données
                  </button>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                    📤 Exporter toutes les données
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
