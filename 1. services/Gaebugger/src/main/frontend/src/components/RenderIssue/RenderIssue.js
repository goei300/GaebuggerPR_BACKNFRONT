
import React, { useState, useEffect } from 'react';
import { Typography, Divider } from '@mui/material';
import { StyledPaper } from '../../pages/Start/check/Guideline_detail/styles/ComponentStyles';
import './RenderIssue.css';
import '../../assets/fonts/fonts.css';
function RenderIssue({issuelist,style}){


    const [animate, setAnimate] = useState(false);
    
    useEffect(() => {
        if (issuelist) {
            setAnimate(true);
            setTimeout(() => setAnimate(false), 500); // 500ms는 애니메이션 지속 시간과 동일하게 설정
        }
    }, [issuelist]);
    if(!issuelist) return(
        <StyledPaper className={animate ? "fade-in" : ""} style={{ ...style, textAlign: 'center', padding: '20px',fontSize:"24px",fontFamily:"NotoSansKR-SemiBold",display:"flex",flexDirection:"column",justifyContent:"center" }}>
            <p>슬라이드를 넘기면 해당 단락의 모든 이슈를 보여드립니다.</p>
        </StyledPaper>
    )
    if (issuelist.length === 0) return(
        <StyledPaper className={animate ? "fade-in" : ""} style={{ ...style, textAlign: 'center', padding: '20px',fontSize:"24px",fontFamily:"NotoSansKR-SemiBold",display:"flex",flexDirection:"column",justifyContent:"center" }}>
            <p>해당 단락은 이슈사항 없습니다.</p>
        </StyledPaper>
    )
    
    return (
        <StyledPaper className={animate ? "fade-in" : ""} style={{ ...style, textAlign: 'center', padding: '20px',fontFamily:"NotoSansKR-Regular",display:"flex",flexDirection:"column",justifyContent:"center" }}>
            <div className="issuelist" style={{ overflowY: 'auto', maxHeight: '400px' }}> {/* 스크롤 가능하도록 설정, 최대 높이는 예시값으로 지정 */}
                {issuelist.map((issue, index) => (
                    <div key={index}>
                        <h4>이슈 번호</h4>
                        <body1>{issue.issue_id}</body1>
                        <Divider style={{ margin: '10px 0' ,opacity:0}} />
                        <h4>이슈 유형</h4>
                        <body1>{issue.issue_type}</body1>
                        <Divider style={{ margin: '10px 0',opacity:0 }} />
                        <h4>가이드 라인</h4>
                        <body1>{issue.issue_guideline}</body1>
                        <Divider style={{ margin: '20px 0' }} /> {/* 각 이슈 사이에 구분선 추가 */}
                    </div>
                ))}
            </div>
        </StyledPaper>
    );

}
export default RenderIssue;