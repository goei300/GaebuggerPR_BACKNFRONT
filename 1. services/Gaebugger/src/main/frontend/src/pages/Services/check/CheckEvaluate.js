import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import './transitionStyles.css';  // 이 부분을 추가합니다.

function CheckEvaluate() {
    const [step, setStep] = useState(1);

    const nextStep = () => setStep(prevStep => prevStep + 1);
    const prevStep = () => setStep(prevStep => prevStep - 1);

    let currentStep;

    switch (step) {
        case 1:
            currentStep = <Step1 nextStep={nextStep} />;
            break;
        case 2:
            currentStep = <Step2 previousStep={prevStep} />;
            break;
        default:
            currentStep = <Step1 nextStep={nextStep} />;
    }

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
