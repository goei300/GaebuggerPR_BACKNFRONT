import React, { useState, useEffect } from 'react';
import InspectionSteps from "./InspectionSteps";
import Header from "../../header";
import './compactContainer.css';
import './Step3.css';
import axios from "axios";

function Step3({ nextStep, setServerData, processId }) { // processId prop 추가
    const [isLoading, setIsLoading] = useState(true);
    const [serverResponseReceived, setServerResponseReceived] = useState(false);

    useEffect(() => {
        let isRequestPending = false;

        const checkResponse = async () => {
            if(isRequestPending) return;

            try {
                isRequestPending = true;
                // UUID를 엔드포인트에 포함
                const response = await axios.get(`http://localhost:8080/api/check-response/${processId}`);

                if (response.status === 200) {
                    setServerData(response.data);
                    nextStep();
                } else {
                    setTimeout(checkResponse, 5000);
                }
            } catch (error) {
                console.error("Error while polling for server response", error);
                setTimeout(checkResponse, 5000);
            } finally {
                isRequestPending = false;
            }
        };

        checkResponse();

    }, [processId]); // processId를 의존성 배열에 추가

    return (
        <div className="compact-container">
            <Header />
            <div className="Validating-layout">
                <InspectionSteps active="third" />
                <div className="processing-animation">
                    진행 중!!testtest
                </div>
            </div>
        </div>
    );
}

export default Step3;
