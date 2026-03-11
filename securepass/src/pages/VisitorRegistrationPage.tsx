import React, { useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import RegistrationLayout from '../components/registration/RegistrationLayout';
import StepPersonalInfo from '../components/registration/StepPersonalInfo';
import StepIdentification from '../components/registration/StepIdentification';
import StepVisitDetails from '../components/registration/StepVisitDetails';
import StepItemsDeclaration from '../components/registration/StepItemsDeclaration';
import StepReview from '../components/registration/StepReview';
import RegistrationSuccess from '../components/registration/RegistrationSuccess';
import type { VisitorFormData, RegistrationResult } from '../services/useVisitorRegistration';
import {
  useVisitorRegistration,
  initialFormData,
} from '../services/useVisitorRegistration';

export type RegistrationStep =
  | 'personal'
  | 'identification'
  | 'visit-details'
  | 'items'
  | 'review'
  | 'submitting'
  | 'success';

const VisitorRegistrationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('personal');
  const [formData, setFormData] = useState<VisitorFormData>(initialFormData);
  const [result, setResult] = useState<RegistrationResult | null>(null);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const { isLoading, submitRegistration } = useVisitorRegistration();

  const updateFormData = useCallback(
    (updates: Partial<VisitorFormData>) => {
      setFormData((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const stepOrder: RegistrationStep[] = useMemo(
    () => ['personal', 'identification', 'visit-details', 'items', 'review'],
    []
  );

  const currentStepIndex = useMemo(
    () => stepOrder.indexOf(currentStep as any),
    [currentStep, stepOrder]
  );

  const goToNext = useCallback(() => {
    setDirection('forward');
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex]);
    }
  }, [currentStepIndex, stepOrder]);

  const goToPrevious = useCallback(() => {
    setDirection('backward');
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex]);
    }
  }, [currentStepIndex, stepOrder]);

  const goToStep = useCallback(
    (step: RegistrationStep) => {
      const targetIndex = stepOrder.indexOf(step);
      setDirection(targetIndex > currentStepIndex ? 'forward' : 'backward');
      setCurrentStep(step);
    },
    [currentStepIndex, stepOrder]
  );

  const handleSubmit = useCallback(async () => {
    setCurrentStep('submitting');
    try {
      const registrationResult = await submitRegistration(formData);
      setResult(registrationResult);
      setCurrentStep('success');
    } catch {
      setCurrentStep('review');
    }
  }, [formData, submitRegistration]);

  const handleStartOver = useCallback(() => {
    setFormData(initialFormData);
    setResult(null);
    setCurrentStep('personal');
  }, []);

  return (
    <RegistrationLayout
      currentStep={currentStep}
      currentStepIndex={currentStepIndex}
      totalSteps={stepOrder.length}
    >
      <AnimatePresence mode="wait" custom={direction}>
        {currentStep === 'personal' && (
          <StepPersonalInfo
            key="personal"
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNext}
            direction={direction}
          />
        )}

        {currentStep === 'identification' && (
          <StepIdentification
            key="identification"
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNext}
            onBack={goToPrevious}
            direction={direction}
          />
        )}

        {currentStep === 'visit-details' && (
          <StepVisitDetails
            key="visit-details"
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNext}
            onBack={goToPrevious}
            direction={direction}
          />
        )}

        {currentStep === 'items' && (
          <StepItemsDeclaration
            key="items"
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNext}
            onBack={goToPrevious}
            direction={direction}
          />
        )}

        {(currentStep === 'review' || currentStep === 'submitting') && (
          <StepReview
            key="review"
            formData={formData}
            onSubmit={handleSubmit}
            onBack={goToPrevious}
            onEditStep={goToStep}
            isSubmitting={currentStep === 'submitting'}
            direction={direction}
          />
        )}

        {currentStep === 'success' && result && (
          <RegistrationSuccess
            key="success"
            formData={formData}
            result={result}
            onDone={handleStartOver}
          />
        )}
      </AnimatePresence>
    </RegistrationLayout>
  );
};

export default VisitorRegistrationPage;