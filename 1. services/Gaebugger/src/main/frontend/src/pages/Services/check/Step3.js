import React, { useState,useEffect } from 'react';
import InspectionSteps from "./InspectionSteps";
import Header from "../../header";
import './compactContainer.css';
import './Step3.css';
import axios from "axios";


function Step3({ nextStep, setServerData }){
    /* 여기는 점검 끝날때 까지 대기하는 단계임 */
    const [isLoading, setIsLoading] = useState(true);
    const [serverResponseReceived, setServerResponseReceived] = useState(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/check-response");

                if (response.status === 200) {
                    setServerData(response.data);  // 이 부분 추가
                    console.log(response.data);
                    nextStep();
                    clearInterval(interval);
                }
            } catch (error) {
                console.error("Error while polling for server response", error);
            }
        }, 5000); // 5초마다 확인합니다.

        return () => clearInterval(interval); // 컴포넌트가 unmount될 때 interval을 정리합니다.
    }, []);
    return(
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