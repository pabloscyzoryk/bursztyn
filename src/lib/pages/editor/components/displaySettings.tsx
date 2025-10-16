// imports
import { type Crossword } from '@/types/crossword';

// ui
import { Flex, Checkbox } from '@chakra-ui/react';

export const DisplaySettings = ({
  crossword,
  onUpdate,
}: {
  crossword: Crossword;
  onUpdate: (updates: Partial<Crossword>) => void;
}) => {
  const displaySettings = [
    {
      label: 'Pokazać pytania?',
      checked: crossword.shouldShowQuestions,
      onChange: (checked: boolean) =>
        onUpdate({ shouldShowQuestions: checked }),
    },
    {
      label: 'Ujawnić odpowiedzi?',
      checked: crossword.shouldShowAnswers,
      onChange: (checked: boolean) => onUpdate({ shouldShowAnswers: checked }),
    },
    {
      label: 'Pokazać numery wierszy?',
      checked: crossword.shouldShowIndexes,
      onChange: (checked: boolean) => onUpdate({ shouldShowIndexes: checked }),
    },
  ];

  return (
    <Flex direction="column" gap={4}>
      {displaySettings.map((setting, index) => (
        <Checkbox.Root
          key={index}
          checked={setting.checked}
          onCheckedChange={e => setting.onChange(!!e.checked)}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>{setting.label}</Checkbox.Label>
        </Checkbox.Root>
      ))}
    </Flex>
  );
};
