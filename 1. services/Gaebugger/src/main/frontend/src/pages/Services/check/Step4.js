import React from "react";
import Header from "../../header";
import './compactContainer.css';
import InspectionSteps from "./InspectionSteps";

function Step4({ serverData }) {
    if(!serverData) {
        return (
            <div className="compact-container">
                <Header />
                <div className="output-layout">
                    <p>Error: No server data received.</p>
                </div>
            </div>
        );
    }

    const itemsArray = JSON.parse(serverData.checkedItems);
    return (
        <div className="compact-container">
            <Header />
            <div className="output-layout">
                <InspectionSteps active="fourth" />
                <p>안뇽</p>
                <p>Message: {serverData.message}</p>
                <p>Checked Items:</p>
                <ul>
                    {itemsArray && itemsArray.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <p>File Content:</p>
                <pre>{serverData.fileContent}</pre>
                <p>guidelines:</p>
                <pre>{serverData.ans}</pre>
            </div>
        </div>
    );
}

export default Step4;
