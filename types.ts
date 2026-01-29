
export enum ActivityCategory {
  EDUCATION = 'Education',
  ENVIRONMENT = 'Environment',
  HEALTH = 'Health',
  ECONOMY = 'Economy',
  SOCIAL = 'Social',
  OTHER = 'Other'
}

export interface ImpactMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
}

export type ActivityStatus = 'accepted' | 'pending' | 'declined';

export interface Activity {
  id: string;
  date: string;
  title: string;
  location: string;
  shortDescription: string;
  detailedNarrative: string;
  category: ActivityCategory;
  photos: string[]; // Base64 strings
  metrics: ImpactMetric[];
  createdAt: number;
  status: ActivityStatus;
}

export interface DashboardStats {
  totalActivities: number;
  totalBeneficiaries: number;
  categoryDistribution: { name: string; value: number }[];
  timelineData: { date: string; count: number }[];
}
