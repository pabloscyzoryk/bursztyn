// imports
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import createNewCrossword from "@/lib/pages/home/utils/createNewCrossword";
import { useEffect, useState } from "react";
// components
import { CrosswordPreview } from "@/lib/pages/home/components/crosswordpreview";
import Link from "next/link";

// chakra-ui
import { Center, Grid, GridItem, Text, VStack, Icon, Flex, Box, Button } from "@chakra-ui/react";
import { Crossword } from "@/types/crossword";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { CrosswordVisualization } from "@/components/preview/crosswordvisualization";

export const Dashboard = () => {
  const router = useRouter();
  const [crosswords, setCrosswords] = useLocalStorage<Crossword[]>(
    "crosswords",
    []
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "crosswords" && e.newValue) {
        try {
          const newCrosswords = JSON.parse(e.newValue);
          setCrosswords(newCrosswords);
        } catch (error) {
          console.error("Error syncing crosswords from localStorage:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isClient]);

  if (!isClient) {
    return (
      <Center w="100vw" minH="50vh" minW="100vw" mt={2}>
        <Text>Ładowanie...</Text>
      </Center>
    );
  }

  return (
    <Center w="100vw" minH="50vh" minW="100vw" mt={2}>
      <Grid
        w="90%"
        templateColumns="repeat(auto-fit, minmax(400px, 1fr))"
        gap={25}
      >
        {crosswords.map((c) => (
          <GridItem className="group" w={400} margin={25} key={c.id}>
            <Box 
              w={400} 
              h={450} 
              borderRadius="20px"
              overflow="hidden"
              bgColor="gray.300"
              _hover={{ transform: "scale(1.01)", transition: "transform 0.2s" }}
            >
              <Link href={`/${c.id}`} style={{ display: "block", width: "100%", height: "100%" }}>
                <VStack w="100%" h="100%">
                  <Center m={4} flexShrink={0}>
                    <Text fontWeight="bold">{c.title}</Text>
                  </Center>
                  <Flex 
                    flex={1} 
                    justifyContent="center" 
                    alignItems="center" 
                    w="100%" 
                    p={4}
                  >
                    <CrosswordVisualization
                      answers={c.answers}
                      answersBackgroundColor={c.answersBackgroundColor}
                      answersBorderColor={c.answersBorderColor}
                      answersBorderThickness={c.answersBorderThickness}
                      shouldShowIndexes={c.shouldShowIndexes}
                      solution={c.solution}
                      solutionBorderColor={c.solutionBorderColor}
                      solutionBorderThickness={c.solutionBorderThickness}
                      solutionsBackgroundColor={c.solutionsBackgroundColor}
                      size={20}
                      shouldShowAnswers={true}
                      shouldShowQuestions={false}
                    />
                  </Flex>
                </VStack>
              </Link>
            </Box>
          </GridItem>
        ))}

        <GridItem margin={25}>
          <Center 
            w={400} 
            h={450} 
            bgColor="gray.300" 
            borderRadius="20px"
            onClick={() => createNewCrossword(router)}
            cursor="pointer"
            _hover={{ transform: "scale(1.02)", transition: "transform 0.2s" }}
          >
            <VStack
              borderRadius={16}
              cursor="pointer"
              px={8}
              py={12}
              bg="teal.600"
              _hover={{ bg: "teal.500" }}
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
      </Grid>
    </Center>
  );
};