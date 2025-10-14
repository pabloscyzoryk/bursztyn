// imports
import { useEffect, useState } from 'react';
import { type Crossword, type Answer } from '@/types/crossword';

export const useAnswers = (
  crossword: Crossword | null,
  updateCrossword: (updates: Partial<Crossword>) => void,
) => {
  const [lastSpaceAdded, setLastSpaceAdded] = useState<number | null>(null);

  useEffect(() => {
    if (crossword?.spacesAfterIndexes?.length) {
      setLastSpaceAdded(Math.max(...crossword.spacesAfterIndexes));
    }
  }, [crossword?.spacesAfterIndexes]);

  const updateAnswer = (index: number, updates: Partial<Answer>) => {
    if (!crossword) return;

    const newAnswers = crossword.answers.map((answer, i) =>
      i === index ? { ...answer, ...updates } : answer,
    );
    updateCrossword({ answers: newAnswers });
  };

  const addAnswer = () => {
    if (!crossword) return;

    const newAnswer: Answer = { question: '', word: '', shift: 0 };
    updateCrossword({ answers: [...crossword.answers, newAnswer] });
    setLastSpaceAdded(null);
  };

  const deleteAnswer = (index: number) => {
    if (!crossword) return;

    const newAnswers = crossword.answers.filter((_, i) => i !== index);
    const newSpaces = crossword.spacesAfterIndexes
      .filter(spaceIndex => spaceIndex !== index)
      .map(spaceIndex => (spaceIndex > index ? spaceIndex - 1 : spaceIndex));

    updateCrossword({
      answers: newAnswers,
      spacesAfterIndexes: newSpaces,
    });

    setLastSpaceAdded(newSpaces.length ? Math.max(...newSpaces) : null);
  };

  const addSpace = () => {
    if (!crossword) return;

    const currentIndex = crossword.answers.length - 1;
    if (currentIndex < 0 || lastSpaceAdded === currentIndex) return;

    updateCrossword({
      spacesAfterIndexes: [...crossword.spacesAfterIndexes, currentIndex],
    });
    setLastSpaceAdded(currentIndex);
  };

  const removeLastSpace = () => {
    if (!crossword?.spacesAfterIndexes.length) return;

    const newSpaces = crossword.spacesAfterIndexes.slice(0, -1);
    updateCrossword({ spacesAfterIndexes: newSpaces });
    setLastSpaceAdded(newSpaces.length ? Math.max(...newSpaces) : null);
  };

  return {
    lastSpaceAdded,
    updateAnswer,
    addAnswer,
    deleteAnswer,
    addSpace,
    removeLastSpace,
  };
};
