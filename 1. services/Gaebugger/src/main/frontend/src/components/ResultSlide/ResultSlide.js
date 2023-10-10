import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Paper } from '@mui/material';
import "../../assets/fonts/fonts.css";
import "./ResultSlide.css";
import { StyledPaper } from '../../pages/Start/check/Guideline_detail/styles/ComponentStyles';
function ResultSlide({issues, paragraph, style, onIssueClick}) {

    // 슬라이드 설정
    const settings = {
        arrows:true,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    const prevButton = document.querySelector(".slick-prev");
    const nextButton = document.querySelector(".slick-next");
    // 버튼의 텍스트를 제거합니다.
    if (prevButton) {
        prevButton.innerText = '';
    }
    if (nextButton) {
        nextButton.innerText = '';
    }
    // 클릭 이벤트 
    const handleIssueClick = (issue) => {
        console.log("Issue clicked!", issue);
        onIssueClick(issue);
    }
    // 주어진 paragraph에 대해 관련된 issues를 반환하는 함수
    const getRelevantIssues = (paragraphId) => {
        return issues.filter(issue => issue.issue_paragraph_id === paragraphId);
    }

    // issue를 감싸는 span 생성
    const wrapWithIssueSpan = (text, issue) => {
        let className;
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
                break;
        }
        return (
            <span key={issue.issue_id} className={`issue ${className}`} title={issue.issue_content} onClick={() => handleIssueClick(issue)}>
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
    
      
    // 각 paragraph를 슬라이드 항목으로 변환
    const renderSlides = () => {
        return paragraph.map(p => {
            let contentArray = [];
            let lastIndex = 0;
    
            const relevantIssues = getRelevantIssues(p.paragraph_id);
            for (let issue of relevantIssues) {
                const relativeStart = issue.issue_startIndex - p.paragraph_startIndex;
                const relativeEnd = issue.issue_endIndex - p.paragraph_startIndex;
    
                contentArray.push(wrapWithBreaks(p.paragraph_content.slice(lastIndex, relativeStart)));
                contentArray.push(wrapWithIssueSpan(p.paragraph_content.slice(relativeStart, relativeEnd + 1), issue));
                lastIndex = relativeEnd + 1;
            }
            contentArray.push(wrapWithBreaks(p.paragraph_content.slice(lastIndex)));
    
            return (
                <div key={p.paragraph_id} style={{ whiteSpace: "pre-wrap" }}>
                    {contentArray}
                </div>
            );
        });
    }

    return (
        <StyledPaper style={style}>
            <Slider {...settings}>
                {renderSlides()}
            </Slider>
        </StyledPaper>
    );
}

export default ResultSlide;
