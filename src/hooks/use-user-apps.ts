import { useQueries } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { APP_CONFIGS, IS_BETA_MODE, type AppId } from '@/lib/app-config';
import { getProjectCount } from '@/lib/project-queries';

export type AppStatus = 'active' | 'limited' | 'inactive' | 'coming_soon';

export interface UserApp {
  id: AppId;
  name: string;
  description: string;
  icon: string;
  tags: string[];
  status: AppStatus;
  projectCount: number;
  hasSubscription: boolean;
  hasProjects: boolean;
  price: string;
}

export const useUserApps = () => {
  const { user } = useAuth();

  // Create queries for each app that has a table and schema
  const appsWithTables = APP_CONFIGS.filter(app => app.tableName && app.userIdColumn && app.schema);

  // Debug logging
  console.log('[useUserApps] User:', user);
  console.log('[useUserApps] IS_BETA_MODE:', IS_BETA_MODE);
  console.log('[useUserApps] Apps with tables:', appsWithTables.map(a => a.id));

  const projectQueries = useQueries({
    queries: user
      ? appsWithTables.map(app => ({
        queryKey: ['projectCount', app.id, user.id],
        queryFn: () => {
          console.log(`[useUserApps] Fetching project count for ${app.id} with userId: ${user.id}`);
          return getProjectCount(app.id, user.id);
        },
        enabled: !!user?.id,
        staleTime: 30000, // 30 seconds
        gcTime: 300000, // 5 minutes
      }))
      : [],
  });

  // Debug query results
  projectQueries.forEach((query, index) => {
    if (query.data !== undefined) {
      console.log(`[useUserApps] Query ${index} (${appsWithTables[index]?.id}):`, {
        data: query.data,
        isLoading: query.isLoading,
        error: query.error,
      });
    }
  });

  // Determine app status based on mode and data
  const apps: UserApp[] = APP_CONFIGS.map((config, index) => {
    let projectCount = 0;
    let hasProjects = false;
    let hasSubscription = false;
    let status: AppStatus = 'inactive';

    if (config.status === 'coming_soon') {
      return {
        id: config.id,
        name: config.name,
        description: config.description,
        icon: config.icon,
        tags: config.tags,
        status: 'coming_soon',
        projectCount: 0,
        hasSubscription: false,
        hasProjects: false,
        price: 'Wkrótce',
      };
    }

    // Get project count from query results
    if (user && config.tableName) {
      const queryIndex = appsWithTables.findIndex(a => a.id === config.id);

      if (queryIndex >= 0 && queryIndex < projectQueries.length) {
        const query = projectQueries[queryIndex];
        projectCount = query.data ?? 0;
        hasProjects = projectCount > 0;
        console.log(`[useUserApps] App ${config.id}: projectCount=${projectCount}, hasProjects=${hasProjects}, status will be=${hasProjects ? 'active' : 'inactive'}`);
      } else {
        console.warn(`[useUserApps] No query found for app ${config.id}, queryIndex=${queryIndex}, queriesLength=${projectQueries.length}`);
      }
    }

    // Check subscription status (production mode)
    if (user && !IS_BETA_MODE) {
      hasSubscription = user.subscriptions?.includes(config.id) ?? false;
    }

    // Determine status based on mode
    if (IS_BETA_MODE) {
      // Beta mode: check project counts only
      if (hasProjects) {
        status = 'active';
      } else {
        status = 'inactive';
      }
    } else {
      // Production mode: check subscriptions and projects
      if (hasSubscription && hasProjects) {
        status = 'active';
      } else if (hasProjects && !hasSubscription) {
        status = 'limited'; // Read-only access
      } else if (!hasProjects && hasSubscription) {
        status = 'active'; // Subscription but no projects yet
      } else {
        status = 'inactive';
      }
    }

    return {
      id: config.id,
      name: config.name,
      description: config.description,
      icon: config.icon,
      tags: config.tags,
      status,
      projectCount,
      hasSubscription,
      hasProjects,
      price: '49 zł/app/mies',
    };
  });

  // Filter to only show apps with projects or subscriptions (excluding coming_soon)
  const visibleApps = apps.filter(app => {
    const shouldShow = app.status === 'coming_soon' || app.hasProjects || app.hasSubscription;
    console.log(`[useUserApps] App ${app.id}: status=${app.status}, hasProjects=${app.hasProjects}, hasSubscription=${app.hasSubscription}, shouldShow=${shouldShow}`);
    return shouldShow;
  });

  console.log('[useUserApps] Visible apps:', visibleApps.map(a => ({ id: a.id, status: a.status, projectCount: a.projectCount })));

  // Determine loading state
  const isLoading = projectQueries.some(query => query.isLoading);

  // Determine error state
  const error = projectQueries.find(query => query.error)?.error ?? null;

  return {
    apps: visibleApps,
    allApps: apps, // Include all apps for stats calculation
    isLoading,
    error,
  };
};

