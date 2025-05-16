export interface Doctor {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  qualifications?: string[];
  experience: number;
  bio?: string;
  profileImage?: string;
  rating?: {
    average: number;
    count: number;
    total: number;
  };
  consultationFees?: {
    inPerson: number;
    teleconsultation: number;
  };
  availability?: Array<{
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    slots: Array<{
      start: string;
      end: string;
    }>;
  }>;
  hospital?: {
    name: string;
    address: string;
    location?: {
      type: string;
      coordinates: number[];
    };
  };
  isActive?: boolean;
} 