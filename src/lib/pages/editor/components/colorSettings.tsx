// imports

// types
import { type Crossword } from '@/types/crossword';

// ui
import { VStack, ColorPicker, Portal, HStack } from '@chakra-ui/react';

// libs
import { parseColor } from '@chakra-ui/react';

export const ColorSettings = ({
  crossword,
  onUpdate,
}: {
  crossword: Crossword;
  onUpdate: (updates: Partial<Crossword>) => void;
}) => {
  const colorSettings = [
    {
      label: 'Kolor tła rozwiązania',
      value: crossword.solutionsBackgroundColor,
      onChange: (color: string) =>
        onUpdate({ solutionsBackgroundColor: color }),
    },
    {
      label: 'Kolor ramki rozwiązania',
      value: crossword.solutionBorderColor,
      onChange: (color: string) => onUpdate({ solutionBorderColor: color }),
    },
    {
      label: 'Kolor tła odpowiedzi',
      value: crossword.answersBackgroundColor,
      onChange: (color: string) => onUpdate({ answersBackgroundColor: color }),
    },
    {
      label: 'Kolor ramek odpowiedzi',
      value: crossword.answersBorderColor,
      onChange: (color: string) => onUpdate({ answersBorderColor: color }),
    },
  ];

  return (
    <VStack>
      {colorSettings.map((setting, index) => (
        <ColorPicker.Root
          key={index}
          defaultValue={parseColor(setting.value)}
          maxW="200px"
          onValueChange={e => setting.onChange(e.valueAsString)}
        >
          <ColorPicker.HiddenInput />
          <ColorPicker.Label>{setting.label}</ColorPicker.Label>
          <ColorPicker.Control>
            <ColorPicker.Input />
            <ColorPicker.Trigger />
          </ColorPicker.Control>
          <Portal>
            <ColorPicker.Positioner>
              <ColorPicker.Content>
                <ColorPicker.Area />
                <HStack>
                  <ColorPicker.EyeDropper size="xs" variant="outline" />
                  <ColorPicker.Sliders />
                </HStack>
              </ColorPicker.Content>
            </ColorPicker.Positioner>
          </Portal>
        </ColorPicker.Root>
      ))}
    </VStack>
  );
};
