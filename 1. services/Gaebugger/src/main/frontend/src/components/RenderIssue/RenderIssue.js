
import React, { useState, useEffect } from 'react';
import { Typography, Divider } from '@mui/material';
import { StyledPaper } from '../../pages/Start/check/Guideline_detail/styles/ComponentStyles';
import './RenderIssue.css';
import '../../assets/fonts/fonts.css';
function RenderIssue({issuelist,highlightIssue, style}){


    const [animate, setAnimate] = useState(false);
    const highlightedIssueRef = React.useRef(null);
    if (!highlightIssue) {
        highlightIssue = {};
    }
    useEffect(() => {
        if (!highlightIssue) return;
    
        // 강조되어야 하는 이슈가 있고, 이슈의 위치가 지정되면 해당 위치로 스크롤
        if (highlightedIssueRef.current) {
            highlightedIssueRef.current.scrollIntoView({ behavior: 'smooth',block: 'nearest' });
        }
    }, [highlightIssue]);

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
        <StyledPaper style={{ ...style, textAlign: 'center',fontFamily:"NotoSansKR-Regular",display:"flex",flexDirection:"column",overflow: "hidden" }}>
            <h2 style={{fontFamily:"NotoSansKR-Medium"}}>이슈 리스트</h2>
            <Divider style={{marginBottom:"10px",marginTop:"32px"}} />
            <p>해당 단락은 이슈사항 없습니다.</p>
        </StyledPaper>
    )


    return (
        <StyledPaper style={{ ...style, textAlign: 'center',fontFamily:"NotoSansKR-Regular",display:"flex",flexDirection:"column",overflow: "hidden" }}>
            <h2 style={{fontFamily:"NotoSansKR-Medium"}}>이슈 리스트</h2>
            <Divider style={{marginBottom:"10px",marginTop:"32px"}} />
            <div className={animate ? "fade-in" : ""} style={{ overflowY: 'auto', maxHeight: '400px', padding: '20px' }}>
                {issuelist.map((issue, index) => (
                    <div
                        key={index}
                        ref={issue.issue_id === highlightIssue.issue_id ? highlightedIssueRef : null}
                        style={{
                            border: issue.issue_id === highlightIssue.issue_id ? '2px solid red' : '1px solid #999',
                            marginBottom: '40px',
                            padding: '10px'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #e0e0e0' }}>
                                <h4 style={{margin:'10px'}}>이슈 번호</h4>
                                <body1>{issue.issue_id}</body1>
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <h4 style={{margin:'10px'}}>이슈 유형</h4>
                                <body1>{issue.issue_type}</body1>
                            </div>
                        </div>

                        <Divider style={{ margin: '10px 0' }} />

                        <h4>위반 사유</h4> {/* 여기에 위반 사유를 넣으세요 */}
                        <body1>{issue.issue_content}</body1>
                        <Divider style={{ margin: '10px 0' }} />

                        <h4>가이드 라인</h4>
                        <body1>{issue.issue_guideline}</body1>
                    </div>
                ))}
            </div>
        </StyledPaper>
    );

}
export default RenderIssue;