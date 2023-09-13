import React from "react";
import Header from "../../header";
import './compactContainer.css';
import InspectionSteps from "./InspectionSteps";

function Step4({ serverData }) {
    console.log("this step is good");
    if(!serverData) return null;

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
                    {itemsArray && itemsArray.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
                <p>File Content:</p>
                <pre>{serverData.fileContent}</pre>
            </div>
        </div>
    );
}

export default Step4;
