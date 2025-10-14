// imports

// types
import { Crossword } from '@/types/crossword';

// ui
import { Dialog, Button, CloseButton, Icon, Portal } from '@chakra-ui/react';
import { Trash2 } from 'lucide-react';

export const DeleteProjectDialog = ({
  crossword,
  onDelete,
}: {
  crossword: Crossword;
  onDelete: () => void;
}) => (
  <Dialog.Root motionPreset="slide-in-bottom">
    <Dialog.Trigger asChild>
      <Button colorPalette="red">
        Usuń ten projekt krzyżówki
        <Icon>
          <Trash2 />
        </Icon>
      </Button>
    </Dialog.Trigger>
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>
              Czy na pewno usunąć krzyżówkę {crossword.title}?
            </Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <p>
              Wszyskie dane tego projektu zostaną utracone, bez możliwości
              odzyskania. Upewnij się, że ten projekt nie jest Ci już potrzebny
              lub posiadasz kopię zapasową. Po usunięciu zostaniesz przeniesiony
              na stronę główną aplikacji Bursztyn.
            </p>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button variant="outline">Anuluj</Button>
            </Dialog.ActionTrigger>
            <Button onClick={onDelete} colorPalette="red">
              Usuń
            </Button>
          </Dialog.Footer>
          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
);
