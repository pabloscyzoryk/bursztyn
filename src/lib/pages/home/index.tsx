"use client"
// imports

// components
import { Heading } from "@/lib/pages/home/components/heading";
import { Dashboard } from "@/lib/pages/home/components/dashboard";
import { VStack } from "@chakra-ui/react";

export const Home = () => {

  return (
    <VStack overflow='hidden' overflowY='auto'>
      <Heading />
      <Dashboard />
    </VStack>
  )
};
