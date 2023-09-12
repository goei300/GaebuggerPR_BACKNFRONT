import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from './Step3';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import './transitionStyles.css';  // 이 부분을 추가합니다.

function CheckEvaluate() {
    const [step, setStep] = useState(1);

    const nextStep = () => setStep(prevStep => prevStep + 1);
    const prevStep = () => setStep(prevStep => prevStep - 1);

    const stepComponents = {
        1: <Step1 nextStep={nextStep} />,
        2: <Step2 nextStep={nextStep} />,
        3: <Step3 nextStep={nextStep} />
    };

    const currentStep = stepComponents[step];

    return (
        <div className="jiji">
            <TransitionGroup>
                <CSSTransition key={step} timeout={500} classNames="slide">
                    {currentStep}
                </CSSTransition>
            </TransitionGroup>
        </div>
    );
}

export default CheckEvaluate;
