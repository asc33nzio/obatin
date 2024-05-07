export type DoctorType = {
  id: number;
  specialization: string;
  name: string;
  avatar_url: string;
  is_online: boolean;
  experiences: number;
  fee: number;
  opening_time: string;
  operational_hours: string;
  operational_days: [];
};

export type DoctorSpecType = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  slug: string;
  children: [];
};
