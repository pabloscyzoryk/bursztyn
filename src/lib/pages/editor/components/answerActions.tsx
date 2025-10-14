// imports

// types
import { type Crossword } from '@/types/crossword';

// ui
import { Center, Button, Icon } from '@chakra-ui/react';
import { Space, Plus, Trash2 } from 'lucide-react';

export const AnswerActions = ({
  crossword,
  lastSpaceAdded,
  onAddAnswer,
  onAddSpace,
  onRemoveSpace,
}: {
  crossword: Crossword;
  lastSpaceAdded: number | null;
  onAddAnswer: () => void;
  onAddSpace: () => void;
  onRemoveSpace: () => void;
}) => (
  <>
    <Center mt={2}>
      <Button onClick={onAddAnswer} colorPalette="teal" color="white">
        Dodaj słowo
        <Icon>
          <Plus />
        </Icon>
      </Button>
    </Center>
    <Center mt={2}>
      <Button
        onClick={onAddSpace}
        colorPalette="yellow"
        color="white"
        disabled={
          lastSpaceAdded === crossword.answers.length - 1 ||
          crossword.answers.length === 0
        }
      >
        Dodaj spację
        <Icon>
          <Space />
        </Icon>
      </Button>
    </Center>
    <Center mt={2}>
      <Button
        onClick={onRemoveSpace}
        colorPalette="red"
        color="white"
        disabled={crossword.spacesAfterIndexes.length === 0}
      >
        Usuń spację
        <Icon>
          <Trash2 />
        </Icon>
      </Button>
    </Center>
  </>
);
