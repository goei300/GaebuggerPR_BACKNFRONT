import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InspectionSteps from "./InspectionSteps";
import Header from "../../header";
import './compactContainer.css';
function Step3(props){
    /* 여기는 점검 끝날때 까지 대기하는 단계임 */

    return(
        <div className="compact-container">
            <Header />
            <div className="Validating-layout">
                <InspectionSteps active="third" />

                <div className="processing-animation">
                    진행 중!!
                </div>

            </div>
        </div>
    );
}

export default Step3;