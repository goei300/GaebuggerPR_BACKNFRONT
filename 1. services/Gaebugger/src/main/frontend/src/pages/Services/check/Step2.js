import React, { useState } from "react";
import axios from 'axios';
import Header from "../../header";
import InspectionSteps from "./InspectionSteps";
import './Step2.css';
import './compactContainer.css';

function Step2({ nextStep, prevStep, setProcessId, checkedItems }) { // onProcessIdReceived prop 추가
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleNext = async () => {
        const formData = new FormData();
        formData.append('checkedItems', JSON.stringify(checkedItems));
        formData.append('uploadedFile', file);

        try {
            const response = await axios.post("http://localhost:8080/api/checklist/submit", formData);
            if (response.data && response.data.processId) {
                setProcessId(response.data.processId);
                console.log(response.data.processId);
                nextStep();
            } else {
                console.error("No processId received from server");
            }
        } catch (error) {
            console.error("Error sending data", error);
        }
    };


    return (
        <div className="compact-container">
            <Header />
            <div className="FileUpload-layout">
                <InspectionSteps active="second" />

                <div className="file-upload-section">
                    <div className="file-upload">
                        <h2>개인정보 처리방침 문서 파일 업로드를 하세요! 테스트입니다!</h2>
                        <h3>파일 형식: .txt만 가능 (0.9v)</h3>
                        <input type="file" onChange={handleFileChange} />
                    </div>
                </div>

                <button onClick={prevStep} className="prev-button">
                    이전 단계
                </button>

                <button onClick={handleNext} className="next-button" disabled={!file}>
                    점검 시작
                </button>
            </div>
        </div>
);
}

export default Step2;
