// imports

// ui
import { Button, Icon } from '@chakra-ui/react';

export const ShiftButton = ({
  icon,
  onClick,
}: {
  icon: any;
  onClick: () => void;
}) => (
  <Button
    color="gray.500"
    opacity={0}
    visibility="hidden"
    _groupHover={{ opacity: '1', visibility: 'visible' }}
    transition="opacity 0.3s ease-in-out"
    bg="transparent"
    w={6}
    h={6}
    onClick={onClick}
  >
    <Icon as={icon} />
  </Button>
);
