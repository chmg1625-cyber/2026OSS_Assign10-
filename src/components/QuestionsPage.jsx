import React from "react"
import Question from "./Question"
import clsx from 'clsx';
import Confetti from "react-confetti";

export default function QuestionsPage(props){
    const [endlessScore, setEndlessScore] = React.useState(0)
    const [endlessPending, setEndlessPending] = React.useState(false)
    const currentQuestionId = props.questions[0]?.id

    React.useEffect(() => {
        setEndlessPending(false)
    }, [currentQuestionId])
    
    const [questionsCorrectness, setQuestionsCorrectness] = 
        React.useState(props.questions.map(
            question=>({id:question.id,correct:false})
        ))
    
    function changeCorrects(correct,id){
        setQuestionsCorrectness(prevCorrects => {
                return prevCorrects.map(
                    isCorrect => (
                        isCorrect.id===id?{...isCorrect,correct:correct}:isCorrect
                    )
                )
            }
        )
    }
    const visibleQuestions = props.endless ? props.questions.slice(0, 1) : props.questions
    const questionElements = visibleQuestions.map(
        question => (<Question
            key= {question.id}
            id={question.id}
            question={question.question}
            answers={question.answers}
            disabled={props.ended || endlessPending}
            endless={props.endless}
            onEndlessAnswer={handleEndlessAnswer}
            setCorrect={(correct)=>changeCorrects(correct,question.id)}
            />)
        )
    
    
    function calculateResults(){
        const corrects = questionsCorrectness.filter(q => q.correct).length
        return corrects?corrects:0
    }

    function handleEndlessAnswer(correct){
        if (!correct) {
            props.end()
            return
        }
        setEndlessPending(true)
        setEndlessScore(score => score + 1)
        props.nextEndlessQuestion()
    }

    function handleRestart(){
        setEndlessScore(0)
        props.restart()
    }
    
    
    const style = clsx("questions", props.ended&&"questions--ended")
    console.log(style)
    return (
        <main className={style}>
            {props.ended && calculateResults()==props.questions.length && <Confetti width={window.innerWidth} height={window.innerHeight}/>}
            <img className="questions--blob--1" src="../images/blob3.svg"/>
            <img className="questions--blob--2" src="../images/blob4.svg"/>
            <div className="question--container">
            {questionElements}
            </div>
            {props.endless ? (
                <div className="questions--score--container">
                    <h3 className="questions--score">
                        {props.ended ? `게임 종료! ${endlessScore}개 정답` : `정답 수: ${endlessScore}`}
                    </h3>
                    {props.ended && <button className="questions--play--again" onClick={handleRestart}>다시하기</button>}
                </div>
            ) : props.ended?
                (<div className="questions--score--container">
                    <h3 className="questions--score">{` ${calculateResults()}/${props.questions.length} 개 정답!`}</h3>
                    <button className="questions--play--again" onClick={props.restart}>다시하기</button>
                </div>):
                (<button className="questions--check--answers" onClick={()=>props.end(true)}>정답 확인하기</button>)}
        </main>
    )
}
