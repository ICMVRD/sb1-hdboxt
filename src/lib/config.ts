// Store configuration in localStorage to persist changes
export const getConfig = () => {
  const config = localStorage.getItem('app_config');
  return config ? JSON.parse(config) : {
    churchName: 'Igreja Cristã Maranata',
    churchBranch: 'Central 2',
    firebase: {
      apiKey: "AIzaSyC9hyt4o8JxDlUJyTTgQYPVyXpv_AZBHRI",
      authDomain: "oracao-24h-e96b9.firebaseapp.com",
      projectId: "oracao-24h-e96b9",
      storageBucket: "oracao-24h-e96b9.firebasestorage.app",
      messagingSenderId: "923223368470",
      appId: "1:923223368470:web:c07af7dc5b84ea5dc1e637"
    }
  };
};

export const updateConfig = (newConfig: any) => {
  localStorage.setItem('app_config', JSON.stringify(newConfig));
};