'use client';

import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { type Crossword } from '@/types/crossword';
import {
  Flex,
  VStack,
  Icon,
  Portal,
  Select,
  createListCollection,
  Text,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { Download, Play, Printer, Settings } from 'lucide-react';

// utils
import { updateCrosswordLocalStorage } from '@/lib/pages/editor/utils/updateCrosswordLocalStorage';

// hooks
import { useColorMode } from '@/components/ui/color-mode';
import { useCrossword } from '@/lib/pages/editor/hooks/useCrossword';
import { useAnswers } from '@/lib/pages/editor/hooks/useAnswers';

// components
import { EditorHeader } from '@/lib/pages/editor/components/editorHeader';
import { QuestionItem } from '@/lib/pages/editor/components/questionItem';
import { AnswerActions } from '@/lib/pages/editor/components/answerActions';
import { Visualization } from '@/lib/pages/editor/components/visualization';
import { DeleteProjectDialog } from '@/lib/pages/editor/components/deleteProjectDialog';
import { DisplaySettings } from '@/lib/pages/editor/components/displaySettings';
import { SizeSettings } from '@/lib/pages/editor/components/sizeSettings';
import { ColorSettings } from '@/lib/pages/editor/components/colorSettings';
import { ProjectSettings } from '@/lib/pages/editor/components/projectSettings';
import { Tooltip } from '@/components/ui/tooltip';

// libs
import * as htmlToImage from 'html-to-image';

interface EditorProps {
  params: Promise<{ id: string }>;
}

export const Editor = ({ params }: EditorProps) => {
  const router = useRouter();
  const { toggleColorMode, colorMode } = useColorMode();
  const { id } = use(params);

  const { crossword, updateCrossword } = useCrossword(id);
  const {
    lastSpaceAdded,
    updateAnswer,
    addAnswer,
    deleteAnswer,
    addSpace,
    removeLastSpace,
  } = useAnswers(crossword, updateCrossword);

  const [imgFormat, setImgFormat] = useState(['png']);

  const formats = createListCollection({
    items: [
      { label: 'PNG', value: 'png' },
      { label: 'JPEG', value: 'jpeg' },
      { label: 'SVG', value: 'svg' },
    ],
  });

  const handleShift = (index: number, amount: number) => {
    if (!crossword) return;

    const currentAnswer = crossword.answers[index];
    if (!currentAnswer?.word) return;

    const solutionLetter = crossword.solution[index]?.toUpperCase();
    if (!solutionLetter) return;

    const positions = currentAnswer.word
      .split('')
      .map((l, i) => (l.toUpperCase() === solutionLetter ? i : -1))
      .filter(i => i !== -1);

    if (positions.length <= 1) return;

    const maxShift = positions.length - 1;
    const currentShift = currentAnswer.shift || 0;
    let newShift = currentShift + amount;

    if (newShift > maxShift) newShift = 0;
    if (newShift < 0) newShift = maxShift;

    updateAnswer(index, { shift: newShift });
  };

  const handleDownload = async () => {
    const node = document.getElementById('crossword-canvas');
    if (!node || !crossword) return;

    const clone = node.cloneNode(true) as HTMLElement;
    const originalDisplay = node.style.display;

    Object.assign(clone.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      overflow: 'visible',
      width: 'auto',
      height: 'auto',
      maxWidth: 'none',
      maxHeight: 'none',
      minWidth: 'none',
      minHeight: 'none',
      zIndex: '9999',
      visibility: 'visible',
      opacity: '1',
    });

    node.style.display = 'none';
    document.body.appendChild(clone);

    const format = imgFormat[0];
    const isJpeg = format === 'jpeg';

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const options = {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: isJpeg
          ? colorMode === 'dark'
            ? '000000'
            : 'ffffff'
          : undefined,
        quality: 1,
        useCORS: true,
        style: { transform: 'none', overflow: 'visible' },
      };

      const dataUrl =
        format === 'png'
          ? await htmlToImage.toPng(clone, options)
          : format === 'jpeg'
            ? await htmlToImage.toJpeg(clone, options)
            : format === 'svg'
              ? await htmlToImage.toSvg(clone, options)
              : await htmlToImage.toPng(clone, options);

      const link = document.createElement('a');
      link.download = `${crossword.title || 'crossword'}.${format}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Błąd podczas renderowania obrazu:', err);
      alert('Wystąpił błąd podczas generowania obrazu. Spróbuj ponownie.');
    } finally {
      node.style.display = originalDisplay;
      if (document.body.contains(clone)) document.body.removeChild(clone);
    }
  };

  const handlePrint = () => {
    const crosswordElement = document.getElementById('crossword-canvas');
    if (!crosswordElement || !crossword) return;

    const titleElement = crosswordElement.querySelector(
      '#crossword-title-canvas',
    );
    titleElement?.remove();

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('Proszę zezwolić na wyskakujące okna dla tej strony');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Krzyżówka - ${crossword.title}</title>
          <style>
            body { 
              margin: 0; padding: 20px;
              font-family: Arial, sans-serif;
              display: flex; flex-direction: column;
              align-items: center; justify-content: center;
              min-height: 100vh;
            }
            .crossword-container { margin: 20px 0; }
            .crossword-title {
              font-size: 24px; font-weight: bold;
              margin-bottom: 20px; text-align: center;
            }
            @media print {
              body { margin: 0; padding: 10px; }
              .crossword-container { 
                page-break-inside: avoid; break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="crossword-title">${crossword.title}</div>
          <div class="crossword-container">${crosswordElement.innerHTML}</div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    };
  };

  const handleDeleteProject = () => {
    if (!crossword) return;

    const crosswordsLC = localStorage.getItem('crosswords');
    if (!crosswordsLC) return;

    const parsed: Crossword[] = JSON.parse(crosswordsLC);
    const filtered = parsed.filter(cw => cw.id !== crossword.id);
    localStorage.setItem('crosswords', JSON.stringify(filtered));
    router.replace('/');
  };

  useEffect(() => {
    if (!crossword) return;
    updateCrosswordLocalStorage({ ...crossword, lastModifiedAt: new Date() });
  }, [crossword]);

  if (!crossword) {
    return (
      <Flex justifyContent="center" alignItems="center" w="100vw" minH="100vh">
        <Flex justifyContent="center" alignItems="center" gap={4} h={16}>
          <Spinner />
          <Text>Ładowanie krzyżówki...</Text>
        </Flex>
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
        <EditorHeader
          onHomeClick={() => router.replace('/')}
          onToggleColorMode={toggleColorMode}
        />

        <ProjectSettings crossword={crossword} onUpdate={updateCrossword} />

        {crossword.answers.map((_, index) => (
          <QuestionItem
            key={index}
            crossword={crossword}
            index={index}
            onUpdate={updateAnswer}
            onDelete={deleteAnswer}
            onShift={handleShift}
          />
        ))}

        <AnswerActions
          crossword={crossword}
          lastSpaceAdded={lastSpaceAdded}
          onAddAnswer={addAnswer}
          onAddSpace={addSpace}
          onRemoveSpace={removeLastSpace}
        />
      </VStack>

      <VStack minW={1000}>
        <Visualization crossword={crossword} />

        <Flex gap={6}>
          <ColorSettings crossword={crossword} onUpdate={updateCrossword} />
          <SizeSettings crossword={crossword} onUpdate={updateCrossword} />

          <Flex direction="column" gap={4} mt={7}>
            <DisplaySettings crossword={crossword} onUpdate={updateCrossword} />

            <Flex gap={4}>
              <Button onClick={handleDownload} colorPalette="teal">
                Pobierz
                <Icon>
                  <Download />
                </Icon>
              </Button>
              <Select.Root
                defaultValue={['png']}
                collection={formats}
                size="sm"
                width={20}
                onValueChange={e => setImgFormat(e.value)}
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
                      {formats.items.map(format => (
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

            <Button onClick={handlePrint} colorPalette="blue">
              Drukuj
              <Icon>
                <Printer />
              </Icon>
            </Button>

            {process.env.NEXT_PUBLIC_IS_DEV && (
              <>
                <Button disabled onClick={handlePrint} colorPalette="gray">
                  Ustawienia dostępu
                  <Icon>
                    <Settings />
                  </Icon>
                </Button>

                <Button
                  disabled={true}
                  onClick={handlePrint}
                  colorPalette="green"
                >
                  Rozwiąż krzyżówkę
                  <Icon>
                    <Play />
                  </Icon>
                </Button>
              </>
            )}

            <DeleteProjectDialog
              crossword={crossword}
              onDelete={handleDeleteProject}
            />
          </Flex>
        </Flex>
      </VStack>
    </Flex>
  );
};
