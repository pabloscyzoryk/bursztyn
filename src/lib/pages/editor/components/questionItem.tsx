// imports
import { type Crossword, type Answer } from '@/types/crossword';

// ui
import { HStack, Field, Input, Textarea } from '@chakra-ui/react';

// components
import { ShiftButtons } from '@/lib/pages/editor/components/shiftButtons';
import { DeleteButton } from '@/lib/pages/editor/components/deleteButton';

export const QuestionItem = ({
  crossword,
  index,
  onUpdate,
  onDelete,
  onShift,
}: {
  crossword: Crossword;
  index: number;
  onUpdate: (index: number, updates: Partial<Answer>) => void;
  onDelete: (index: number) => void;
  onShift: (index: number, amount: number) => void;
}) => {
  const shouldShowShiftButtons = () => {
    const answer = crossword.answers[index];
    const solutionLetter = crossword.solution[index]?.toUpperCase();

    if (!solutionLetter || !answer?.word) return false;

    const matchingIndexes = answer.word
      .split('')
      .map((l, i) => (l.toUpperCase() === solutionLetter ? i : -1))
      .filter(i => i !== -1);

    return matchingIndexes.length > 1;
  };

  return (
    <HStack
      className="group"
      p={2}
      borderRadius="md"
      minW="0"
      width="100%"
      mt={-4}
    >
      <Field.Root mt={5} orientation="vertical" flex="1" minW="0">
        <Field.Label>
          Pytanie nr {index + 1}
          {crossword.solution[index] &&
            `, litera: ${crossword.solution[index]}`}
        </Field.Label>
        <Textarea
          placeholder="Treść pytania"
          value={crossword.answers[index].question}
          onChange={e => onUpdate(index, { question: e.target.value })}
          fontSize={16}
          size="xs"
          resize="none"
        />
      </Field.Root>

      <Field.Root orientation="vertical" flex="1" minW="0">
        <Field.Label>Odpowiedź</Field.Label>
        <Input
          placeholder="Słowo"
          value={crossword.answers[index].word}
          onChange={e => onUpdate(index, { word: e.target.value })}
          type="text"
          fontSize={16}
        />
      </Field.Root>

      <ShiftButtons
        index={index}
        shouldShow={shouldShowShiftButtons()}
        onShift={onShift}
      />

      <DeleteButton index={index} onDelete={onDelete} />
    </HStack>
  );
};
