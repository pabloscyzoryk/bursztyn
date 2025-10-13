// imports

// chakra-ui
import { Text, VStack, Center } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { FC } from "react";
import { Crossword } from "@/types/crossword";
import Link from "next/link";

export const CrosswordPreview: FC<Crossword> = (props) => {
  const url = `/${props.id}`;

  return (
    <Link href={url}>
      <VStack w={400} h={450} bgColor="gray.300" borderRadius='20px'>
        <Center m={4}>
          <Text>{props.title}</Text>
        </Center>
      </VStack>
    </Link>
  );
};
