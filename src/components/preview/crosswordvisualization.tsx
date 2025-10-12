import { Answer } from "@/types/crossword";
import { Flex, List } from "@chakra-ui/react";

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
    const wordLetters = answer.word.split("");
    const solutionLetter = solution[i];

    const matchingIndexes = wordLetters
      .map((letter, index) => (letter === solutionLetter ? index : -1))
      .filter((index) => index !== -1);

    const selectedIndex = matchingIndexes[answer.shift];

    return {
      left: wordLetters.slice(0, selectedIndex),
      right: wordLetters.slice(selectedIndex + 1),
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
      justifyContent="flex-start"
      alignItems="flex-start"
      minW="700px"
      maxW="1000px"
      padding={4}
      w="auto"
      h="440px"
      maxH="440px"
      minH="440px"
      overflowX="auto"
      overflowY="auto"
      flex="1"
      gap={6}
      css={{
        "&::-webkit-scrollbar": {
          height: "8px",
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#c1c1c1",
          borderRadius: "4px",
        },
      }}
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

                <td style={solutionCellStyle}>{shouldShowAnswers ? answer.solutionLetter : ""}</td>

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
