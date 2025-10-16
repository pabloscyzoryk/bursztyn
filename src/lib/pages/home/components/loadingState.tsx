// imports

// ui
import { Center, Text, Spinner } from "@chakra-ui/react";

export const LoadingState = () => (
  <Center w="100vw" minH="80vh" minW="100vw" mt={2}>
    <Spinner />
  </Center>
);