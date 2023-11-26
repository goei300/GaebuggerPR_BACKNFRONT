import React from "react";
import SignupForm3 from "../../../components/Signup/SignupForm3";

const Signup3 = ({nextStep, handleChange, userData}) => {

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#E2F5FF',
            height: '100vh' // 전체 뷰포트 높이
        }}>
            <SignupForm3 nextStep={nextStep} handleChange={handleChange} userData={userData} />
        </div>
    );
};

export default Signup3;