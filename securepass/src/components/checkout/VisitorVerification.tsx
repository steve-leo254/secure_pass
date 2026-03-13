import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  CheckCircle,
  XCircle,
  User,
  Lock,
} from 'lucide-react';
import type { VisitorSession, VerificationQuestion } from '../../services/useCheckout';

interface VisitorVerificationProps {
  session: VisitorSession;
  questions: VerificationQuestion[];
  onVerificationComplete: (passed: boolean) => void;
}

const VisitorVerification: React.FC<VisitorVerificationProps> = ({
  session,
  questions,
  onVerificationComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<
    'idle' | 'correct' | 'wrong'
  >('idle');
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const maxWrongAttempts = 3;

  const currentQuestion = useMemo(
    () => questions[currentQuestionIndex],
    [questions, currentQuestionIndex]
  );

  const progress = useMemo(
    () => ((currentQuestionIndex + 1) / questions.length) * 100,
    [currentQuestionIndex, questions.length]
  );

  const handleAnswerSelect = useCallback(
    (answer: string) => {
      if (answerStatus !== 'idle') return;
      setSelectedAnswer(answer);
    },
    [answerStatus]
  );

  const handleConfirmAnswer = useCallback(() => {
    if (!selectedAnswer || !currentQuestion) return;

    const isCorrect =
      selectedAnswer.toLowerCase() ===
      currentQuestion.correctAnswer.toLowerCase();

    if (isCorrect) {
      setAnswerStatus('correct');
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: selectedAnswer,
      }));

      // Move to next question after animation
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedAnswer(null);
          setAnswerStatus('idle');
        } else {
          onVerificationComplete(true);
        }
      }, 1200);
    } else {
      setAnswerStatus('wrong');
      const newWrongAttempts = wrongAttempts + 1;
      setWrongAttempts(newWrongAttempts);

      if (newWrongAttempts >= maxWrongAttempts) {
        setTimeout(() => {
          onVerificationComplete(false);
        }, 1500);
      } else {
        setTimeout(() => {
          setSelectedAnswer(null);
          setAnswerStatus('idle');
        }, 1500);
      }
    }
  }, [
    selectedAnswer,
    currentQuestion,
    currentQuestionIndex,
    questions.length,
    wrongAttempts,
    onVerificationComplete,
  ]);

  // Handle confirm checkout question
  const handleConfirmCheckout = useCallback(
    (confirmed: boolean) => {
      if (confirmed) {
        setAnswerStatus('correct');
        setTimeout(() => {
          onVerificationComplete(true);
        }, 800);
      } else {
        // User doesn't want to check out
        onVerificationComplete(false);
      }
    },
    [onVerificationComplete]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="pt-6"
    >
      {/* Visitor Identity Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 mb-6"
      >
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={session.photoUrl}
              alt={session.visitorName}
              className="w-14 h-14 rounded-xl object-cover ring-3 ring-emerald-100"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center">
              <Lock className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate">
              {session.visitorName}
            </h3>
            <p className="text-sm text-gray-500">Badge: {session.badgeNumber}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full">
              <span className="text-amber-700 text-xs font-bold">VERIFYING</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Verification Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {/* Header with progress */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Identity Verification
                </h2>
                <p className="text-xs text-gray-500">
                  Answer {questions.length} quick questions to verify your identity
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-600">
                {currentQuestionIndex + 1}
              </span>
              <span className="text-sm text-gray-400">
                /{questions.length}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
            />
          </div>

          {/* Wrong attempts warning */}
          {wrongAttempts > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 flex items-center space-x-2 text-red-500"
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-medium">
                {maxWrongAttempts - wrongAttempts} attempt
                {maxWrongAttempts - wrongAttempts !== 1 ? 's' : ''} remaining
              </span>
              <div className="flex space-x-1 ml-auto">
                {[...Array(maxWrongAttempts)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < wrongAttempts ? 'bg-red-400' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Question Area */}
        <div className="px-8 pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              {/* Question */}
              <div className="py-6">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-3xl">{currentQuestion.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900">
                    {currentQuestion.question}
                  </h3>
                </div>

                {/* Multiple Choice Options */}
                {currentQuestion.type === 'multiple-choice' && (
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option, i) => {
                      const isSelected = selectedAnswer === option;
                      const isCorrectAnswer =
                        option === currentQuestion.correctAnswer;
                      const showCorrect =
                        answerStatus === 'wrong' && isCorrectAnswer;
                      const showWrong =
                        answerStatus === 'wrong' && isSelected && !isCorrectAnswer;
                      const showSuccess =
                        answerStatus === 'correct' && isSelected;

                      return (
                        <motion.button
                          key={option}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          onClick={() => handleAnswerSelect(option)}
                          disabled={answerStatus !== 'idle'}
                          className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center space-x-4 group ${
                            showSuccess
                              ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100'
                              : showWrong
                              ? 'border-red-400 bg-red-50 shadow-lg shadow-red-100'
                              : showCorrect
                              ? 'border-emerald-400 bg-emerald-50'
                              : isSelected
                              ? 'border-emerald-500 bg-emerald-50/50 shadow-md'
                              : 'border-gray-150 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {/* Option letter circle */}
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm transition-all ${
                              showSuccess
                                ? 'bg-emerald-500 text-white'
                                : showWrong
                                ? 'bg-red-500 text-white'
                                : showCorrect
                                ? 'bg-emerald-400 text-white'
                                : isSelected
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                            }`}
                          >
                            {showSuccess || showCorrect ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : showWrong ? (
                              <XCircle className="w-5 h-5" />
                            ) : (
                              String.fromCharCode(65 + i)
                            )}
                          </div>

                          <span
                            className={`font-medium ${
                              showSuccess || showCorrect
                                ? 'text-emerald-800'
                                : showWrong
                                ? 'text-red-800'
                                : isSelected
                                ? 'text-emerald-700'
                                : 'text-gray-700'
                            }`}
                          >
                            {option}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* Confirm checkout question */}
                {currentQuestion.type === 'confirm' && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                      <div className="flex items-center space-x-3 mb-4">
                        <User className="w-5 h-5 text-emerald-600" />
                        <span className="font-semibold text-emerald-800">
                          Checkout Summary
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Visitor</span>
                          <span className="font-medium text-gray-900">
                            {session.visitorName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Checked In</span>
                          <span className="font-medium text-gray-900">
                            {session.checkInTime}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Host</span>
                          <span className="font-medium text-gray-900">
                            {session.hostName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleConfirmCheckout(false)}
                        className="py-4 border-2 border-gray-200 rounded-2xl text-gray-600 font-semibold hover:bg-gray-50 transition-all"
                      >
                        Not Yet
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleConfirmCheckout(true)}
                        className="py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20"
                      >
                        Yes, Check Out
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>

              {/* Continue button for multiple choice */}
              {currentQuestion.type === 'multiple-choice' &&
                answerStatus === 'idle' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmAnswer}
                    disabled={!selectedAnswer}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 disabled:opacity-40 disabled:shadow-none transition-all"
                  >
                    <span>Confirm Answer</span>
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                )}

              {/* Status feedback */}
              {answerStatus === 'correct' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center space-x-2 py-4 text-emerald-600"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Correct! Moving on...</span>
                </motion.div>
              )}

              {answerStatus === 'wrong' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center space-x-2 py-4 text-red-600"
                >
                  <XCircle className="w-5 h-5" />
                  <span className="font-semibold">
                    {wrongAttempts >= maxWrongAttempts
                      ? 'Too many wrong attempts. Alerting security...'
                      : 'Incorrect. Please try again.'}
                  </span>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default VisitorVerification;