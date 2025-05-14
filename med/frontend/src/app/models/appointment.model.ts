export interface Appointment {
    _id?: string;
    patientName: string;
    patientAge: number;
    patientGender: 'male' | 'female' | 'other';
    contactPhone: string;
    contactEmail: string;
    medicalHistory?: string;
    
    doctorId: string;
    specialty: string;
    
    date: Date | string;
    timeSlot: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
    type: 'in-person' | 'teleconsultation';
    reasonForVisit: string;
    symptoms?: string;
    
    prescription?: {
        medications: {
            name: string;
            dosage: string;
            duration: string;
            instructions: string;
        }[];
        notes?: string;
        issuedAt?: Date;
    };
    
    payment?: {
        amount: number;
        status: 'pending' | 'completed' | 'refunded';
        transactionId?: string;
        paidAt?: Date;
    };
    
    feedback?: {
        rating: number;
        review: string;
        createdAt: Date;
    };
    
    createdAt?: Date;
    updatedAt?: Date;
} 