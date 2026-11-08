import React from "react"
export default function IntroPage(props){
    return (
        <main className="intro">
            <img className="intro--blob--1" src="../images/blob1.svg"/>
            <img className="intro--blob--2" src="../images/blob2.svg"/>
            <h1 className="intro--title">전국퀴즈자랑</h1>
            <p className="intro--description">비상식을 찾아 떠나는 퀴즈 <a href="https://github.com/MmeK" target="_blank">by MmeK</a>!</p>
            <div className="intro--mode-buttons">
                <button className="intro--start" onClick={() => props.start(false)}>퀴즈 시작</button>
                <button className="intro--start intro--endless" onClick={() => props.start(true)}>무한 모드</button>
            </div>
        </main>
        )
}
