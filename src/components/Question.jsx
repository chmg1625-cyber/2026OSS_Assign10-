import React from "react"
import Answer from "./Answer"

export default function Question(props){
    const [selectedAnswer,setSelectedAnswer]=React.useState({id:0,correct:false})
    
    React.useEffect(()=>{props.setCorrect(selectedAnswer.correct)},[selectedAnswer])
    function changeAnswer(selectedId){
        if (props.disabled) return
        if(selectedAnswer.id === selectedId){
            setSelectedAnswer({id:0,correct:false})
            return
        }
        const answer = props.answers.find(({id})=>id===selectedId)
        setSelectedAnswer(answer)
        if (props.endless) props.onEndlessAnswer(answer.correct)
    }
    
    const answerElements = props.answers.map(answer => 
        <Answer 
        key={answer.id}
        disabled={props.disabled}  
        answer={answer.text} 
        selected={answer.id===selectedAnswer.id}
        setSelectedAnswer={()=>changeAnswer(answer.id)} 
        isCorrect={answer.correct}/>
    )
    return (
        <div  className="question" >
            <h2 className="question--title">{props.question}</h2>
            <div className="answer--container">
                {answerElements}
            </div>
            <hr className="question--line"/>
        </div>
    )
}
