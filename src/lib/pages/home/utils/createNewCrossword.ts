// imports
import { Crossword } from "@/types/crossword";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { FaSlideshare } from "react-icons/fa";

const createNewCrossword = (router: AppRouterInstance) => {
  const id = crypto.randomUUID();
  if (!localStorage.getItem("crosswords")) {
    localStorage.setItem("crosswords", JSON.stringify([]));
  }

  const crosswords: Crossword[] = JSON.parse(
    localStorage.getItem("crosswords")!
  );
  
  crosswords.push({
    id,
    title: "Nowa krzyżówka",
    createdAt: new Date(),
    answers: [],
    answersBackgroundColor: "#FFFFFF",
    answersBorderColor: "#000000",
    answersBorderThickness: 2,
    shouldShowIndexes: true,
    solution: "",
    solutionBorderColor: "#000000",
    solutionBorderThickness: 5,
    solutionsBackgroundColor: "#FFFFFF",
    lastModifiedAt: new Date(),
    shouldShowAnswers: true,
    shouldShowQuestions: false,
    size: 15,
    spacesAfterIndexes: []
  });
  localStorage.setItem("crosswords", JSON.stringify(crosswords));
  router.replace(`/${id}`);
};

export default createNewCrossword;
