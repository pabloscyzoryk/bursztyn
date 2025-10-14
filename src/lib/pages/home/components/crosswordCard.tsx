// imports

// types
import { type Crossword } from "@/types/crossword";

// ui
import { GridItem, Box, VStack, Center, Text, Flex } from "@chakra-ui/react"; 

// hooks
import { useColorMode } from "@/components/ui/color-mode";

// components
import { CrosswordVisualization } from "@/components/preview/crosswordvisualization";
import Link from "next/link";

export const CrosswordCard = ({ crossword }: { crossword: Crossword }) => {
  const { colorMode } = useColorMode();

  return (
    <GridItem className="group" w={400} margin={25} key={crossword.id}>
      <Box
        w={400}
        h={450}
        borderRadius="20px"
        overflow="hidden"
        bgColor={colorMode === 'light' ? 'gray.300' : 'gray.900'}
        _hover={{
          transform: 'scale(1.01)',
          transition: 'transform 0.2s',
        }}
      >
        <Link
          href={`/${crossword.id}`}
          style={{ display: 'block', width: '100%', height: '100%' }}
        >
          <VStack w="100%" h="100%">
            <Center m={4} flexShrink={0}>
              <Text fontWeight="bold">{crossword.title}</Text>
            </Center>
            <Flex
              flex={1}
              justifyContent="center"
              alignItems="start"
              w="100%"
              p={4}
            >
              <CrosswordVisualization
                answers={crossword.answers}
                answersBackgroundColor={crossword.answersBackgroundColor}
                answersBorderColor={crossword.answersBorderColor}
                answersBorderThickness={crossword.answersBorderThickness}
                shouldShowIndexes={crossword.shouldShowIndexes}
                solution={crossword.solution}
                solutionBorderColor={crossword.solutionBorderColor}
                solutionBorderThickness={crossword.solutionBorderThickness}
                solutionsBackgroundColor={crossword.solutionsBackgroundColor}
                size={20}
                shouldShowAnswers={true}
                shouldShowQuestions={false}
                spacesAfterIndexes={crossword.spacesAfterIndexes}
              />
            </Flex>
          </VStack>
        </Link>
      </Box>
    </GridItem>
  );
};