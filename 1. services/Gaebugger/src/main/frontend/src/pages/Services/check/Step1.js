import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../../header";
import InspectionSteps from "./InspectionSteps";
import './Step1.css';
import './compactContainer.css';
import Service from "../Service";

function Step1(props) {
    const navigate = useNavigate();
    const [checkedItems, setCheckedItems] = useState([]);

    const handleCheckboxChange = (event, item) => {
        if (event.target.checked) {
            setCheckedItems(prevItems => [...prevItems, item]);
        } else {
            setCheckedItems(prevItems => prevItems.filter(i => i !== item));
        }
    };

    const handleNext = /*async*/ () => {
/*        try {
            const response = await axios.post("http://localhost:8080/api/checklist/submit", checkedItems); // Assuming Spring runs on port 8080

            // If data was sent successfully, navigate to the next step
            if (response.status === 200) {
                navigate('/services/check/step2');
            } else {
                console.warn("Data sent, but received unexpected status:", response.status);
            }
        } catch (error) {
            console.error("Error sending data", error);
        }*/
        props.nextStep();  // 여기에 nextStep 함수를 호출
    };

    return (
        <div className="compact-container">
            <Header />
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
