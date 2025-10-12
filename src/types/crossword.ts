export type Answer = {
    word: string,
    question: string,
    shift: number,
}

export type Crossword = {
    id:string,
    title: string,
    solution: string,
    answers: Answer[],
    lastModifiedAt: Date,
    createdAt: Date,
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