// CheckEvaluate.js
import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from './Step3';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import './transitionStyles.css';

function CheckEvaluate() {
    const [step, setStep] = useState(1);
    const [slideDirection, setSlideDirection] = useState('left');

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
            currentStep = <Step1 nextStep={nextStep} />;
            break;
        case 2:
            currentStep = <Step2 nextStep={nextStep} prevStep={prevStep} />;
            break;
        case 3:
            currentStep = <Step3 nextStep={nextStep} prevStep={prevStep} />;
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
