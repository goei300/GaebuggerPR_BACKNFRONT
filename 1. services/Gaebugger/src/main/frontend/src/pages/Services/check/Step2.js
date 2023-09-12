import React, {useState} from "react";
import Header from "../../header";
import InspectionSteps from "./InspectionSteps";
import './Step2.css';
import './compactContainer.css';
import {useNavigate} from "react-router-dom";
function Step2({ nextStep, prevStep }){

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        // You can send 'file' to the server here
        // Using fetch, axios or any other method

        // Example:
        // const formData = new FormData();
        // formData.append('uploadedFile', file);
        // await axios.post('/upload-endpoint', formData);
    };

    const handleNext =  () => {


        /*          여기서는 파일 업로드 된거 하고 checklist 두개 다 보내려고함
                try {
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
        nextStep();  // 여기에 nextStep 함수를 호출
    };


    return (
            <div className="compact-container">
                <Header />
                <div className="FileUpload-layout">
                    <InspectionSteps active="second" />

                    <div className="file-upload-section">
                        <div className="file-upload">
                            <h2>개인정보 처리방침 문서 파일 업로드를 하세요!</h2>
                            <h3>파일 형식: .txt만 가능 (0.9v)</h3>
                            <input type="file" onChange={handleFileChange} />
                            <button onClick={handleSubmit}>Upload</button>
                        </div>
                    </div>

                    <button onClick={prevStep} className="prev-button">  // props 제거
                        이전 단계
                    </button>

                    <button onClick={handleNext} className="next-button">  // props 제거
                        점검 시작
                    </button>
                </div>
            </div>
    );
}

export default Step2;