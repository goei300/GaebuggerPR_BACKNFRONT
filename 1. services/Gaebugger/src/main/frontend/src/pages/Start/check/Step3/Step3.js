import React, { useEffect } from 'react';
import InspectionSteps from "../InspectionSteps";
import Header from "../../../../components/header/header";
import '../compactContainer.css';
import './Step3.css';
import axios from "axios";

function Step3({ nextStep, processId }) {
    useEffect(() => {
        const checkResponseStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/check-response/${processId}`);

                if (response.status === 200) {
                    nextStep();
                    return; // 처리가 완료되면 더 이상 요청을 보내지 않습니다.
                }

                // 상태 코드가 200이 아닐 경우, 5초 후에 다시 상태 확인 요청을 보냅니다.
                setTimeout(checkResponseStatus, 5000);
            } catch (error) {
                console.error("Error checking processing status", error);
                // 에러 발생 시, 5초 후에 다시 상태 확인 요청을 보냅니다.
                setTimeout(checkResponseStatus, 5000);
            }
        };

        checkResponseStatus(); // 처음 컴포넌트가 마운트될 때 요청 시작

        // 컴포넌트가 언마운트될 때 혹시 남아있는 setTimeout을 클리어합니다.
        return () => {
            clearTimeout(checkResponseStatus);
        };
    }, [processId, nextStep]);

    return (
        <div className="compact-container">
            <div className="Validating-layout">
                <InspectionSteps active="third" />
                <div className="processing-animation">
                    <p>{processId}</p>
                    진행 중!!testtest 이것도 테스트44
                </div>
            </div>
        </div>
    );
}

export default Step3;
