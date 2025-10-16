'use client';
import { CrosswordVisualization } from '@/components/preview/crosswordvisualization';
import { useCrossword } from '@/lib/pages/editor/hooks/useCrossword';
import { LoadingState } from '@/lib/pages/play/components/loadingState';
import { Flex, List } from '@chakra-ui/react';
// imports
import { use } from 'react';

interface PlayProps {
  params: Promise<{ id: string }>;
}

export const Play = ({ params }: PlayProps) => {
  const { id } = use(params);

  const { crossword } = useCrossword(id);

  if (!crossword) {
    return <LoadingState />;
  }

  return (
    <Flex
      justifyContent="space-around"
      w="100vw"
      minW="100vw"
      overflowX="hidden"
      p={12}
    >
      <List.Root ml={6} as="ol" flexShrink={0}>
        {crossword.answers.map((answer, index) => (
          <List.Item fontSize={30} key={index} maxW="300px">
            {answer.question}
          </List.Item>
        ))}
      </List.Root>
      <CrosswordVisualization
        isPlayMode
        solution={crossword.solution}
        answers={crossword.answers}
        answersBackgroundColor={crossword.answersBackgroundColor}
        answersBorderColor={crossword.answersBorderColor}
        answersBorderThickness={crossword.answersBorderThickness}
        shouldShowIndexes={crossword.shouldShowIndexes}
        solutionBorderColor={crossword.solutionBorderColor}
        solutionsBackgroundColor={crossword.solutionsBackgroundColor}
        solutionBorderThickness={crossword.solutionBorderThickness}
        size={80}
        shouldShowAnswers={false}
        shouldShowQuestions={false}
        spacesAfterIndexes={crossword.spacesAfterIndexes}
      />
    </Flex>
  );
};
