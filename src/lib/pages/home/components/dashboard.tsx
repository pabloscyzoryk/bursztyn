// imports
import { useRouter } from 'next/navigation';

// ui
import { Grid, Flex } from '@chakra-ui/react';

// hooks
import { useCrosswordsManager } from '@/lib/pages/home/hooks/useCrosswordsManager';

// components
import { LoadingState } from '@/lib/pages/home/components/loadingState';
import { SearchBar } from '@/lib/pages/home/components/searchBar';
import { NewCrosswordCard } from '@/lib/pages/home/components/newCrosswordCard';
import { CrosswordCard } from '@/lib/pages/home/components/crosswordCard';
import { EmptyState } from '@/lib/pages/home/components/emptyState';

export const Dashboard = () => {
  const router = useRouter();
  const { crosswords, isClient, searchQuery, setSearchQuery } =
    useCrosswordsManager();

  if (!isClient) {
    return <LoadingState />;
  }

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      direction="column"
      w="100vw"
      minH="50vh"
      minW="100vw"
      mt={2}
      mb="100px"
    >
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <Grid
        maxW="90%"
        templateColumns="repeat(auto-fit, minmax(400px, 1fr))"
        gap={25}
      >
        <NewCrosswordCard router={router} />

        {crosswords.length > 0 ? (
          crosswords.map(crossword => (
            <CrosswordCard key={crossword.id} crossword={crossword} />
          ))
        ) : (
          <EmptyState searchQuery={searchQuery} />
        )}
      </Grid>
    </Flex>
  );
};
