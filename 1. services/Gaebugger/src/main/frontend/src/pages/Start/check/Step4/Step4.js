import React, { useEffect, useState,useRef } from 'react';
import {  Typography, Paper, Box, Divider, List, ListItem, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import { animated } from 'react-spring';
import BarChartComponent from '../../../../components/bargraph/BarChartComponent';
import PieChartComponent from '../../../../components/piechart/PieChartComponent';
import ResultBoxSection from '../../../../components/ResultBox/ResultBoxSection';
import ScoreDisplay from '../../../../components/scoredisplay/ScoreDisplay';
import '../compactContainer.css';
import './Step4.css';
import '../../../../assets/fonts/fonts.css';    
import CustomizedSteppers from '../../../../components/StepIndicator/StepIndicator';
import axios from "axios";

const StyledPaper = styled(Paper)({
    padding: '30px',
    borderRadius: '10px',
    marginTop: '20px',
    marginBottom: '20px',
});

function getDialogTitle(type) {
    switch(type) {
        case 'lawViolate':
            return '법률 위반 세부사항';
        case 'lawDanger':
            return '법률 위반 위험 세부사항';
        case 'guideViolate':
            return '작성지침 미준수 세부사항';
        case 'score':
            return '점수 산정 세부사항'
        default:
            return type;
    }
}
const getCommentByScore = (score) => {
    if (score >= 80) return "좋은 점수입니다. 몇 가지만 개선하면 안전한 작성지침을 작성하실수 있겠습니다.";
    if (score >= 60) return "개선이 필요해보이는 상황입니다. 가이드라인을 통해 바로 수정해보세요!";
    return "Needs Improvement";
}
function Step4({ processId, nextStep }) {
    const [open, setOpen] = useState(false);
    const [detailType, setDetailType] = useState("");
    const [visible, setVisible] = useState(false);
    const containerRef = useRef(null);

    // 임의의 테스트 데이터
    const mockServerData = {
        lawViolate: "3",
        lawDanger: "2",
        guideViolate: "1",
        score: 80,
        lawViolate_detail: ["Detail 1", "Detail 2", "Detail 3"],
        lawDanger_detail: ["Detail A", "Detail B", "Detail C"],
        guideViolate_detail: ["Detail X", "Detail Y", "Detail Z"],
        score_detail: ["Detail α", "Detail β", "Detail γ"],
    };

    const [serverData] = useState(mockServerData);

    const handleOpen = (type) => {
        console.log('Opening dialog for:', type);  // 이 부분을 추가
        setDetailType(type);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
/*     const [serverData, setServerData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/check-response/${processId}`);
                if (response.status === 200) {
                    setServerData(response.data);
                }
            } catch (error) {
                console.error("Error fetching processed data", error);
            }
        };

        fetchData();
    }, [processId]);

    if (!serverData) return <Container className="compact-container">Loading...</Container>;

    const itemsArray = serverData.checkedItems; */


    const graphData = [
        {
            name: '법률 위반',
            사용자: serverData['lawViolate'],
            평균: 2,
        },
        {
            name: '법률 위반 위험',
            사용자: serverData['lawDanger'],
            평균: 1,
        },
        {
            name: '작성지침 미준수',
            사용자: serverData['guideViolate'],
            평균: 1,
        },
    ];
    
    const pieData = [
        {
            "id": "법률 위반",
            "label": "법률 위반",
            "value": 3
        },
        {
            "id": "법률 위반 위험",
            "label": "법률 위반 위험",
            "value": 2
        },
        {
            "id": "작성지침 미준수",
            "label": "작성지침 미준수",
            "value": 1
        }
    ];
    const total = pieData.reduce((acc, data) => acc + data.value, 0);
    return (
        <Container className="compact-container">
            <CustomizedSteppers activeStep={3} />
            <Divider style={{margin: "50px", opacity:0}} />
            {/* 다양한 항목들 */}
            <div className="estimate_userFile" style={{marginBottom: "200px"}}>
                <ResultBoxSection serverData={serverData} handleOpen={handleOpen} />
                <Divider style={{margin: "70px", opacity:0}} />
                <PieChartComponent pieData={pieData} total={total} />   

            </div>

            <br/>
            <br/>
            <Typography variant='h3' style={{ fontFamily: "NotoSansKR-Bold", textAlign: "center"}}>
                평균 처리방침 진단 결과 비교
            </Typography>
            <Divider style={{margin: "50px", opacity:0}} />
        
            <BarChartComponent data={graphData} />      

            <Divider style={{margin: "100px", opacity:0}} />

            <ScoreDisplay data={serverData} handleOpen={handleOpen} getCommentByScore={getCommentByScore} />

            <Box display="flex" justifyContent="flex-end" mt={4}>
                <Button onClick={nextStep} variant="outlined" color="primary" style={{fontFamily: "NotoSansKR-Bold"}}>상세 가이드라인</Button>
            </Box>

            {/* 자세히 보기 팝업 */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{getDialogTitle(detailType)}</DialogTitle>
                <DialogContent>
                    <List>
                        {detailType && serverData[`${detailType}_detail`] && serverData[`${detailType}_detail`].map((detail, index) => (
                            <ListItem key={index}>
                                <Typography>{detail}</Typography>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
    
}

export default Step4;
