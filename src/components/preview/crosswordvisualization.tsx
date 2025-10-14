import { Answer } from "@/types/crossword";
import { Flex, List, Text } from "@chakra-ui/react";

interface CrosswordVisualizationProps {
  solution: string;
  answers: Answer[];
  answersBackgroundColor: string;
  answersBorderColor: string;
  answersBorderThickness: number;
  shouldShowIndexes: boolean;
  solutionBorderColor: string;
  solutionBorderThickness: number;
  solutionsBackgroundColor: string;
  shouldShowAnswers: boolean;
  shouldShowQuestions: boolean;
  size: number;
  spacesAfterIndexes: number[];
}

export const CrosswordVisualization = ({
  solution,
  answers,
  answersBackgroundColor,
  answersBorderColor,
  answersBorderThickness,
  shouldShowIndexes,
  solutionBorderColor,
  solutionBorderThickness,
  solutionsBackgroundColor,
  shouldShowAnswers,
  shouldShowQuestions,
  size,
  spacesAfterIndexes,
}: CrosswordVisualizationProps) => {
  const finalArr = answers.map((answer, i) => {
    const wordLetters = (answer.word || "").split("");
    const solutionLetter = solution[i] ?? "";

    const matchingIndexes = wordLetters
      .map((letter, index) =>
        letter.toUpperCase() === (solutionLetter || "").toUpperCase()
          ? index
          : -1
      )
      .filter((index) => index !== -1);

    const safeShift =
      typeof answer.shift === "number" && answer.shift >= 0 ? answer.shift : 0;
    const selectedIndex =
      matchingIndexes.length > 0
        ? matchingIndexes[Math.min(safeShift, matchingIndexes.length - 1)]
        : -1;

    return {
      left:
        selectedIndex === -1
          ? wordLetters
          : wordLetters.slice(0, selectedIndex),
      right: selectedIndex === -1 ? [] : wordLetters.slice(selectedIndex + 1),
      solutionLetter,
      question: answer.question,
      wordArr: wordLetters,
      selectedIndex,
    };
  });

  const maxLeftLength = Math.max(
    ...finalArr.map((answer) => answer.left.length)
  );
  const maxRightLength = Math.max(
    ...finalArr.map((answer) => answer.right.length)
  );

  const fontSize = size * 0.7;

  const cellStyle = {
    width: `${size}px`,
    height: `${size}px`,
    maxWidth: `${size}px`,
    maxHeight: `${size}px`,
    minWidth: `${size}px`,
    minHeight: `${size}px`,
    textAlign: "center" as const,
    padding: 0,
    margin: 0,
    lineHeight: 1,
  };

  const answerCellStyle = {
    ...cellStyle,
    border: `${answersBorderThickness}px solid ${answersBorderColor}`,
    backgroundColor: answersBackgroundColor,
    fontSize: `${fontSize}px`,
  };

  const solutionCellStyle = {
    ...cellStyle,
    border: `${solutionBorderThickness}px solid ${solutionBorderColor}`,
    backgroundColor: solutionsBackgroundColor,
    fontWeight: "bold" as const,
    fontSize: `${fontSize}px`,
  };

  // Oblicz całkowitą liczbę kolumn dla spójności
  const totalColumns = maxLeftLength + (shouldShowIndexes ? 1 : 0) + 1 + maxRightLength;

  return (
    <Flex
      justifyContent="flex-start"
      alignItems="flex-start"
      minW="700px"
      padding={4}
      w="auto"
      h="auto"
      minH="368px"
      gap={6}
    >
      {shouldShowQuestions && (
        <List.Root ml={6} as="ol" flexShrink={0}>
          {answers.map((answer, index) => (
            <List.Item key={index} maxW="300px">
              {answer.question}
            </List.Item>
          ))}
        </List.Root>
      )}
      <Flex w="100%" justifyContent="center" gap={4}>
        <table
          style={{
            borderCollapse: "collapse",
            marginTop: shouldShowQuestions ? "10px" : "0px",
          }}
        >
          <tbody>
            {finalArr.map((answer, rowIndex) => (
              <>
                <tr key={`row-${rowIndex}`}>
                  {/* Lewe puste komórki */}
                  {Array.from({ length: maxLeftLength - answer.left.length }).map(
                    (_, index) => (
                      <td key={`empty-left-${index}`} style={cellStyle} />
                    )
                  )}

                  {/* Komórka indeksu */}
                  {shouldShowIndexes && (
                    <td
                      style={{
                        ...cellStyle,
                        fontSize: `${fontSize * 0.8}px`,
                        fontWeight: "bold",
                      }}
                    >
                      {rowIndex + 1}.
                    </td>
                  )}
                  {/* Lewe litery */}
                  {answer.left.map((leftLetter, index) => (
                    <td key={`left-${index}`} style={answerCellStyle}>
                      {shouldShowAnswers ? leftLetter : ""}
                    </td>
                  ))}


                  {/* Komórka rozwiązania */}
                  <td style={solutionCellStyle}>
                    {shouldShowAnswers ? answer.solutionLetter : ""}
                  </td>

                  {/* Prawe litery */}
                  {answer.right.map((rightLetter, index) => (
                    <td key={`right-${index}`} style={answerCellStyle}>
                      {shouldShowAnswers ? rightLetter : ""}
                    </td>
                  ))}

                  {/* Prawe puste komórki */}
                  {Array.from({ length: maxRightLength - answer.right.length }).map(
                    (_, index) => (
                      <td key={`empty-right-${index}`} style={cellStyle} />
                    )
                  )}
                </tr>
                
                {/* Wiersz spacji - poprawiona wersja */}
                {spacesAfterIndexes?.includes(rowIndex) && (
                  <tr key={`space-${rowIndex}`}>
                    {/* Lewe puste komórki */}
                    {Array.from({ length: maxLeftLength }).map((_, index) => (
                      <td key={`space-left-${index}`} style={cellStyle} />
                    ))}
                    
                    {/* Pusta komórka indeksu jeśli needed */}
                    {shouldShowIndexes && (
                      <td style={cellStyle} />
                    )}
                    
                    {/* Komórka rozwiązania - PUSTA ale z zachowaniem stylu */}
                    <td style={solutionCellStyle}></td>
                    
                    {/* Prawe puste komórki */}
                    {Array.from({ length: maxRightLength }).map((_, index) => (
                      <td key={`space-right-${index}`} style={cellStyle} />
                    ))}
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </Flex>
    </Flex>
  );
};