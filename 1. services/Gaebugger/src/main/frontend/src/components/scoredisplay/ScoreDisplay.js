import React,{useState, useEffect,useRef} from 'react';
import { Box, Typography, Button } from '@mui/material';

const ScoreDisplay = ({ data, handleOpen,  getCommentByScore }) => {
    const [displayedScore, setDisplayedScore] = useState(0);
    const [showComment, setShowComment] = useState(false); // 추가 커멘트 표시 여부 상태
    const [isVisible, setIsVisible] = useState(false);

    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 0.1
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if(isVisible) {
            const maxScore = data.score;
            const intervalTime = 10;
            const incrementValue = maxScore / (500 / intervalTime);

            const interval = setInterval(() => {
                setDisplayedScore(prevScore => {
                    const newScore = prevScore + incrementValue;
                    if (newScore >= maxScore) {
                        clearInterval(interval);
                        setShowComment(true);
                        return maxScore;
                    }
                    return Math.floor(newScore);
                });
                
            }, intervalTime);

            return () => clearInterval(interval);
        }
    }, [data.score,isVisible]);


    return (
        <Box ref={containerRef} display="flex" flexDirection="column" alignItems="center" my={4} position="relative">
            <Typography variant="h3" style={{ fontFamily: "NotoSansKR-Medium" }}>
                개인정보 처리방침 진단 점수
            </Typography>
            <Typography variant="h2" style={{ margin:"20px", fontFamily: "NotoSansKR-Bold", fontWeight: 'bold' }}>
                {displayedScore}
            </Typography>
            <br/>
            {showComment && (
                <React.Fragment>
                    <Typography variant="h6" style={{ marginTop: '10px', fontFamily: "NotoSansKR-Medium" }}>
                        {getCommentByScore(displayedScore)}
                    </Typography>

                    <Button 
                        variant="outlined" 
                        size="small"
                        style={{ marginTop: '30px', fontFamily: "NotoSansKR-Regular" }} 
                        onClick={() => handleOpen('score')}
                    >
                        자세히보기
                    </Button>
                </React.Fragment>
            )}
        </Box>
    );
};

export default ScoreDisplay;
