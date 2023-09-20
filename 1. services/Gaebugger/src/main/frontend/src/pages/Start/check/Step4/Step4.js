import React from 'react';
import Header from "../../../../components/header/header";
import '../compactContainer.css';
import './Step4.css';
import InspectionSteps from "../InspectionSteps";
import axios from "axios";
import {useEffect, useState} from "react";

function Step4({ processId }) {
    const [serverData, setServerData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/check-response/${processId}`);
                if (response.status === 200) {
                    setServerData(response.data);
                }
            } catch (error) {
                console.error("Error fetching processed data", error);
            }
        };

        fetchData();
    }, [processId]);

    if (!serverData) return null;

    const itemsArray = serverData.checkedItems;  // 수정된 부분

    return (
        <div className="compact-container">
            <Header />
            <div className="output-layout">
                <InspectionSteps active="fourth" />
                <div className="message-section">
                    <p>Message</p>
                    <div>{serverData.message}</div>
                </div>
                <div className="checked_Items-section">
                    <p>Checked Items:</p>
                    <ul>
                        {itemsArray && itemsArray.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                </div>
                <div className="FileContent-section">
                    <p>File Content:</p>
                    <pre>{serverData.fileContent}</pre>
                </div>
                <div className="GuideLines-section">
                    <p>Guidelines:</p>
                    <pre>{serverData.ans}</pre>
                </div>
            </div>
        </div>
    );

}

export default Step4;
