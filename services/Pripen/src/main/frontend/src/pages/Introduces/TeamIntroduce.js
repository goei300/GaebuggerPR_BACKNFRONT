import React from "react";
import TeamLogo from "../../assets/images/Gaebugger_ver2.png";
import TeamIntro from '../../assets/images/외부-전달용-간단-ver-002.png';
const TeamIntroduce = () => {
    return(
        <div style={{marginTop:'100px',marginLeft:'50px'}}>
            {/* <div className="Team-Name" style={{fontFamily:'NotoSansKR-SemiBold', fontSize:'32px', display:'flex', flexDirection:'column', justifyContent:'center', alignContent:'center', alignItems:'center'}}>
                <img src={TeamLogo} style={{width:'200px', height:'200px'}} />
                <h5>Team 개버거</h5>
            </div> */}

            <div className="Team-Content" style={{fontFamily:'NotoSansKR-Regular', fontSize:'18px'}}>
                <img src={TeamIntro} style={{wdith:'100%', height:'100%'}} />
            </div>
        </div>
    )

};

export default TeamIntroduce;