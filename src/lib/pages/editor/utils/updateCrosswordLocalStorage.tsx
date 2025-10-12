// imports
import { Answer, Crossword } from "@/types/crossword";
import isCrosswordCorrect from "@/lib/pages/editor/utils/isCrosswordCorrect";

export type CrosswordToSave = {
    id:string,
    title: string,
    solution: string,
    answers: Answer[],
    lastModifiedAt: Date,
    shouldShowIndexes: boolean,
    shouldShowAnswers: boolean,
    shouldShowQuestions: boolean,
    answersBorderColor: string,
    solutionBorderColor: string,
    size: number,
    answersBorderThickness: number,
    solutionBorderThickness: number,
    answersBackgroundColor: string,
    solutionsBackgroundColor: string,
}

const updateCrosswordLocalStorage = (crossword: CrosswordToSave) => {
    if(isCrosswordCorrect(crossword)) {
        const crosswords = localStorage.getItem("crosswords");
        if (!crosswords) {
            return;
        }
        
        try {
            let crosswordsArr;
            if (typeof crosswords === 'string') {
                crosswordsArr = JSON.parse(crosswords);
            } else {
                crosswordsArr = crosswords;
            }
            
            const index = crosswordsArr.findIndex((cw: Crossword) => cw.id === crossword.id);
            
            if (index === -1) {
                console.warn("Crossword not found in localStorage");
                return;
            }
            
            crosswordsArr[index] = crossword;
            localStorage.setItem("crosswords", JSON.stringify(crosswordsArr));
        } catch (error) {
            console.error("Error processing crosswords from localStorage:", error);
        }
    }
};

export default updateCrosswordLocalStorage;