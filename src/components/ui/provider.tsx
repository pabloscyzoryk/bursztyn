'use client';

// imports
import { customTheme } from '@/lib/styles/theme';
import { ColorModeProvider } from './color-mode';

// ui
import { ChakraProvider } from '@chakra-ui/react';

export function Provider(props: React.PropsWithChildren) {
  return (
    <ChakraProvider value={customTheme}>
      <ColorModeProvider>{props.children}</ColorModeProvider>
    </ChakraProvider>
  );
}
