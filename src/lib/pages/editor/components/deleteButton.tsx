// imports

// ui
import { Button, Icon } from '@chakra-ui/react';
import { Delete } from 'lucide-react';

export const DeleteButton = ({
  index,
  onDelete,
}: {
  index: number;
  onDelete: (index: number) => void;
}) => (
  <Button
    color="gray.500"
    opacity={0}
    visibility="hidden"
    _groupHover={{ opacity: '1', visibility: 'visible' }}
    mt={7}
    transition="opacity 0.3s ease-in-out"
    bg="transparent"
    w={6}
    h={12}
    onClick={() => onDelete(index)}
  >
    <Icon as={Delete} />
  </Button>
);
