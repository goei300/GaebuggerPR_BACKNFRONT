
import React, { useState, useEffect } from 'react';
import { Typography, Divider } from '@mui/material';
import { StyledPaper } from '../../pages/Start/check/Guideline_detail/styles/ComponentStyles';
import './RenderIssue.css';
import '../../assets/fonts/fonts.css';
function RenderIssue({issue,style}){


    const [animate, setAnimate] = useState(false);
    
    useEffect(() => {
        if (issue) {
            setAnimate(true);
            setTimeout(() => setAnimate(false), 500); // 500ms는 애니메이션 지속 시간과 동일하게 설정
        }
    }, [issue]);
    if (!issue) return(
        <StyledPaper className={animate ? "fade-in" : ""} style={{ ...style, textAlign: 'center', padding: '20px' }}>
            <p>이슈를 클릭해 주세요</p>
        </StyledPaper>
    )
    
    return (
        <StyledPaper className={animate ? "fade-in" : ""} style={{ ...style, textAlign: 'center', padding: '20px',fontFamily:"NotoSansKR-Regular",display:"flex",flexDirection:"column",justifyContent:"center" }}>
            <h4>진단 번호</h4>
            <body1>{issue.issue_id}</body1>
            <Divider style={{ margin: '10px 0' ,opacity:0}} />
            <h4>진단 유형</h4>
            <body1>{issue.issue_type}</body1>
            <Divider style={{ margin: '10px 0',opacity:0 }} />
            <h4>가이드 라인</h4>
            <body1>{issue.issue_guideline}</body1>
        </StyledPaper>
    );

}
export default RenderIssue;