export type AppId = 'calcreno' | 'renotimeline' | 'renoscout';

export interface AppConfig {
  id: AppId;
  name: string;
  description: string;
  schema: string | null;
  tableName: string | null;
  userIdColumn: string | null;
  externalUrl: string | null;
  icon: string;
  tags: string[];
  status: 'available' | 'coming_soon';
}

export const APP_CONFIGS: AppConfig[] = [
  {
    id: 'calcreno',
    name: 'CalcReno',
    description: 'Kalkulator materiałów budowlanych',
    schema: 'calcreno_schema',
    tableName: 'calcreno_projects',
    userIdColumn: 'user_id',
    externalUrl: null,
    icon: '/calcreno-logo-full-transparent.png',
    tags: ['Mobile', 'iOS/Android'],
    status: 'available',
  },
  {
    id: 'renotimeline',
    name: 'RenoTimeline',
    description: 'Zarządzanie projektami remontowymi',
    schema: 'renotimeline_schema',
    tableName: 'projects',
    userIdColumn: 'user_id',
    externalUrl: 'https://www.renotimeline.com',
    icon: '/renotimeline-logo-transparent.png',
    tags: ['Web App', 'Browser'],
    status: 'available',
  },
  {
    id: 'renoscout',
    name: 'RenoScout',
    description: 'AI do wyszukiwania i analizy okazji inwestycyjnych',
    schema: null,
    tableName: null,
    userIdColumn: null,
    externalUrl: null,
    icon: '/Renoscout logo.png',
    tags: ['Web App', 'AI'],
    status: 'coming_soon',
  },
];

export const IS_BETA_MODE = import.meta.env.VITE_IS_BETA_MODE === 'true' || 
  import.meta.env.VITE_IS_BETA_MODE === undefined; // Default to beta mode if not set

export const getAppConfig = (appId: AppId): AppConfig | undefined => {
  return APP_CONFIGS.find(app => app.id === appId);
};

