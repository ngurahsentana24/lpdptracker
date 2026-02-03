
import { createClient } from '@supabase/supabase-js';
import { Activity } from '../types';

const SB_URL_KEY = 'lpdp_sb_url';
const SB_KEY_KEY = 'lpdp_sb_key';

// Provided credentials as defaults
const DEFAULT_URL = 'https://kxevmflmthzumbxztley.supabase.co';
const DEFAULT_KEY = 'sb_publishable_p-ST_hvA0s5dyNY_4KuRqw_M9bT9JJr';

export const getSupabaseConfig = () => ({
  url: localStorage.getItem(SB_URL_KEY) || DEFAULT_URL,
  key: localStorage.getItem(SB_KEY_KEY) || DEFAULT_KEY
});

export const saveSupabaseConfig = (url: string, key: string) => {
  localStorage.setItem(SB_URL_KEY, url);
  localStorage.setItem(SB_KEY_KEY, key);
};

const config = getSupabaseConfig();
// Ensure client is always initialized with at least the defaults
const supabase = createClient(config.url, config.key);

export const fetchActivities = async (): Promise<Activity[]> => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Supabase fetch error:", error);
    throw error;
  }
  
  return (data || []).map(item => ({
    id: item.id,
    date: item.date,
    title: item.title,
    location: item.location,
    category: item.category as any,
    shortDescription: item.short_description || '',
    detailedNarrative: item.detailed_narrative || '',
    status: item.status as any,
    metrics: item.metrics || [],
    photos: item.photos || [],
    createdAt: new Date(item.created_at).getTime()
  }));
};

export const upsertActivity = async (activity: Activity) => {
  const payload = {
    id: activity.id,
    title: activity.title,
    date: activity.date,
    location: activity.location,
    category: activity.category,
    short_description: activity.shortDescription,
    detailed_narrative: activity.detailedNarrative,
    status: activity.status,
    metrics: activity.metrics,
    photos: activity.photos,
    created_at: new Date(activity.createdAt).toISOString()
  };

  const { error } = await supabase
    .from('activities')
    .upsert(payload);

  if (error) throw error;
};

export const deleteActivityFromCloud = async (id: string) => {
  const { error } = await supabase.from('activities').delete().eq('id', id);
  if (error) throw error;
};

export const uploadPhoto = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${fileName}`; // Upload to root of bucket

  const { error: uploadError } = await supabase.storage
    .from('milestone-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error("Storage Upload Error:", uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('milestone-photos')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
