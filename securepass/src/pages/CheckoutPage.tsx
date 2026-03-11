import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import CheckoutLayout from '../components/checkout/CheckoutLayout';
import CheckoutScanner from '../components/checkout/CheckoutScanner';
import VisitorVerification from '../components/checkout/VisitorVerification';
import CheckoutConfirmation from '../components/checkout/CheckoutConfirmation';
import CheckoutSuccess from '../components/checkout/CheckoutSuccess';
import { useCheckout } from '../services/useCheckout';
import type { VisitorSession, VerificationQuestion } from '../services/useCheckout';

type CheckoutStep =
  | 'scanning'
  | 'verifying'
  | 'confirming'
  | 'processing'
  | 'success'
  | 'failed';

const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('scanning');
  const [session, setSession] = useState<VisitorSession | null>(null);
  const [questions, setQuestions] = useState<VerificationQuestion[]>([]);
  const [checkoutResult, setCheckoutResult] = useState<{
    checkoutTime: string;
    duration: string;
    receiptId: string;
  } | null>(null);

  const {
    isLoading,
    getVisitorSession,
    generateVerificationQuestions,
    processCheckout,
  } = useCheckout();

  // Check if QR token is in URL params (visitor scanned QR)
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      handleQRScanned(token);
    }
  }, [searchParams]);

  // Handle QR code scanned or token received
  const handleQRScanned = useCallback(
    async (qrToken: string) => {
      setCurrentStep('scanning');
      const visitorSession = await getVisitorSession(qrToken);

      if (visitorSession) {
        setSession(visitorSession);
        const verificationQuestions =
          generateVerificationQuestions(visitorSession);
        setQuestions(verificationQuestions);
        setCurrentStep('verifying');
      } else {
        setCurrentStep('failed');
      }
    },
    [getVisitorSession, generateVerificationQuestions]
  );

  // Handle verification complete
  const handleVerificationComplete = useCallback(
    (passed: boolean) => {
      if (passed) {
        setCurrentStep('confirming');
      } else {
        setCurrentStep('failed');
      }
    },
    []
  );

  // Handle checkout confirmed
  const handleCheckoutConfirmed = useCallback(
    async (feedback?: { rating: number; comment: string }) => {
      if (!session) return;

      setCurrentStep('processing');
      const result = await processCheckout(session.id, feedback);

      if (result.success) {
        setCheckoutResult(result);
        setCurrentStep('success');
      } else {
        setCurrentStep('failed');
      }
    },
    [session, processCheckout]
  );

  // Handle restart
  const handleRestart = useCallback(() => {
    setSession(null);
    setQuestions([]);
    setCheckoutResult(null);
    setCurrentStep('scanning');
  }, []);

  return (
    <CheckoutLayout currentStep={currentStep}>
      <AnimatePresence mode="wait">
        {currentStep === 'scanning' && (
          <CheckoutScanner
            key="scanner"
            onQRScanned={handleQRScanned}
            isLoading={isLoading}
          />
        )}

        {currentStep === 'verifying' && session && (
          <VisitorVerification
            key="verification"
            session={session}
            questions={questions}
            onVerificationComplete={handleVerificationComplete}
          />
        )}

        {(currentStep === 'confirming' || currentStep === 'processing') &&
          session && (
            <CheckoutConfirmation
              key="confirmation"
              session={session}
              onConfirm={handleCheckoutConfirmed}
              isProcessing={currentStep === 'processing'}
            />
          )}

        {currentStep === 'success' && session && checkoutResult && (
          <CheckoutSuccess
            key="success"
            session={session}
            checkoutTime={checkoutResult.checkoutTime}
            duration={checkoutResult.duration}
            receiptId={checkoutResult.receiptId}
            onDone={handleRestart}
          />
        )}

        {currentStep === 'failed' && (
          <CheckoutScanner
            key="failed-scanner"
            onQRScanned={handleQRScanned}
            isLoading={isLoading}
            errorMessage="Verification failed. Please try again or contact security."
          />
        )}
      </AnimatePresence>
    </CheckoutLayout>
  );
};

export default CheckoutPage;