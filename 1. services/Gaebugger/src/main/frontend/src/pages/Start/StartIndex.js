import React from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/Footer';
import './StartIndex.css';
import CheckEvaluate from './check/CheckEvaluate';
function StartIndex() {
    return (
        <div className='startIndex-container'>
            <Header active="start"/>
            <main className='startIndex-content'>
                <p> hihi </p> // margin, padding 조절 필요
                <button></button>
            </main>
            <Footer />
        </div>  
    );
}

export default StartIndex;
