// imports
import { type Crossword } from '@/types/crossword';

// ui
import { Field, Input } from '@chakra-ui/react';

export const ProjectSettings = ({
  crossword,
  onUpdate,
}: {
  crossword: Crossword;
  onUpdate: (updates: Partial<Crossword>) => void;
}) => (
  <>
    <Field.Root ml={4} orientation="vertical">
      <Field.Label>Tytuł</Field.Label>
      <Input
        placeholder="Zagadki o bursztynie"
        value={crossword.title}
        onChange={e => onUpdate({ title: e.target.value })}
        type="text"
        width={60}
        fontSize={16}
      />
    </Field.Root>

    <Field.Root ml={4} orientation="vertical">
      <Field.Label>Rozwiązanie</Field.Label>
      <Input
        placeholder="Bursztyn"
        value={crossword.solution}
        onChange={e => onUpdate({ solution: e.target.value })}
        type="text"
        width={60}
        fontSize={16}
      />
    </Field.Root>
  </>
);
