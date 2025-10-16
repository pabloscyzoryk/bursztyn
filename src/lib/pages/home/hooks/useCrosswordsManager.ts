// imports
import { useState, useEffect } from 'react';

// types
import { Crossword } from '@/types/crossword';

// hooks
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const useCrosswordsManager = () => {
  const [crosswords, setCrosswords] = useLocalStorage<Crossword[]>(
    'crosswords',
    [],
  );
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'crosswords' && e.newValue) {
        try {
          const newCrosswords = JSON.parse(e.newValue);
          setCrosswords(newCrosswords);
        } catch (error) {
          console.error('Error syncing crosswords from localStorage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isClient, setCrosswords]);

  const filteredCrosswords = crosswords.filter(crossword => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      crossword.title?.toLowerCase().includes(query) ||
      crossword.solution?.toLowerCase().includes(query) ||
      crossword.answers?.some(
        answer =>
          answer.word?.toLowerCase().includes(query) ||
          answer.question?.toLowerCase().includes(query),
      )
    );
  });

  const sortedCrosswords = [...filteredCrosswords].sort((a, b) => {
    const dateA = new Date(a.lastModifiedAt || 0).getTime();
    const dateB = new Date(b.lastModifiedAt || 0).getTime();
    return dateB - dateA;
  });

  return {
    crosswords: sortedCrosswords,
    isClient,
    searchQuery,
    setSearchQuery,
  };
};
