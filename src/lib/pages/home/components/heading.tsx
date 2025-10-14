// imports
import { useRouter } from 'next/navigation';
import { ColorModeIcon, useColorMode } from '@/components/ui/color-mode';

// ui
import { HStack, Heading as Title, Icon, IconButton } from '@chakra-ui/react';
import { Plus } from 'lucide-react';

// components
import { Button } from '@/components/ui/button';

// utils
import createNewCrossword from '@/lib/pages/home/utils/createNewCrossword';

export const Heading = () => {
  const router = useRouter();

  const { toggleColorMode } = useColorMode();

  return (
    <HStack marginY={8}>
      <Title textAlign="center" fontSize={['1xl', '3xl', '5xl']}>
        Bursztyn - Generator Krzyżówek
      </Title>
      <Button
        onClick={() => createNewCrossword(router)}
        colorPalette="teal"
        right={'120px'}
        mt={2}
        position="absolute"
      >
        Nowa
        <Icon>
          <Plus />
        </Icon>
      </Button>
      <IconButton
        right={'230px'}
        mt={2}
        position="absolute"
        onClick={toggleColorMode}
        size="md"
      >
        <ColorModeIcon />
      </IconButton>
    </HStack>
  );
};
