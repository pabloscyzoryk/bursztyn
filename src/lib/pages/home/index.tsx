'use client';
// imports

// ui
import { VStack } from '@chakra-ui/react';

// pages
import { Heading } from '@/lib/pages/home/components/heading';
import { Dashboard } from '@/lib/pages/home/components/dashboard';
import { Footer } from '@/lib/pages/home/components/footer';

export const Home = () => {
  return (
    <VStack overflow="hidden" overflowY="auto">
      <Heading />
      <Dashboard />
      <Footer />
    </VStack>
  );
};
