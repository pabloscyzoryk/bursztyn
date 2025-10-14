'use client';

// imports

// types
import type { ReactNode } from 'react';

// ui
import { Box } from '@chakra-ui/react';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return <Box as="main">{children}</Box>;
};
