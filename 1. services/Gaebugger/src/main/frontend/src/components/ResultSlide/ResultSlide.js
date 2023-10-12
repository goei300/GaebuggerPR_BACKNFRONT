import React,{useEffect, useState} from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Paper } from '@mui/material';
import "../../assets/fonts/fonts.css";
import "./ResultSlide.css";
import { StyledPaper } from '../../pages/Start/check/Guideline_detail/styles/ComponentStyles';
function ResultSlide({issues, paragraph, style, onIssueClick}) {

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [onlyShowIssueParagraphs, setOnlyShowIssueParagraphs] = useState(false);
    const sliderRef = React.useRef(null);

    const getDisplayedParagraphs = () => {
        const issueParagraphIds = getIssueParagraphIds();
        return onlyShowIssueParagraphs ? paragraph.filter(p => issueParagraphIds.includes(p.paragraph_id)) : paragraph;
    };

    const handleCheckboxChange = (event) => {
        setOnlyShowIssueParagraphs(event.target.checked);
    };
    // 현재 슬라이드의 index가 변경될 때 호출되는 함수
    const handleAfterChange = (currentIndex) => {
        setCurrentSlideIndex(currentIndex);

        const displayedParagraphs = getDisplayedParagraphs();
        const currentParagraphId = displayedParagraphs[currentIndex].paragraph_id;
        const relevantIssues = getRelevantIssues(currentParagraphId);
        // 현재 paragraph와 관련된 모든 issue들을 onIssueClick에 전달

        onIssueClick(relevantIssues);
    };
    
    // 이슈가 있는 paragraph_id 목록을 가져옵니다.
    const getIssueParagraphIds = () => {
        const uniqueIds = new Set(issues.map(issue => issue.issue_paragraph_id));
        return Array.from(uniqueIds);
    };
    // 슬라이드 설정    
    const settings = {
        arrows:true,
        dots: true,
        infinite: false, // 수정
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        afterChange: handleAfterChange
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
        const paragraphsToRender = getDisplayedParagraphs();
        const issueParagraphIds = getIssueParagraphIds(); // 여기에서 함수의 결과를 변수에 저장
        return paragraphsToRender.map(p => {
            let contentArray = [];
            let lastIndex = 0;
    
            const relevantIssues = getRelevantIssues(p.paragraph_id);
            // 체크박스가 체크되어 있고, 해당 단락의 ID가 이슈가 있는 단락의 ID 목록에 없다면 렌더링하지 않습니다.
            if (onlyShowIssueParagraphs && !issueParagraphIds.includes(p.paragraph_id)) {
                return (
                    <p>이슈가 없습니다!</p>
                );
            }

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
    useEffect(() => {
        setCurrentSlideIndex(0);

        const currentParagraphId = paragraph[0].paragraph_id;
        const relevantIssues = getRelevantIssues(currentParagraphId);

        // 현재 paragraph와 관련된 모든 issue들을 onIssueClick에 전달
        onIssueClick(relevantIssues);
    }, []);   //초기 설정
    useEffect(() => {
        // 체크박스의 상태가 변경될 때마다 첫 번째 슬라이드로 이동
        setCurrentSlideIndex(0);
        // 미세한 딜레이 후에 슬라이드 이동
        const timer = setTimeout(() => {
            if (sliderRef.current && sliderRef.current.slickGoTo) {
                
                sliderRef.current.slickGoTo(0);
            }
        }, 50);
    
        // 첫 번째 슬라이드에 대한 이슈들을 가져와서 onIssueClick 호출
        const firstParagraphId = getDisplayedParagraphs()[0].paragraph_id;
        const relevantIssues = getRelevantIssues(firstParagraphId);
        onIssueClick(relevantIssues);

        return () => {
            clearTimeout(timer); // 컴포넌트가 언마운트되면 타이머 클리어
        };
    
    }, [onlyShowIssueParagraphs, paragraph, issues]);
    
    return (
        <StyledPaper style={style}>
            {/* 이슈가 있는 단락만 보기 체크박스 구현 */}
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="checkbox"
                    id="onlyShowIssueParagraphs"
                    checked={onlyShowIssueParagraphs}
                    onChange={handleCheckboxChange}
                />
                <label htmlFor="onlyShowIssueParagraphs">이슈가 있는 단락만 보기</label>
            </div>
            <Slider ref={sliderRef} {...settings} key={onlyShowIssueParagraphs ? 'withIssues' : 'all'}>
                {renderSlides()}
            </Slider>
            <p>{`${currentSlideIndex + 1} / ${getDisplayedParagraphs().length}`}</p>
        </StyledPaper>
    );
}

export default ResultSlide;
