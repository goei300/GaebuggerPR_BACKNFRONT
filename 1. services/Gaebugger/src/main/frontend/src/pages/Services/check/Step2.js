import React, {useState} from "react";
import Header from "../../header";
import InspectionSteps from "./InspectionSteps";
import './Step2.css';
function Step2(props){

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

                <div className="next-button-container">
                    {/* Replace this with your actual next button and its function */}
                    <button>Next Step</button>
                </div>
            </div>
        </div>
    );
}

export default Step2;