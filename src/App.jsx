import React from "react"
import IntroPage from "./components/IntroPage"
import QuestionsPage from "./components/QuestionsPage"
import Loading from "./components/LoadingPage"
import {nanoid} from "nanoid"
import {shuffle} from "./utils"
import parse from 'html-react-parser'


export default function App(){
    const [started, setStarted] = React.useState(false)
    const [ended, setEnded]= React.useState(false)
    const [questions, setQuestions] = React.useState([])
    const [isLoading, setIsLoading]= React.useState(false)
    const [endless, setEndless] = React.useState(false)
    const [endlessQuestionBank, setEndlessQuestionBank] = React.useState([])
    
    React.useEffect(()=>{
        getQuestions()
    },[])
    function processQuestons(questions){
        return (
            questions.map(question => ({
             id:nanoid(),
             ...question,
             question:parse(question.question),
             answers:shuffle([
                    ...(question.incorrect_answers.map(answer => (
                        {id:nanoid(),
                        correct:false,
                        text:parse(answer)}
                    ))),
                    {id:nanoid() ,correct:true,text:parse(question.correct_answer)}
                ])
            })
            )
        )
    }
    async function getQuestions(amount = 5){
        setIsLoading(true)
        const res = await fetch(`https://opentdb.com/api.php?amount=${amount}&type=multiple`)
        const data = await res.json()
        const processedQuestions = processQuestons(data.results)
        setQuestions(processedQuestions)
        if (amount === 50) setEndlessQuestionBank(processedQuestions)
        setIsLoading(false)
    }

    function startGame(isEndless){
        setEndless(isEndless)
        setStarted(true)
        getQuestions(isEndless ? 50 : 5)
    }

    function nextEndlessQuestion(){
        const choices = endlessQuestionBank.filter(question => question.id !== questions[0]?.id)
        const nextQuestion = choices[Math.floor(Math.random() * choices.length)]
        setQuestions([nextQuestion])
    }
        
    async function restart(){
        getQuestions(endless ? 50 : 5)
        setEnded(false)
    }
 
    const page = 
                started ? 
                    isLoading?
                        <Loading/>:
                        <QuestionsPage 
                            questions={questions}
                            restart={restart}
                            endless={endless}
                            nextEndlessQuestion={nextEndlessQuestion}
                            ended={ended}
                            end={()=> setEnded(true)} /> :
                    <IntroPage start={startGame} />
    
    return page
}
