// imports

// types
import { type Crossword } from '@/types/crossword';

// ui
import { Flex, Text } from '@chakra-ui/react';

// components
import { CrosswordVisualization } from '@/components/preview/crosswordvisualization';

export const Visualization = ({ crossword }: { crossword: Crossword }) => (
  <Flex
    id="crossword-canvas"
    alignItems="center"
    direction="column"
    overflowY="auto"
    overflowX="auto"
    p={4}
    maxW={1000}
    maxH={440}
  >
    <Text h={4} id="crossword-title-canvas" fontWeight={500} mt={6} maxH={16}>
      {crossword.title}
    </Text>

    <CrosswordVisualization
      solution={crossword.solution}
      answers={crossword.answers}
      answersBackgroundColor={crossword.answersBackgroundColor}
      answersBorderColor={crossword.answersBorderColor}
      answersBorderThickness={crossword.answersBorderThickness}
      shouldShowIndexes={crossword.shouldShowIndexes}
      solutionBorderColor={crossword.solutionBorderColor}
      solutionsBackgroundColor={crossword.solutionsBackgroundColor}
      solutionBorderThickness={crossword.solutionBorderThickness}
      size={crossword.size + 10}
      shouldShowAnswers={crossword.shouldShowAnswers}
      shouldShowQuestions={crossword.shouldShowQuestions}
      spacesAfterIndexes={crossword.spacesAfterIndexes}
    />
  </Flex>
);
