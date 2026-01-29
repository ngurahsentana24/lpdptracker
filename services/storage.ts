
import { Activity } from '../types';

const STORAGE_KEY = 'lpdp_2n1_activities';

export const getActivities = (): Activity[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to parse activities from storage', error);
    return [];
  }
};

export const saveActivities = (activities: Activity[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
};

export const deleteActivity = (id: string): Activity[] => {
  const activities = getActivities();
  const filtered = activities.filter(a => a.id !== id);
  saveActivities(filtered);
  return filtered;
};
