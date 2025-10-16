// imports
import { useRouter } from 'next/navigation';

// hooks
import { useColorMode } from '@/components/ui/color-mode';

// utils
import { createNewCrossword } from '@/lib/pages/home/utils/createNewCrossword';

// ui
import { GridItem, Center, VStack, Text, Icon } from '@chakra-ui/react';
import { Plus } from 'lucide-react';

export const NewCrosswordCard = ({
  router,
}: {
  router: ReturnType<typeof useRouter>;
}) => {
  const { colorMode } = useColorMode();

  return (
    <GridItem margin={25}>
      <Center
        w={400}
        h={450}
        bgColor={colorMode === 'light' ? 'gray.300' : 'gray.900'}
        borderRadius="20px"
        onClick={() => createNewCrossword(router)}
        cursor="pointer"
        _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
      >
        <VStack
          borderRadius={16}
          cursor="pointer"
          px={8}
          py={12}
          bg="teal.600"
          _hover={{ bg: 'teal.500' }}
          transitionDuration="fast"
        >
          <Center>
            <Icon color="white">
              <Plus />
            </Icon>
          </Center>
          <Text color="white">Utwórz nową</Text>
        </VStack>
      </Center>
    </GridItem>
  );
};
