import React, { useState } from 'react';
import Header from "../../../../components/header/header";
import Footer from "../../../../components/footer/Footer";
import InspectionSteps from "../InspectionSteps";
import './Step1.css';
import '../compactContainer.css';

function Step1({ nextStep, setCheckedItems}) {
    const [localCheckedItems, setLocalCheckedItems] = useState([]);
    console.log("hihi");
    const handleCheckboxChange = (event, item) => {
        if (event.target.checked) {
            setLocalCheckedItems(prevItems => [...prevItems, item]);
        } else {
            setLocalCheckedItems(prevItems => prevItems.filter(i => i !== item));
        }
    };


    const handleNext = () => {
        setCheckedItems(localCheckedItems);
        nextStep();
    };

    return (
            <div className="compact-container">
                <div className="inspection-layout">
                    <InspectionSteps active="first" />

                    <div className="priority-items">
                        <h2>Priority Items</h2>
                        {Array.from({ length: 50 }).map((_, index) => (
                            <label key={index}>
                                <input type="checkbox" onChange={(e) => handleCheckboxChange(e, `Item ${index + 1}`)} />
                                Item {index + 1}
                            </label>
                        ))}
                    </div>
                </div>

                <button onClick={handleNext} className="next-button">
                    기재사항 제출
                </button>

            </div>
    );

}

export default Step1;
