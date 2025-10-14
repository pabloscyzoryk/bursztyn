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
  parseColor,
  NumberInput,
  ColorPicker,
  Portal,
  Checkbox,
  Select,
  createListCollection,
  Dialog,
  CloseButton,
  Box,
  List,
  Text,
  IconButton,
} from "@chakra-ui/react";
import {
  Delete,
  Download,
  Home,
  Minus,
  Moon,
  Plus,
  Printer,
  Space,
  Sun,
  Trash2,
} from "lucide-react";
import updateCrosswordLocalStorage from "@/lib/pages/editor/utils/updateCrosswordLocalStorage";
import * as htmlToImage from "html-to-image";
import { useColorMode } from "@/components/ui/color-mode";
import { CrosswordVisualization } from "@/components/preview/crosswordvisualization";

interface EditorProps {
  params: Promise<{ id: string }>;
}

export const Editor = ({ params }: EditorProps) => {
  const router = useRouter();

  const { toggleColorMode, colorMode } = useColorMode();

  const { id } = use(params);

  const [crossword, setCrossword] = useState<Crossword | null>(null);
  const [imgFormat, setImgFormat] = useState(["png"]);
  const [lastSpaceAdded, setLastSpaceAdded] = useState<number | null>(null); // Śledzi kiedy ostatnio dodano spację

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

  const setSpacesAfterIndexes = (spacesAfterIndexes: number[]) => {
    if (crossword) {
      setCrossword({ ...crossword, spacesAfterIndexes });
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
      // Ustawiamy lastSpaceAdded na ostatni indeks jeśli są spacje
      if (found.spacesAfterIndexes && found.spacesAfterIndexes.length > 0) {
        setLastSpaceAdded(Math.max(...found.spacesAfterIndexes));
      }
    } catch (err) {
      console.error("Error loading crossword:", err);
      router.replace("/");
    }
  }, [id, router]);

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
    // Resetujemy lastSpaceAdded po dodaniu nowego pytania, aby można było dodać kolejną spację
    setLastSpaceAdded(null);
  };

  const handleAddSpace = () => {
    if (!crossword) return;

    const currentIndex = crossword.answers.length - 1;
    if (currentIndex < 0) return;

    // Sprawdzamy czy już dodano spację po tym samym wierszu
    if (lastSpaceAdded === currentIndex) {
      return; // Nie dodajemy kolejnej spacji po tym samym wierszu
    }

    const temp = [...crossword.spacesAfterIndexes];
    // Dodajemy spację po ostatnim wierszu
    temp.push(currentIndex);
    setSpacesAfterIndexes(temp);
    setLastSpaceAdded(currentIndex); // Zapisujemy, że dodaliśmy spację po tym wierszu
  };

  const handleRemoveLastSpace = () => {
    if (!crossword) return;

    const temp = [...crossword.spacesAfterIndexes];
    if (temp.length > 0) {
      const removedIndex = temp[temp.length - 1];
      temp.pop();
      setSpacesAfterIndexes(temp);
      
      // Aktualizujemy lastSpaceAdded
      if (temp.length > 0) {
        setLastSpaceAdded(Math.max(...temp));
      } else {
        setLastSpaceAdded(null);
      }
    }
  };

   const handleDeleteQuestion = (index: number) => {
    if (!crossword) return;

    const newAnswers = crossword.answers.filter((_, answerIndex) => index !== answerIndex);
    
    const updatedSpaces = crossword.spacesAfterIndexes
      .filter(spaceIndex => spaceIndex !== index)
      .map(spaceIndex => spaceIndex > index ? spaceIndex - 1 : spaceIndex);

    setCrossword({
      ...crossword,
      answers: newAnswers,
      spacesAfterIndexes: updatedSpaces
    });

    // Aktualizujemy lastSpaceAdded
    if (updatedSpaces.length > 0) {
      setLastSpaceAdded(Math.max(...updatedSpaces));
    } else {
      setLastSpaceAdded(null);
    }
  };
  const handleDeleteProject = () => {
    const crosswordsLC = localStorage.getItem("crosswords");

    if (!crosswordsLC || !crossword) {
      return;
    }

    const parsed: Crossword[] = JSON.parse(crosswordsLC);
    const filtered = parsed.filter((cw: Crossword) => cw.id !== crossword.id);
    localStorage.setItem("crosswords", JSON.stringify(filtered));

    router.replace("/");
  };

  const shouldShowShiftButtons = (index: number): boolean => {
    if (!crossword) return false;

    const answer = crossword.answers[index];
    const solutionLetter = crossword.solution[index]?.toUpperCase();

    if (!solutionLetter) return false;
    if (!answer?.word) return false;

    const wordLetters = answer.word.split("");
    const matchingIndexes = wordLetters
      .map((l, i) => (l.toUpperCase() === solutionLetter ? i : -1))
      .filter((i) => i !== -1);

    return matchingIndexes.length > 1;
  };

  const handleShift = (index: number, amount: number) => {
    if (!crossword) return;

    const currentAnswer = crossword.answers[index];
    if (!currentAnswer) return;

    const solutionLetter = crossword.solution[index]?.toUpperCase();
    if (!solutionLetter) return;
    if (!currentAnswer.word) return;

    const positions: number[] = currentAnswer.word
      .split("")
      .map((l, i) => (l.toUpperCase() === solutionLetter ? i : -1))
      .filter((i) => i !== -1);

    if (positions.length <= 1) {
      return;
    }

    const maxShift = positions.length - 1;
    const currentShift =
      typeof currentAnswer.shift === "number" ? currentAnswer.shift : 0;
    let newShift = currentShift + amount;

    if (newShift > maxShift) newShift = 0;
    if (newShift < 0) newShift = maxShift;

    const temp = [...crossword.answers];
    temp[index] = {
      ...currentAnswer,
      shift: newShift,
    };
    setAnswers(temp);
  };

  const handleDownload = async () => {
    const node = document.getElementById("crossword-canvas");
    if (!node) {
      console.error("Element 'crossword-canvas' nie został znaleziony");
      return;
    }

    const clone = node.cloneNode(true) as HTMLElement;

    clone.style.position = "fixed";
    clone.style.left = "0";
    clone.style.top = "0";
    clone.style.overflow = "visible";
    clone.style.width = "auto";
    clone.style.height = "auto";
    clone.style.maxWidth = "none";
    clone.style.maxHeight = "none";
    clone.style.minWidth = "none";
    clone.style.minHeight = "none";
    clone.style.zIndex = "9999";
    clone.style.visibility = "visible";
    clone.style.opacity = "1";

    const originalDisplay = node.style.display;
    node.style.display = "none";

    document.body.appendChild(clone);

    const format = imgFormat[0];
    const isJpeg = format === "jpeg";

    const options = {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: isJpeg
        ? colorMode === "dark"
          ? "000000"
          : "ffffff"
        : undefined,
      quality: 1,
      useCORS: true,
      style: {
        transform: "none",
        overflow: "visible",
      },
    };

    try {
      let dataUrl;
      console.log("Rozpoczynanie renderowania format:", format);

      // Dodaj krótki timeout aby zapewnić renderowanie
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (format === "png") {
        dataUrl = await htmlToImage.toPng(clone, options);
      } else if (format === "jpeg") {
        dataUrl = await htmlToImage.toJpeg(clone, options);
      } else if (format === "svg") {
        dataUrl = await htmlToImage.toSvg(clone, options);
      } else {
        dataUrl = await htmlToImage.toPng(clone, options);
      }

      if (!dataUrl || dataUrl === "data:,") {
        throw new Error("Puste dane obrazu");
      }

      console.log("Renderowanie zakończone, tworzenie linku pobierania");

      const link = document.createElement("a");
      link.download = `${crossword?.title || "crossword"}.${format}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Błąd podczas renderowania obrazu:", err);
      alert("Wystąpił błąd podczas generowania obrazu. Spróbuj ponownie.");
    } finally {
      node.style.display = originalDisplay;
      if (document.body.contains(clone)) {
        document.body.removeChild(clone);
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

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();

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
      minW="100vw"
      maxW="100vw"
      overflowX="hidden"
      pr={4}
    >
      <VStack p={12}>
        <Flex gap={2} mb={2} justifyContent="left" w="100%">
          <IconButton onClick={() => router.replace("/")} size="md">
            <Home />
          </IconButton>
          <IconButton onClick={toggleColorMode} size="md">
            {colorMode === "light" ? <Sun /> : <Moon />}
          </IconButton>
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
            alignItems="center"
            key={index}
            className="group"
            p={2}
            borderRadius="md"
            minW="0"
            width="100%"
          >
            <Field.Root orientation="vertical" flex="1" minW="0">
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

            <Field.Root orientation="vertical" flex="1" minW="0">
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

            <Flex
              direction="column"
              width="48px"
              justifyContent="center"
              alignItems="center"
              mt={7}
            >
              {shouldShowShiftButtons(index) ? (
                <>
                  <Button
                    color="gray.500"
                    opacity={0}
                    visibility="hidden"
                    _groupHover={{
                      opacity: "1",
                      visibility: "visible",
                    }}
                    transition="opacity 0.3s ease-in-out"
                    bg="transparent"
                    w={6}
                    h={6}
                    onClick={() => handleShift(index, 1)}
                  >
                    <Icon as={Plus} />
                  </Button>
                  <Button
                    color="gray.500"
                    opacity={0}
                    visibility="hidden"
                    _groupHover={{
                      opacity: "1",
                      visibility: "visible",
                    }}
                    transition="opacity 0.3s ease-in-out"
                    bg="transparent"
                    w={6}
                    h={6}
                    onClick={() => handleShift(index, -1)}
                  >
                    <Icon as={Minus} />
                  </Button>
                </>
              ) : (
                <>
                  <Box w={6} h={6} />
                  <Box w={6} h={6} />
                </>
              )}
            </Flex>

            <Button
              color="gray.500"
              opacity={0}
              visibility="hidden"
              _groupHover={{
                opacity: "1",
                visibility: "visible",
              }}
              mt={7}
              transition="opacity 0.3s ease-in-out"
              bg="transparent"
              w={6}
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
        <Center mt={2}>
          <Button
            onClick={() => handleAddSpace()}
            colorPalette="yellow"
            color="white"
            disabled={lastSpaceAdded === crossword.answers.length - 1} // Wyłączamy tylko jeśli ostatnio dodano spację po tym samym wierszu
          >
            Dodaj spację
            <Icon>
              <Space />
            </Icon>
          </Button>
        </Center>
        <Center mt={2}>
          <Button
            onClick={() => handleRemoveLastSpace()}
            colorPalette="red"
            color="white"
            disabled={crossword.spacesAfterIndexes.length === 0} // Wyłączamy jeśli nie ma spacji
          >
            Usuń spację
            <Icon>
              <Trash2 />
            </Icon>
          </Button>
        </Center>
      </VStack>

      <VStack minW={1000}>
        <Flex
          id="crossword-canvas"
          alignItems="center"
          direction="column"
          overflowY="auto"
          overflowX="auto"
          p={4}
          maxW={1000}
          maxH={440}
        >
          <Text
            h={4}
            id="crossword-title-canvas"
            fontWeight={500}
            mt={6}
            maxH={16}
          >
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
            spacesAfterIndexes={crossword.spacesAfterIndexes}
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
            <Dialog.Root motionPreset="slide-in-bottom">
              <Dialog.Trigger asChild>
                <Button colorPalette="red">
                  Usuń ten projekt krzyżówki
                  <Icon>
                    <Trash2 />
                  </Icon>
                </Button>
              </Dialog.Trigger>
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>
                        Czy na pewno usunąć krzyżówkę {crossword.title}?
                      </Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                      <p>
                        Wszyskie dane tego projektu zostaną utracone, bez
                        możliwości odzyskania. Upewnij się, że ten projekt nie
                        jest Ci już potrzebny lub posiadasz kopię zapasową. Po
                        usunięciu zostaniesz przeniesiony na stronę główną
                        aplikacji Bursztyn.
                      </p>
                    </Dialog.Body>
                    <Dialog.Footer>
                      <Dialog.ActionTrigger asChild>
                        <Button variant="outline">Anuluj</Button>
                      </Dialog.ActionTrigger>
                      <Button
                        onClick={() => handleDeleteProject()}
                        colorPalette="red"
                      >
                        Usuń
                      </Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
          </Flex>
        </Flex>
      </VStack>
    </Flex>
  );
};