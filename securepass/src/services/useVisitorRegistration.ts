import { useState, useCallback } from 'react';

export interface VisitorFormData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  photoUrl: string;

  // Identification
  idType: 'national-id' | 'passport' | 'drivers-license' | 'military-id' | 'student-id';
  idNumber: string;
  idPhotoFront: string;
  idPhotoBack: string;

  // Visit Details
  hostId: string;
  hostName: string;
  hostDepartment: string;
  hostFloor: string;
  purpose: 'meeting' | 'interview' | 'delivery' | 'maintenance' | 'consultation' | 'event' | 'personal' | 'other';
  purposeDetails: string;
  expectedDuration: string;
  visitDate: string;
  visitTime: string;

  // Items Declaration
  hasVehicle: boolean;
  vehiclePlate: string;
  vehicleType: string;
  items: DeclaredItem[];
  hasLaptop: boolean;
  laptopSerial: string;
  specialNeeds: string;

  // Terms
  agreedToTerms: boolean;
  agreedToPhoto: boolean;
  agreedToNDA: boolean;
}

export interface DeclaredItem {
  id: string;
  name: string;
  description: string;
  serialNumber?: string;
}

export interface Host {
  id: string;
  name: string;
  department: string;
  floor: string;
  avatar: string;
  title: string;
  available: boolean;
}

export interface RegistrationResult {
  success: boolean;
  badgeNumber: string;
  qrCode: string;
  checkInTime: string;
  estimatedWait: string;
  visitorId: string;
  accessZones: string[];
  wifiCredentials: {
    network: string;
    password: string;
  };
}

export const initialFormData: VisitorFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  photoUrl: '',
  idType: 'national-id',
  idNumber: '',
  idPhotoFront: '',
  idPhotoBack: '',
  hostId: '',
  hostName: '',
  hostDepartment: '',
  hostFloor: '',
  purpose: 'meeting',
  purposeDetails: '',
  expectedDuration: '1-hour',
  visitDate: new Date().toISOString().split('T')[0],
  visitTime: '',
  hasVehicle: false,
  vehiclePlate: '',
  vehicleType: '',
  items: [],
  hasLaptop: false,
  laptopSerial: '',
  specialNeeds: '',
  agreedToTerms: false,
  agreedToPhoto: false,
  agreedToNDA: false,
};

export const useVisitorRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available hosts
  const fetchHosts = useCallback(
    async (searchQuery?: string): Promise<Host[]> => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock hosts data
        const allHosts: Host[] = [
          {
            id: 'h1',
            name: 'David Kamau',
            department: 'Engineering',
            floor: '4th Floor',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
            title: 'Senior Developer',
            available: true,
          },
          {
            id: 'h2',
            name: 'Sarah Njeri',
            department: 'Human Resources',
            floor: '2nd Floor',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
            title: 'HR Manager',
            available: true,
          },
          {
            id: 'h3',
            name: 'Michael Odhiambo',
            department: 'Finance',
            floor: '5th Floor',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
            title: 'Finance Director',
            available: false,
          },
          {
            id: 'h4',
            name: 'Amina Wanjiku',
            department: 'Marketing',
            floor: '3rd Floor',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
            title: 'Marketing Lead',
            available: true,
          },
          {
            id: 'h5',
            name: 'Brian Kipchoge',
            department: 'Operations',
            floor: '1st Floor',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100',
            title: 'Operations Manager',
            available: true,
          },
          {
            id: 'h6',
            name: 'Grace Achieng',
            department: 'Legal',
            floor: '6th Floor',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
            title: 'Legal Counsel',
            available: true,
          },
          {
            id: 'h7',
            name: 'Peter Mwangi',
            department: 'IT Support',
            floor: '4th Floor',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
            title: 'IT Manager',
            available: true,
          },
          {
            id: 'h8',
            name: 'Fatima Hassan',
            department: 'Research',
            floor: '7th Floor',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
            title: 'Research Lead',
            available: false,
          },
        ];

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return allHosts.filter(
            (h) =>
              h.name.toLowerCase().includes(query) ||
              h.department.toLowerCase().includes(query) ||
              h.title.toLowerCase().includes(query)
          );
        }

        return allHosts;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Validate ID number format
  const validateIdNumber = useCallback(
    (
      idType: VisitorFormData['idType'],
      idNumber: string
    ): { valid: boolean; message: string } => {
      const trimmed = idNumber.trim();

      switch (idType) {
        case 'national-id':
          if (!/^\d{7,8}$/.test(trimmed)) {
            return {
              valid: false,
              message: 'National ID should be 7-8 digits',
            };
          }
          break;
        case 'passport':
          if (!/^[A-Z]{1,2}\d{6,7}$/.test(trimmed.toUpperCase())) {
            return {
              valid: false,
              message: 'Invalid passport format (e.g., AB1234567)',
            };
          }
          break;
        case 'drivers-license':
          if (trimmed.length < 6) {
            return {
              valid: false,
              message: "Driver's license should be at least 6 characters",
            };
          }
          break;
        default:
          if (trimmed.length < 4) {
            return { valid: false, message: 'ID number too short' };
          }
      }

      return { valid: true, message: '' };
    },
    []
  );

  // Submit registration
  const submitRegistration = useCallback(
    async (formData: VisitorFormData): Promise<RegistrationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 2500));

        // In production:
        // const response = await fetch('/api/visitors/register', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // });
        // return response.json();

        const badgeNumber = `VIS-${Math.floor(1000 + Math.random() * 9000)}`;

        return {
          success: true,
          badgeNumber,
          qrCode: `checkout-${badgeNumber}-${Date.now().toString(36)}`,
          checkInTime: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          estimatedWait: '2 minutes',
          visitorId: `VST-${Date.now().toString(36).toUpperCase()}`,
          accessZones: ['Lobby', 'Reception', `${formData.hostFloor}`],
          wifiCredentials: {
            network: 'SecurePass-Guest',
            password: `guest${Math.floor(1000 + Math.random() * 9000)}`,
          },
        };
      } catch (err) {
        setError('Registration failed. Please try again.');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Check for returning visitor
  const checkReturningVisitor = useCallback(
    async (
      email: string
    ): Promise<{ isReturning: boolean; previousData?: Partial<VisitorFormData> }> => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Mock: 30% chance of being a returning visitor
        if (Math.random() > 0.7) {
          return {
            isReturning: true,
            previousData: {
              firstName: 'Jane',
              lastName: 'Muthoni',
              phone: '0712345678',
              company: 'TechCorp Kenya',
              idType: 'national-id',
              idNumber: '28456789',
            },
          };
        }
        return { isReturning: false };
      } catch {
        return { isReturning: false };
      }
    },
    []
  );

  return {
    isLoading,
    error,
    fetchHosts,
    validateIdNumber,
    submitRegistration,
    checkReturningVisitor,
  };
};