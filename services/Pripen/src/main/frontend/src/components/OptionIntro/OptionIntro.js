import React,{useState} from "react";


const OptionIntro = ({handleOptionChange, selectedOption}) => {

    return(
        <div className="IntroduceOption" style={{ fontFamily: "NotoSansKR-Medium", width: "400px", borderRadius: "10px", marginBottom: "10px" }}>
            <div className="OptionChoice" style={{ fontFamily: "NotoSansKR-Bold", color: "#e0e0e0", marginLeft: "30px", display: "flex", flexDirection: "row", justifyContent: "flex-start", fontSize: "22px" }}>
                <p
                    className="teamIntroduction"
                    onClick={() => handleOptionChange("team")}
                    style={{
                        marginTop: "0px",
                        marginBottom: "0px",
                        color: selectedOption === 'team' ? 'black' : '#e0e0e0'
                    }}
                >
                    팀 소개
                </p>
                <span style={{ margin: '0 10px' }}>|</span>
                <p
                    className="serviceIntroduction"
                    onClick={() => handleOptionChange("service")}
                    style={{
                        marginTop: "0px",
                        marginBottom: "0px",
                        color: selectedOption === 'service' ? 'black' : '#e0e0e0'
                    }}
                >
                    서비스 소개
                </p>
            </div>
        </div>
    );
};
 

export default OptionIntro;
