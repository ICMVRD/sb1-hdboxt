import React, { useState } from 'react';
import { getConfig, updateConfig } from '../lib/config';
import { initializeFirebase } from '../lib/firebase';
import toast from 'react-hot-toast';
import { Settings, Database, Church } from 'lucide-react';

export function DeveloperSettings({ onClose }: { onClose: () => void }) {
  const config = getConfig();
  const [churchName, setChurchName] = useState(config.churchName);
  const [churchBranch, setChurchBranch] = useState(config.churchBranch);
  const [firebaseConfig, setFirebaseConfig] = useState(config.firebase);

  const handleSave = () => {
    try {
      const newConfig = {
        ...config,
        churchName,
        churchBranch,
        firebase: firebaseConfig
      };
      
      // Update config in localStorage
      updateConfig(newConfig);
      
      // Reinitialize Firebase with new config
      try {
        initializeFirebase(firebaseConfig);
        toast.success('Configurações atualizadas com sucesso!');
        window.location.reload(); // Reload to apply all changes
      } catch (firebaseError) {
        toast.error('Erro ao conectar com o Firebase. Verifique as configurações.');
        console.error('Firebase initialization error:', firebaseError);
        return;
      }
    } catch (error) {
      toast.error('Erro ao salvar configurações');
      console.error('Settings save error:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Settings className="w-6 h-6" />
        Configurações do Desenvolvedor
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Church className="w-5 h-5" />
            Configurações da Igreja
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome da Igreja
              </label>
              <input
                type="text"
                value={churchName}
                onChange={(e) => setChurchName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome da Filial
              </label>
              <input
                type="text"
                value={churchBranch}
                onChange={(e) => setChurchBranch(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Configurações do Firebase
          </h3>
          <div className="space-y-4">
            {Object.entries(firebaseConfig).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700">
                  {key}
                </label>
                <input
                  type="text"
                  value={value as string}
                  onChange={(e) => setFirebaseConfig(prev => ({
                    ...prev,
                    [key]: e.target.value
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}