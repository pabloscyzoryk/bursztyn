// imports

// types
import { Crossword } from '@/types/crossword';

// ui
import { VStack, Field, NumberInput } from '@chakra-ui/react';

export const SizeSettings = ({
  crossword,
  onUpdate,
}: {
  crossword: Crossword;
  onUpdate: (updates: Partial<Crossword>) => void;
}) => {
  const sizeSettings = [
    {
      label: 'Wielkość krzyżówki',
      value: crossword.size,
      onChange: (value: number) => onUpdate({ size: value }),
    },
    {
      label: 'Grubość ramki rozwiązania',
      value: crossword.solutionBorderThickness,
      onChange: (value: number) => onUpdate({ solutionBorderThickness: value }),
    },
    {
      label: 'Grubość ramki odpowiedzi',
      value: crossword.answersBorderThickness,
      onChange: (value: number) => onUpdate({ answersBorderThickness: value }),
    },
  ];

  return (
    <VStack>
      {sizeSettings.map((setting, index) => (
        <Field.Root key={index}>
          <Field.Label>{setting.label}</Field.Label>
          <NumberInput.Root
            onValueChange={e => setting.onChange(e.valueAsNumber)}
            value={String(setting.value)}
            min={0}
            width="200px"
          >
            <NumberInput.Control />
            <NumberInput.Input />
          </NumberInput.Root>
        </Field.Root>
      ))}
    </VStack>
  );
};
