import React, { useState } from "react";
import Step1 from "./Step1/Step1";
import Step2 from "./Step2/Step2";
import Step3 from './Step3/Step3';
import Step4 from './Step4/Step4';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import './transitionStyles.css';

function CheckEvaluate() {
    const [step, setStep] = useState(1);
    const [slideDirection, setSlideDirection] = useState('left');
    const [checkedItems, setCheckedItems] = useState([]);
    const [processId, setProcessId] = useState(null);

    const nextStep = () => {
        setSlideDirection('right');
        setStep(prevStep => prevStep + 1);
    }

    const prevStep = () => {
        setSlideDirection('left');
        setStep(prevStep => prevStep - 1);
    }

    let currentStep;
    switch (step) {
        case 1:
            currentStep = <Step1 nextStep={nextStep} setCheckedItems={setCheckedItems} />;
            break;
        case 2:
            currentStep = (
                <Step2
                    nextStep={nextStep}
                    prevStep={prevStep}
                    setProcessId={setProcessId} // Step2에서 processId를 설정하기 위한 함수를 prop으로 전달
                    checkedItems={checkedItems}
                />
            );
            break;
        case 3:
            currentStep = (
                <Step3
                    nextStep={nextStep}
                    processId={processId} // processId를 Step3로 전달
                />
            );
            break;
        case 4:
            currentStep = <Step4 processId={processId} />;
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
