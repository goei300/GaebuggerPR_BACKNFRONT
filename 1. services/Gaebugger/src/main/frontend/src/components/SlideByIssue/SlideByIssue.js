import React, { useState, useRef } from 'react';
import Slider from 'react-slick';  // 예시로 react-slick 사용
import { Divider } from '@mui/material';
import '../../assets/fonts/fonts.css';
import { StyledPaper } from '../../pages/Start/check/Guideline_detail/styles/ComponentStyles';

const SlideByIssue = ({ paragraph, issues,style }) => {
    const [currentIssueIndex, setCurrentIssueIndex] = useState(0);
    const [clickedIssueId, setClickedIssueId] = useState(1); // 추가
    const paragraphRef = useRef(null);
    const sliderRef = useRef(null);


    const handleIssueClick = (issue) => {
        setClickedIssueId(issue.issue_id);
    
        // 해당 issue의 슬라이드 인덱스를 찾습니다.
        const issueIndex = issues.findIndex((item) => item.issue_id === issue.issue_id);
    
        // 해당 슬라이드로 이동합니다.
        if (issueIndex >= 0) {
            sliderRef.current.slickGoTo(issueIndex);
        }
    };

    const handleSlideChange = (newIndex) => {
        setCurrentIssueIndex(newIndex);
        scrollToIssueAndClick(newIndex);
        console.log(newIndex);
    };

    const scrollToIssueAndClick = (issueIndex) => {
        console.log("im on!");
        console.log("issueindex is :", issueIndex);
        
        // 원하는 이슈의 ID를 가져옵니다.
        const issueId = issues[issueIndex].issue_id;
    
        // 클래스가 'highlighted-issue'이면서 data-issue-id 속성이 원하는 이슈 ID와 일치하는 요소를 찾습니다.
        const spanElement = document.querySelector(`.highlighted-issue[data-issue-id="${issueId}"]`);
        console.log("spanElement is: ",spanElement);
        if (spanElement) {
            console.log("final on!");
    
            // 해당 요소를 스크롤하도록 합니다.
            spanElement.scrollIntoView({
                behavior: 'smooth', // 스무스 스크롤 효과를 추가할 수 있습니다.
                block: 'center', // 중앙 정렬
                inline: 'center', // 가로 중앙 정렬
            });
            window.scrollTo({
                top: window.scrollY, // 원하는 Y 좌표
                behavior: 'smooth', // 스무스 스크롤 효과를 추가할 수 있습니다.
            });
            // 해당 요소에 클릭 이벤트를 수동으로 호출합니다.
            spanElement.click();
        }
    };
    const getIssuesLength = () => {
        return issues.length;
    };
    


    const sliderSettings = {
        arrows: true,
        dots: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: handleSlideChange
    };

    // issue를 감싸는 span 생성
    const wrapWithIssueSpan = (text, issue) => {
        let className;
        let style = {};
        let issueNumberStyle = {
            display: 'inline-block',
            borderRadius: '50%',  // 동그라미 모양
            color: 'white',  // 글자색 지정
            backgroundColor:"transparent",
            width: '20px',  // 원 크기 조절
            height: '20px',
            textAlign: 'center',  // 번호 중앙 정렬
            marginRight: '5px',  // 이슈 번호와 텍스트 사이의 간격
            lineHeight: '20px',  // 수직 중앙 정렬
            fontSize: '1em'  // 폰트 크기
        };
        
        if (issue.issue_id === clickedIssueId) {
            style.fontWeight = 'bold'; // 볼드체로 설정
            style.fontSize = '1.2em'; // 폰트 사이즈 조정
        }

        switch(issue.issue_type) {
            case "법률 위반":
                className = "issue-law-violation";
                break;
            case "법률 위반 위험":
                className = "issue-law-risk";
                break;
            case "작성지침 미준수":
                className = "issue-guideline";
                break;
            default:
                className = "issue";
        }
        return (
            <span key={issue.issue_id} className={`highlighted-issue ${className}`} title={issue.issue_content} onClick={() => handleIssueClick(issue)} style={{...style, borderRadius:"10px"}} data-issue-id={issue.issue_id}>
                <span style={{...issueNumberStyle}}>{issue.issue_id}</span>    
                {text}
            </span>
        );
    }
    const wrapWithBreaks = (text) => {
        return text.split('\n').map((line, index, array) => (
            <React.Fragment key={index}>
                {line}
                {index !== array.length - 1 && <br />}
            </React.Fragment>
        ));
    }
    const renderParagraphWithIssues = () => {
        let contentArray = [];
        let lastIndex = 0;
    
        for (let issue of issues) {
            contentArray.push(wrapWithBreaks(paragraph.slice(lastIndex, issue.issue_startIndex)));
            contentArray.push(wrapWithIssueSpan(paragraph.slice(issue.issue_startIndex, issue.issue_endIndex + 1), issue));
            lastIndex = issue.issue_endIndex + 1;
        }
        contentArray.push(wrapWithBreaks(paragraph.slice(lastIndex)));
    
        return contentArray;
    }
    
    
    

    return (
        <div className="issue" style={{display:"flex",justifyContent:"space-between"}}>
            <StyledPaper style={style}>
                <h2 style={{fontFamily:"NotoSansKR-Medium",textAlign:"center"}}>전체 내용</h2>
                <Divider style={{marginBottom:"10px",marginTop:"32px"}} />
                <div ref={paragraphRef} className="paragraph-section" style={{ overflowY: 'auto', maxHeight: '400px', padding: '20px', flex: 1 }}>
                    <p>{renderParagraphWithIssues()}</p>
                </div>
            </StyledPaper>
            
            <StyledPaper style={{ ...style, textAlign: 'center',fontFamily:"NotoSansKR-Regular",display:"flex",flexDirection:"column",overflow: "hidden"}}>
                <h2 style={{fontFamily:"NotoSansKR-Medium"}}>위반 문장</h2>
                <Divider style={{marginBottom:"10px",marginTop:"1px"}} />
                <Slider {...sliderSettings} ref={sliderRef} style={{alignItems: "center", display:"flex",height:"100%",justifyContent:"center"}}>
                    {issues.map(issue => (
                        <div key={issue.issue_id} className="issue-item">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #e0e0e0' }}>
                                    <h4 style={{margin:'10px'}}>번호</h4>
                                    <body>{issue.issue_id}</body>
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <h4 style={{margin:'10px'}}>진단 유형</h4>
                                    <body>{issue.issue_type}</body>
                                </div>
                            </div>

                            <Divider style={{ margin: '10px 0' }} />

                            <h4>진단 근거</h4> {/* 여기에 위반 사유를 넣으세요 */}
                            <body>{issue.issue_reason}</body>
                            <Divider style={{ margin: '10px 0' }} />

                            <h4>가이드 라인</h4>
                            <body>{issue.issue_guideline}</body>
                        </div>
                    ))}
                </Slider>
                <p style={{ textAlign: "center", paddingTop: "10px" }}>{`${currentIssueIndex + 1} / ${getIssuesLength()}`}</p>
            </StyledPaper>
            
        </div>
    );
    
}

export default SlideByIssue;