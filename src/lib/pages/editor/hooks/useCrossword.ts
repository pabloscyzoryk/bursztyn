// imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// types
import { type Crossword } from '@/types/crossword';

export const useCrossword = (id: string) => {
  const router = useRouter();
  const [crossword, setCrossword] = useState<Crossword | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('crosswords');
    if (!stored) return router.replace('/');

    try {
      const crosswords: Crossword[] = JSON.parse(stored);
      const found = crosswords.find(cw => cw.id === id);
      found ? setCrossword(found) : router.replace('/');
    } catch (err) {
      console.error('Error loading crossword:', err);
      router.replace('/');
    }
  }, [id, router]);

  const updateCrossword = (updates: Partial<Crossword>) => {
    setCrossword(prev => (prev ? { ...prev, ...updates } : null));
  };

  return { crossword, updateCrossword };
};
