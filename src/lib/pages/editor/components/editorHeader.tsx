// imports

// ui
import { Flex, IconButton } from '@chakra-ui/react';
import { Home } from 'lucide-react';

// components
import { ColorModeIcon } from '@/components/ui/color-mode';

export const EditorHeader = ({
  onHomeClick,
  onToggleColorMode,
}: {
  onHomeClick: () => void;
  onToggleColorMode: () => void;
}) => (
  <Flex gap={2} mb={2} justifyContent="left" w="100%">
    <IconButton onClick={onHomeClick} size="md">
      <Home />
    </IconButton>
    <IconButton onClick={onToggleColorMode} size="md">
      <ColorModeIcon />
    </IconButton>
  </Flex>
);
