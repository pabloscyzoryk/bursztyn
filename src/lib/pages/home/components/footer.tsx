// imports

// chakra-ui
import { Text, Box, Flex, VStack, Center, Icon } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { FC } from "react";
import { Crossword } from "@/types/crossword";
import Link from "next/link";
import { DiGithubBadge } from "react-icons/di";
import { FaInstagram } from "react-icons/fa";

export const Footer = () => {
  return (
    <Flex
      p={6}
      justifyContent="center"
      alignItems="center"
      w="100vw"
      bg="gray.800"
      gap={8}
    >
      <Text color="white">Bursztyn by Paweł Cyrzyk 2025 &copy;</Text>

      <Flex gap={3} w={100} justifyContent="center" alignItems="center">
        <Link href="https://github.com/pabloscyzoryk/bursztyn">
          <Icon color="white" size="2xl">
            <DiGithubBadge />
          </Icon>
        </Link>
        <Link href="https://instagram.com/pabloscyzoryk">
          <Icon color="white" size="xl">
            <FaInstagram />
          </Icon>
        </Link>
      </Flex>
    </Flex>
  );
};
