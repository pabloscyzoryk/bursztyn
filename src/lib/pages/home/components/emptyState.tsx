// imports

// ui
import { Center, GridItem, Text } from '@chakra-ui/react'; 

export const EmptyState = ({ searchQuery }: { searchQuery: string }) => (
  <GridItem colSpan={3}>
    <Center w="100%" py={10}>
      <Text fontSize="lg" color="gray.500">
        {searchQuery.trim()
          ? `Nie znaleziono krzyżówek pasujących do "${searchQuery}"`
          : 'Brak krzyżówek'}
      </Text>
    </Center>
  </GridItem>
);
