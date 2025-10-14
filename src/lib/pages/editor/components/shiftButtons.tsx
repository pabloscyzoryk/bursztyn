// imports

// ui
import { Flex, Box } from '@chakra-ui/react';
import { Plus, Minus } from 'lucide-react';

// components
import { ShiftButton } from '@/lib/pages/editor/components/shiftButton';

export const ShiftButtons = ({
  index,
  shouldShow,
  onShift,
}: {
  index: number;
  shouldShow: boolean;
  onShift: (index: number, amount: number) => void;
}) => (
  <Flex
    direction="column"
    width="48px"
    justifyContent="center"
    alignItems="center"
    mt={7}
  >
    {shouldShow ? (
      <>
        <ShiftButton icon={Plus} onClick={() => onShift(index, 1)} />
        <ShiftButton icon={Minus} onClick={() => onShift(index, -1)} />
      </>
    ) : (
      <>
        <Box w={6} h={6} />
        <Box w={6} h={6} />
      </>
    )}
  </Flex>
);
