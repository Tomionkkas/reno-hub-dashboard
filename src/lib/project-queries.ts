import { supabase } from '@/integrations/supabase/client';
import { APP_CONFIGS, type AppId } from './app-config';

/**
 * Get project count for CalcReno app
 */
export const getCalcRenoProjectCount = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase.rpc('get_calcreno_project_count', {
      user_uuid: userId,
    });

    if (error) {
      console.error('Error fetching CalcReno project count:', error);
      return 0;
    }

    return typeof data === 'number' ? data : 0;
  } catch (error) {
    console.error('Exception fetching CalcReno project count:', error);
    return 0;
  }
};

/**
 * Get project count for RenoTimeline app
 */
export const getRenoTimelineProjectCount = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase.rpc('get_renotimeline_project_count', {
      user_uuid: userId,
    });

    if (error) {
      console.error('Error fetching RenoTimeline project count:', error);
      return 0;
    }

    return typeof data === 'number' ? data : 0;
  } catch (error) {
    console.error('Exception fetching RenoTimeline project count:', error);
    return 0;
  }
};

/**
 * Get project count for a specific app
 */
export const getProjectCount = async (appId: AppId, userId: string): Promise<number> => {
  const config = APP_CONFIGS.find(app => app.id === appId);
  
  if (!config || !config.tableName || !config.userIdColumn || !config.schema) {
    console.warn(`[getProjectCount] No config found for app: ${appId}`);
    return 0;
  }

  if (!userId) {
    console.warn(`[getProjectCount] No userId provided for app: ${appId}`);
    return 0;
  }

  try {
    console.log(`[getProjectCount] Querying ${config.schema}.${config.tableName} for userId: ${userId}, column: ${config.userIdColumn}`);
    
    // Check if userId looks like a UUID (Supabase format) or mock ID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    if (!isUUID) {
      console.warn(`[getProjectCount] WARNING: User ID "${userId}" is not a UUID. Projects are likely linked to Supabase auth UUIDs. Please log in with Supabase authentication.`);
    }
    
    // Use RPC functions for cross-schema queries
    let rpcFunctionName: string;
    if (appId === 'calcreno') {
      rpcFunctionName = 'get_calcreno_project_count';
    } else if (appId === 'renotimeline') {
      rpcFunctionName = 'get_renotimeline_project_count';
    } else {
      console.warn(`[getProjectCount] No RPC function for app: ${appId}`);
      return 0;
    }
    
    const { data, error } = await supabase.rpc(rpcFunctionName, {
      user_uuid: userId,
    });

    if (error) {
      console.error(`[getProjectCount] Error fetching ${appId} project count via RPC:`, error);
      console.error(`[getProjectCount] Schema: ${config.schema}, Table: ${config.tableName}, Column: ${config.userIdColumn}, UserId: ${userId}`);
      console.error(`[getProjectCount] Error details:`, JSON.stringify(error, null, 2));
      
      // Check if it's an RLS policy error
      if (error.message?.includes('policy') || error.message?.includes('permission')) {
        console.error(`[getProjectCount] This might be an RLS (Row Level Security) policy issue. Check Supabase dashboard for RLS policies on ${config.schema}.${config.tableName}.`);
      }
      
      return 0;
    }

    const count = typeof data === 'number' ? data : 0;
    console.log(`[getProjectCount] Found ${count} projects for ${appId}`);
    return count;
  } catch (error) {
    console.error(`[getProjectCount] Exception fetching ${appId} project count:`, error);
    return 0;
  }
};

