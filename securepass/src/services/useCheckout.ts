import { useState, useCallback } from 'react';

export interface VisitorSession {
  id: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  hostName: string;
  hostDepartment: string;
  purpose: string;
  badgeNumber: string;
  checkInTime: string;
  checkInDate: string;
  floor: string;
  building: string;
  photoUrl: string;
  company: string;
  idType: string;
  idNumber: string;
  vehiclePlate?: string;
  itemsCarried?: string[];
  escortRequired: boolean;
}

export interface VerificationQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'text-match' | 'confirm';
  options?: string[];
  correctAnswer: string;
  hint?: string;
  icon: string;
}

// Simulate fetching active visitor session from QR code data
export const useCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch visitor session by QR token
  const getVisitorSession = useCallback(
    async (qrToken: string): Promise<VisitorSession | null> => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // In production, this would be:
        // const response = await fetch(`/api/checkout/session/${qrToken}`);
        // return response.json();

        // Mock data for demonstration
        const mockSession: VisitorSession = {
          id: qrToken,
          visitorName: 'Jane Muthoni Cooper',
          visitorEmail: 'jane.cooper@techcorp.co.ke',
          visitorPhone: '0712 345 678',
          hostName: 'David Kamau',
          hostDepartment: 'Engineering',
          purpose: 'Technical Interview',
          badgeNumber: 'VIS-2847',
          checkInTime: '09:32 AM',
          checkInDate: new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          floor: '4th Floor',
          building: 'Tower A',
          photoUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
          company: 'TechCorp Kenya',
          idType: 'National ID',
          idNumber: '28***456',
          vehiclePlate: 'KDA 234X',
          itemsCarried: ['Laptop', 'Backpack'],
          escortRequired: false,
        };

        return mockSession;
      } catch (err) {
        setError('Failed to retrieve visitor session');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Generate verification questions based on visitor session
  const generateVerificationQuestions = useCallback(
    (session: VisitorSession): VerificationQuestion[] => {
      const allQuestions: VerificationQuestion[] = [
        {
          id: 'q1',
          question: 'Who were you visiting today?',
          type: 'multiple-choice',
          options: [
            'Sarah Njeri',
            session.hostName,
            'Michael Odhiambo',
            'Amina Wanjiku',
          ].sort(() => Math.random() - 0.5),
          correctAnswer: session.hostName,
          icon: '👤',
        },
        {
          id: 'q2',
          question: 'What was the purpose of your visit?',
          type: 'multiple-choice',
          options: [
            'Delivery',
            session.purpose,
            'Maintenance',
            'Social Visit',
          ].sort(() => Math.random() - 0.5),
          correctAnswer: session.purpose,
          icon: '🎯',
        },
        {
          id: 'q3',
          question: "What's your badge number?",
          type: 'multiple-choice',
          options: [
            'VIS-1923',
            session.badgeNumber,
            'VIS-4102',
            'VIS-3371',
          ].sort(() => Math.random() - 0.5),
          correctAnswer: session.badgeNumber,
          icon: '🏷️',
        },
        {
          id: 'q4',
          question: 'Which floor did you visit?',
          type: 'multiple-choice',
          options: [
            '2nd Floor',
            session.floor,
            '6th Floor',
            '3rd Floor',
          ].sort(() => Math.random() - 0.5),
          correctAnswer: session.floor,
          icon: '🏢',
        },
        {
          id: 'q5',
          question: 'Which department did you visit?',
          type: 'multiple-choice',
          options: [
            'Marketing',
            session.hostDepartment,
            'Finance',
            'Human Resources',
          ].sort(() => Math.random() - 0.5),
          correctAnswer: session.hostDepartment,
          icon: '🏬',
        },
        {
          id: 'q6',
          question: 'Please confirm: Do you want to check out now?',
          type: 'confirm',
          correctAnswer: 'yes',
          icon: '✅',
        },
      ];

      // Pick 3 random questions + always include confirmation
      const randomQuestions = allQuestions
        .filter((q) => q.type !== 'confirm')
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const confirmQuestion = allQuestions.find((q) => q.type === 'confirm')!;

      return [...randomQuestions, confirmQuestion];
    },
    []
  );

  // Process checkout
  const processCheckout = useCallback(
    async (
      _sessionId: string,
      _feedback?: { rating: number; comment: string }
    ): Promise<{
      success: boolean;
      checkoutTime: string;
      duration: string;
      receiptId: string;
    }> => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // In production:
        // const response = await fetch(`/api/checkout/${sessionId}`, {
        //   method: 'POST',
        //   body: JSON.stringify({ feedback }),
        // });

        return {
          success: true,
          checkoutTime: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          duration: '3h 47m',
          receiptId: `RCP-${Date.now().toString(36).toUpperCase()}`,
        };
      } catch (err) {
        setError('Checkout failed');
        return {
          success: false,
          checkoutTime: '',
          duration: '',
          receiptId: '',
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    error,
    getVisitorSession,
    generateVerificationQuestions,
    processCheckout,
  };
};