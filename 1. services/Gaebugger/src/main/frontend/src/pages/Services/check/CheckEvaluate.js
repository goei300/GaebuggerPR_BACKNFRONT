// CheckEvaluate.js
import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from './Step3';
import Step4 from './Step4';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import './transitionStyles.css';

function CheckEvaluate() {
    const [step, setStep] = useState(1);
    const [slideDirection, setSlideDirection] = useState('left');
    const [checkedItems, setCheckedItems] = useState([]);
    const [serverData, setServerData] = useState(null);
    const [processId, setProcessId] = useState(null); // processId 상태 추가

    const nextStep = () => {
        setSlideDirection('right');
        setStep(prevStep => prevStep + 1);
    }

    const prevStep = () => {
        setSlideDirection('left');
        setStep(prevStep => prevStep - 1);
    }

    // 서버로부터 processId를 설정하는 함수
    const handleProcessIdReceived = (id) => {
        setProcessId(id);
    }

    let currentStep;
    switch (step) {
        case 1:
            currentStep = <Step1 nextStep={nextStep} setCheckedItems={setCheckedItems}  />;
            break;
        case 2:
            // Step2 컴포넌트에 processId 설정 함수를 prop으로 전달
            currentStep = <Step2 nextStep={nextStep} prevStep={prevStep} checkedItems={checkedItems} onProcessIdReceived={handleProcessIdReceived} />;
            break;
        case 3:
            // Step3 컴포넌트에 processId를 prop으로 전달
            currentStep = <Step3 nextStep={nextStep} setServerData={setServerData} processId={processId} />;
            break;
        case 4:
            currentStep = <Step4 serverData={serverData} />;
            break;
        default:
            break;
    }

    return (
        <div className="jiji">
            <TransitionGroup>
                <CSSTransition key={step} timeout={500} classNames={`slide-${slideDirection}`}>
                    {currentStep}
                </CSSTransition>
            </TransitionGroup>
        </div>
    );
}

export default CheckEvaluate;


