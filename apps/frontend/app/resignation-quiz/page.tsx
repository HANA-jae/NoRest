'use client';

import { useEffect } from 'react';
import { QuizLayout } from '@/components/quiz/QuizLayout';
import { QuizIntro } from '@/components/quiz/QuizIntro';
import { QuizProgress } from '@/components/quiz/QuizProgress';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { QuizResult } from '@/components/quiz/QuizResult';
import { useQuizStore } from '@/store/quiz.store';
import { QUESTIONS } from '@/utils/quiz-data';

export default function ResignationQuizPage() {
  const { phase, currentQuestion, answers, reset } = useQuizStore();

  useEffect(() => {
    reset();
  }, []);

  const question = QUESTIONS[currentQuestion];

  return (
    <QuizLayout>
      {phase === 'intro' && <QuizIntro />}

      {phase === 'questions' && question && (
        <>
          <QuizProgress current={currentQuestion} />
          <QuestionCard
            question={question}
            selectedValue={answers[question.id]}
          />
        </>
      )}

      {phase === 'result' && <QuizResult />}
    </QuizLayout>
  );
}
