// imports

// chakra-ui
import { HStack, Heading as Title, Icon } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import createNewCrossword from "@/lib/pages/home/utils/createNewCrossword";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export const Heading = () => {
  const router = useRouter();

  return (
    <HStack marginY={8}>
      <Title textAlign="center" fontSize={["1xl", "3xl", "5xl"]}>
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
    </HStack>
  );
};
