// imports

// types
import { type Crossword } from '@/types/crossword';

// ui
import {
  GridItem,
  Box,
  VStack,
  Center,
  Text,
  Flex,
  Button,
  IconButton,
  Icon,
} from '@chakra-ui/react';

// hooks
import { useColorMode } from '@/components/ui/color-mode';

// components
import { CrosswordVisualization } from '@/components/preview/crosswordvisualization';
import Link from 'next/link';
import { Edit, Play } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';

export const CrosswordCard = ({ crossword }: { crossword: Crossword }) => {
  const { colorMode } = useColorMode();

  const router = useRouter();

  const handleEditCrossword = () => {
    router.replace(`/${crossword.id}`);
  };

  return (
    <GridItem
      className="group"
      w={400}
      margin={25}
      key={crossword.id}
      position="relative"
    >
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
      <Flex gap={2} position="absolute" top={385} right="22px">
        <Tooltip
          positioning={{ placement: 'top' }}
          showArrow
          content="Edytuj tę krzyżówkę"
        >
          <Button
            onClick={handleEditCrossword}
            _groupHover={{ opacity: 1 }}
            opacity={0}
            colorPalette="gray"
          >
            <Icon>
              <Edit />
            </Icon>
          </Button>
        </Tooltip>
        {process.env.NEXT_PUBLIC_IS_DEV &&
          <Tooltip
            positioning={{ placement: 'top' }}
            showArrow
            content="Rozwiąż tę krzyżówkę"
          >
            <Button
              _groupHover={{ opacity: 1 }}
              opacity={0}
              colorPalette="green"
            >
              <Icon>
                <Play />
              </Icon>
            </Button>
          </Tooltip>
        }
      </Flex>
    </GridItem>
  );
};
