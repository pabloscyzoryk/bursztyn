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

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      padding={4}
      w="auto"
      h="auto"
      flex="1"
      gap={6}
    >
      {shouldShowQuestions && (
        <List.Root
          minW="300px" 
          ml={6}
          as="ol"
          h="100%"
          overflowY="auto"
          flexShrink={0}
        >
          {answers.map((answer, index) => (
            <Text as="li" key={index} maxW="300px" mb={1} lineHeight="1.2"> 
              {answer.question}
            </Text>
          ))}
        </List.Root>
      )}
      <Flex w="auto" h='auto' justifyContent="center" gap={4} flexShrink={0}>
        <table
          style={{
            borderCollapse: "collapse",
            marginTop: shouldShowQuestions ? "10px" : "0px",
          }}
        >
          <tbody>
            {finalArr.map((answer, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: maxLeftLength - answer.left.length }).map(
                  (_, index) => (
                    <td key={`empty-left-${index}`} style={cellStyle} />
                  )
                )}

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

                {answer.left.map((leftLetter, index) => (
                  <td key={`left-${index}`} style={answerCellStyle}>
                    {shouldShowAnswers ? leftLetter : ""}
                  </td>
                ))}

                <td style={solutionCellStyle}>
                  {shouldShowAnswers ? answer.solutionLetter : ""}
                </td>

                {answer.right.map((rightLetter, index) => (
                  <td key={`right-${index}`} style={answerCellStyle}>
                    {shouldShowAnswers ? rightLetter : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Flex>
    </Flex>
  );
};