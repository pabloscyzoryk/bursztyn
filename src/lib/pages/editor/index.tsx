"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Answer, Crossword } from "@/types/crossword";
import {
  Flex,
  VStack,
  Input,
  Field,
  HStack,
  Center,
  Button,
  Icon,
  Textarea,
  Text,
  parseColor,
  NumberInput,
  ColorPicker,
  Portal,
  Checkbox,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { Delete, Download, Home, Plus, Printer } from "lucide-react";
import { CrosswordVisualization } from "@/components/preview/crosswordvisualization";
import updateCrosswordLocalStorage from "@/lib/pages/editor/utils/updateCrosswordLocalStorage";
import * as htmlToImage from "html-to-image";

interface EditorProps {
  params: Promise<{ id: string }>;
}

export const Editor = ({ params }: EditorProps) => {
  const router = useRouter();

  const { id } = use(params); 

  const [crossword, setCrossword] = useState<Crossword | null>(null);
  const [imgFormat, setImgFormat] = useState(["png"]);

  const setTitle = (title: string) => {
    if (crossword) {
      setCrossword({ ...crossword, title });
    }
  };

  const setSolution = (solution: string) => {
    if (crossword) {
      setCrossword({ ...crossword, solution });
    }
  };

  const setAnswers = (answers: Answer[]) => {
    if (crossword) {
      setCrossword({ ...crossword, answers });
    }
  };

  const setSolutionBorderThickness = (solutionBorderThickness: number) => {
    if (crossword) {
      setCrossword({ ...crossword, solutionBorderThickness });
    }
  };

  const setAnswersBorderThickness = (answersBorderThickness: number) => {
    if (crossword) {
      setCrossword({ ...crossword, answersBorderThickness });
    }
  };

  const setAnswersBackgroundColor = (answersBackgroundColor: string) => {
    if (crossword) {
      setCrossword({ ...crossword, answersBackgroundColor });
    }
  };

  const setAnswersBorderColor = (answersBorderColor: string) => {
    if (crossword) {
      setCrossword({ ...crossword, answersBorderColor });
    }
  };

  const setSolutionBorderColor = (solutionBorderColor: string) => {
    if (crossword) {
      setCrossword({ ...crossword, solutionBorderColor });
    }
  };

  const setSolutionsBackgroundColor = (solutionsBackgroundColor: string) => {
    if (crossword) {
      setCrossword({ ...crossword, solutionsBackgroundColor });
    }
  };

  const setShouldShowIndexes = (shouldShowIndexes: boolean) => {
    if (crossword) {
      setCrossword({ ...crossword, shouldShowIndexes });
    }
  };

  const setShouldShowAnswers = (shouldShowAnswers: boolean) => {
    if (crossword) {
      setCrossword({ ...crossword, shouldShowAnswers });
    }
  };

  const setShouldShowQuestions = (shouldShowQuestions: boolean) => {
    if (crossword) {
      setCrossword({ ...crossword, shouldShowQuestions });
    }
  };

  const setSize = (size: number) => {
    if (crossword) {
      setCrossword({ ...crossword, size });
    }
  };

  const formats = createListCollection({
    items: [
      { label: "PNG", value: "png" },
      { label: "JPEG", value: "jpeg" },
      { label: "SVG", value: "svg" },
    ],
  });

  useEffect(() => {
    const stored = localStorage.getItem("crosswords");
    if (!stored) return router.replace("/");

    try {
      const crosswords: Crossword[] = JSON.parse(stored);
      const found = crosswords.find((cw) => cw.id === id);

      if (!found) return router.replace("/");

      setCrossword(found);
    } catch (err) {
      console.error("Error loading crossword:", err);
      router.replace("/");
    }
  }, [id, router]);

  // Funkcje do manipulacji odpowiedziami
  const updateAnswers = (index: number, question: string) => {
    if (!crossword) return;

    const temp = [...crossword.answers];
    temp[index].question = question;
    setAnswers(temp);
  };

  const handleUpdateWords = (index: number, word: string) => {
    if (!crossword) return;

    const temp = [...crossword.answers];
    temp[index].word = word;
    setAnswers(temp);
  };

  const handleAddQuestion = () => {
    if (!crossword) return;

    const temp = [...crossword.answers];
    temp.push({
      question: "",
      word: "",
      shift: 0,
    });
    setAnswers(temp);
  };

  const handleDeleteQuestion = (index: number) => {
    if (!crossword) return;

    const temp = [...crossword.answers];
    const filtered = temp.filter(
      (answer, answerIndex) => index !== answerIndex
    );
    setAnswers(filtered);
  };

  const handleDownload = async () => {
    const node = document.getElementById("crossword-canvas");

    if (!node) {
      return;
    }

    switch (imgFormat[0]) {
      case "png": {
        const dataUrl = await htmlToImage.toPng(node, { quality: 1 });
        const link = document.createElement("a");
        link.download = `${crossword!.title}`;
        link.href = dataUrl;
        link.click();
        break;
      }
      case "jpeg": {
        const dataUrl = await htmlToImage.toJpeg(node, { quality: 1 });
        const link = document.createElement("a");
        link.download = `${crossword!.title}`;
        link.href = dataUrl;
        link.click();
        break;
      }
      case "svg": {
        const dataUrl = await htmlToImage.toSvg(node, { quality: 1 });
        const link = document.createElement("a");
        link.download = `${crossword!.title}`;
        link.href = dataUrl;
        link.click();
        break;
      }
      default: {
        const dataUrl = await htmlToImage.toPng(node, { quality: 1 });
        const link = document.createElement("a");
        link.download = `${crossword!.title}`;
        link.href = dataUrl;
        link.click();
        break;
      }
    }
  };

  const handlePrint = () => {
    const crosswordElement = document.getElementById("crossword-canvas");

    if (!crosswordElement) {
      console.error("Element 'crossword-canvas' nie został znaleziony");
      return;
    }

    const titleElement = crosswordElement.querySelector(
      "#crossword-title-canvas"
    );

    if (titleElement) {
      titleElement.remove();
    }

    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (!printWindow) {
      alert("Proszę zezwolić na wyskakujące okna dla tej strony");
      return;
    }

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Krzyżówka - ${crossword!.title}</title>
        <style>
          body { 
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .crossword-container {
            margin: 20px 0;
          }
          .crossword-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
          }
          @media print {
            body { margin: 0; padding: 10px; }
            .crossword-container { 
              page-break-inside: avoid;
              break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="crossword-title">${crossword!.title}</div>
        <div class="crossword-container">${crosswordElement.innerHTML}</div>
      </body>
    </html>
  `);

    printWindow.document.close();

    // Poczekaj aż zawartość się załaduje przed drukowaniem
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();

      // Opcjonalnie: zamknij okno po drukowaniu
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  };

  useEffect(() => {
    if (!crossword) return;

    updateCrosswordLocalStorage({
      ...crossword,
      lastModifiedAt: new Date(),
    });
  }, [crossword]);

  if (!crossword) {
    return (
      <Flex justifyContent="center" alignItems="center" w="100vw" h="100vh">
        <Text>Ładowanie krzyżówki...</Text>
      </Flex>
    );
  }

  return (
    <Flex
      justifyContent="space-between"
      w="100vw"
      minH="50vh"
      minW="100vw"
      maxW="100vw"
      overflowX="hidden"
    >
      <VStack p={12}>
        <Flex m={2} justifyContent="left" w="100%">
          <Button onClick={() => router.replace("/")} size="md">
            <Icon>
              <Home />
            </Icon>
          </Button>
        </Flex>

        <Field.Root ml={4} orientation="vertical">
          <Field.Label>Tytuł</Field.Label>
          <Input
            placeholder="Zagadki o bursztynie"
            flex="1"
            onChange={(e) => setTitle(e.target.value)}
            value={crossword.title}
            type="text"
            width={60}
            fontSize={16}
          />
        </Field.Root>

        <Field.Root ml={4} orientation="vertical">
          <Field.Label>Rozwiązanie</Field.Label>
          <Input
            placeholder="Bursztyn"
            flex="1"
            onChange={(e) => setSolution(e.target.value)}
            value={crossword.solution}
            type="text"
            width={60}
            fontSize={16}
          />
        </Field.Root>

        {crossword.answers.map((_, index) => (
          <HStack
            alignItems="start"
            key={index}
            className="group"
            p={2}
            borderRadius="md"
          >
            <Field.Root orientation="vertical">
              <Field.Label>Pytanie nr {index + 1}</Field.Label>
              <Textarea
                placeholder="Treść pytania"
                flex="1"
                onChange={(e) => updateAnswers(index, e.target.value)}
                value={crossword.answers[index].question}
                fontSize={16}
                size="xs"
                resize="none"
              />
            </Field.Root>

            <Field.Root orientation="vertical">
              <Field.Label>Odpowiedź</Field.Label>
              <Input
                placeholder="Słowo"
                flex="1"
                onChange={(e) => handleUpdateWords(index, e.target.value)}
                value={crossword.answers[index].word}
                type="text"
                fontSize={16}
              />
            </Field.Root>

            <Button
              mt={3.5}
              color="gray.500"
              opacity={0}
              visibility="hidden"
              _groupHover={{
                opacity: "1",
                visibility: "visible",
              }}
              transition="opacity 0.3s ease-in-out"
              bg="transparent"
              w={12}
              h={12}
              onClick={() => handleDeleteQuestion(index)}
            >
              <Icon as={Delete} />
            </Button>
          </HStack>
        ))}
        <Center mt={2}>
          <Button
            onClick={() => handleAddQuestion()}
            colorPalette="teal"
            color="white"
          >
            Dodaj słowo
            <Icon>
              <Plus />
            </Icon>
          </Button>
        </Center>
      </VStack>

      <VStack maxW={1000} minW={1000}>
        <Flex
          id="crossword-canvas"
          minH={440}
          alignItems="center"
          direction="column"
        >
          <Text id="crossword-title-canvas" fontWeight={500} mt={6} maxH={16}>
            {crossword.title}
          </Text>

          <CrosswordVisualization
            solution={crossword.solution}
            answers={crossword.answers}
            answersBackgroundColor={crossword.answersBackgroundColor}
            answersBorderColor={crossword.answersBorderColor}
            answersBorderThickness={crossword.answersBorderThickness}
            shouldShowIndexes={crossword.shouldShowIndexes}
            solutionBorderColor={crossword.solutionBorderColor}
            solutionsBackgroundColor={crossword.solutionsBackgroundColor}
            solutionBorderThickness={crossword.solutionBorderThickness}
            size={crossword.size + 10}
            shouldShowAnswers={crossword.shouldShowAnswers}
            shouldShowQuestions={crossword.shouldShowQuestions}
          />
        </Flex>
        <Flex gap={6}>
          <VStack>
            <ColorPicker.Root
              defaultValue={parseColor(crossword.solutionsBackgroundColor)}
              maxW="200px"
              onValueChange={(e) => {
                setSolutionsBackgroundColor(e.valueAsString);
              }}
            >
              <ColorPicker.HiddenInput />
              <ColorPicker.Label>Kolor tła rozwiązania</ColorPicker.Label>
              <ColorPicker.Control>
                <ColorPicker.Input />
                <ColorPicker.Trigger />
              </ColorPicker.Control>
              <Portal>
                <ColorPicker.Positioner>
                  <ColorPicker.Content>
                    <ColorPicker.Area />
                    <HStack>
                      <ColorPicker.EyeDropper size="xs" variant="outline" />
                      <ColorPicker.Sliders />
                    </HStack>
                  </ColorPicker.Content>
                </ColorPicker.Positioner>
              </Portal>
            </ColorPicker.Root>

            <ColorPicker.Root
              defaultValue={parseColor(crossword.solutionBorderColor)}
              maxW="200px"
              onValueChange={(e) => {
                setSolutionBorderColor(e.valueAsString);
              }}
            >
              <ColorPicker.HiddenInput />
              <ColorPicker.Label>Kolor ramki rozwiązania</ColorPicker.Label>
              <ColorPicker.Control>
                <ColorPicker.Input />
                <ColorPicker.Trigger />
              </ColorPicker.Control>
              <Portal>
                <ColorPicker.Positioner>
                  <ColorPicker.Content>
                    <ColorPicker.Area />
                    <HStack>
                      <ColorPicker.EyeDropper size="xs" variant="outline" />
                      <ColorPicker.Sliders />
                    </HStack>
                  </ColorPicker.Content>
                </ColorPicker.Positioner>
              </Portal>
            </ColorPicker.Root>

            <ColorPicker.Root
              defaultValue={parseColor(crossword.answersBackgroundColor)}
              maxW="200px"
              onValueChange={(e) => {
                setAnswersBackgroundColor(e.valueAsString);
              }}
            >
              <ColorPicker.HiddenInput />
              <ColorPicker.Label>Kolor tła odpowiedzi</ColorPicker.Label>
              <ColorPicker.Control>
                <ColorPicker.Input />
                <ColorPicker.Trigger />
              </ColorPicker.Control>
              <Portal>
                <ColorPicker.Positioner>
                  <ColorPicker.Content>
                    <ColorPicker.Area />
                    <HStack>
                      <ColorPicker.EyeDropper size="xs" variant="outline" />
                      <ColorPicker.Sliders />
                    </HStack>
                  </ColorPicker.Content>
                </ColorPicker.Positioner>
              </Portal>
            </ColorPicker.Root>

            <ColorPicker.Root
              defaultValue={parseColor(crossword.answersBorderColor)}
              maxW="200px"
              onValueChange={(e) => {
                setAnswersBorderColor(e.valueAsString);
              }}
            >
              <ColorPicker.HiddenInput />
              <ColorPicker.Label>Kolor ramek odpowiedzi</ColorPicker.Label>
              <ColorPicker.Control>
                <ColorPicker.Input />
                <ColorPicker.Trigger />
              </ColorPicker.Control>
              <Portal>
                <ColorPicker.Positioner>
                  <ColorPicker.Content>
                    <ColorPicker.Area />
                    <HStack>
                      <ColorPicker.EyeDropper size="xs" variant="outline" />
                      <ColorPicker.Sliders />
                    </HStack>
                  </ColorPicker.Content>
                </ColorPicker.Positioner>
              </Portal>
            </ColorPicker.Root>
          </VStack>

          <VStack>
            <Field.Root>
              <Field.Label>Wielkość krzyżówki</Field.Label>
              <NumberInput.Root
                onValueChange={(e) => setSize(e.valueAsNumber)}
                value={String(crossword.size)}
                min={0}
                width="200px"
              >
                <NumberInput.Control />
                <NumberInput.Input />
              </NumberInput.Root>
            </Field.Root>

            <Field.Root>
              <Field.Label>Grubość ramki rozwiązania</Field.Label>
              <NumberInput.Root
                onValueChange={(e) =>
                  setSolutionBorderThickness(e.valueAsNumber)
                }
                value={String(crossword.solutionBorderThickness)}
                min={0}
                width="200px"
              >
                <NumberInput.Control />
                <NumberInput.Input />
              </NumberInput.Root>
            </Field.Root>

            <Field.Root>
              <Field.Label>Grubość ramki odpowiedzi</Field.Label>
              <NumberInput.Root
                onValueChange={(e) =>
                  setAnswersBorderThickness(e.valueAsNumber)
                }
                value={String(crossword.answersBorderThickness)}
                min={0}
                width="200px"
              >
                <NumberInput.Control />
                <NumberInput.Input />
              </NumberInput.Root>
            </Field.Root>
          </VStack>

          <Flex direction="column" gap={4} mt={7}>
            <Checkbox.Root
              checked={crossword.shouldShowQuestions}
              onCheckedChange={(e) => setShouldShowQuestions(!!e.checked)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Pokazać pytania?</Checkbox.Label>
            </Checkbox.Root>
            <Checkbox.Root
              checked={crossword.shouldShowAnswers}
              onCheckedChange={(e) => setShouldShowAnswers(!!e.checked)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Ujawnić odpowiedzi?</Checkbox.Label>
            </Checkbox.Root>

            <Checkbox.Root
              checked={crossword.shouldShowIndexes}
              onCheckedChange={(e) => setShouldShowIndexes(!!e.checked)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Pokazać numery wierszy?</Checkbox.Label>
            </Checkbox.Root>

            <Flex gap={4}>
              <Button onClick={() => handleDownload()} colorPalette="teal">
                Pobierz
                <Icon>
                  <Download />
                </Icon>
              </Button>
              <Select.Root
                defaultValue={["png"]}
                collection={formats}
                size="sm"
                width={20}
                onValueChange={(e) => setImgFormat(e.value)}
                value={imgFormat}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select framework" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {formats.items.map((format) => (
                        <Select.Item item={format} key={format.value}>
                          {format.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Flex>
            <Button onClick={() => handlePrint()} colorPalette="blue">
              Drukuj
              <Icon>
                <Printer />
              </Icon>
            </Button>
          </Flex>
        </Flex>
      </VStack>
    </Flex>
  );
};
