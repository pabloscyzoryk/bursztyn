// imports

// ui
import { Flex, Spinner, Text } from "@chakra-ui/react";

export const LoadingState = () => {
  return (
    <Flex justifyContent="center" alignItems="center" w="100vw" minH="100vh">
      <Flex justifyContent="center" alignItems="center" gap={4} h={16}>
        <Spinner />
        <Text>Ładowanie krzyżówki...</Text>
      </Flex>
    </Flex>
  );
};
