import React, { useEffect, useState,useRef } from 'react';
import {  Typography, Paper, Box, Divider, List, ListItem, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import BarChartComponent from '../../../../components/bargraph/BarChartComponent';
import PieChartComponent from '../../../../components/piechart/PieChartComponent';
import ResultBoxSection from '../../../../components/ResultBox/ResultBoxSection';
import ScoreDisplay from '../../../../components/scoredisplay/ScoreDisplay';
import NonConformityCheck from '../../../../components/NonConformityCheck/NonConformityCheck';
import testData from './fromback.json';
import '../compactContainer.css';

import './Step4.css';
import '../../../../assets/fonts/fonts.css';    
import CustomizedSteppers from '../../../../components/StepIndicator/StepIndicator';
import axios from "axios";

function Step4({ processId, nextStep }) {
    const [open, setOpen] = useState(false);
    const [detailType, setDetailType] = useState("");
    const [visible, setVisible] = useState(false);
    const containerRef = useRef(null);

    // 임의의 테스트 데이터
    const mockServerData = {
        processId: "abcde",
        lawViolate: "3",
        lawDanger: "2",
        guideViolate: "1",
        score: 57,
    };

    const [serverData] = useState(mockServerData);
    
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
            전체평균:3,
            일반: 2,
            법률: 1,
        },
        {
            name: '법률 위반 위험',
            사용자: serverData['lawDanger'],
            전체평균:2,
            일반: 2,
            법률: 2,
        },
        {
            name: '작성지침 미준수',
            사용자: serverData['guideViolate'],
            전체평균:1,
            일반: 1,
            법률: 2,
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
            <Divider style={{marginTop: "50px", border: '10px solid #8AD6FC'}} />
            {/* 다양한 항목들 */}
            <div className="estimate_userFile" style={{marginBottom: "200px"}}>
                <h1 style={{marginLeft:'20px', fontFamily: "NotoSansKR-SemiBold"}}>대시보드</h1>
                <Divider style={{marginBottom:'30px'}} />
                <ResultBoxSection serverData={serverData} />
                <Divider style={{margin: "30px", opacity:0}} />
                <h2 style={{marginLeft:'20px', fontFamily: "NotoSansKR-Medium"}}>점수 결과</h2>
                <div className="score-whyscore" style={{borderRadius: '10px',backgroundColor: "#ffffff", border: '3px solid #F2F2F2',marginLeft:"20px",marginRight:"20px"}}>
                    <ScoreDisplay data={serverData} />
                    <PieChartComponent pieData={pieData} total={total} />   
                </div>
            </div>

            <div className="average-bargraph">
                <h1 style={{marginLeft:'20px', fontFamily: "NotoSansKR-SemiBold"}}>업종별 평균 비교 그래프</h1>
                <Divider style={{marginBottom:'20px',opacity:0}} />
                <BarChartComponent data={graphData} />      

            </div>
            <Divider style={{margin: "100px", opacity:0}} />

            {/* 여기 부적합요소 확인 스크롤 보여주기. */}
            <div className="nonconformity">
                <h1 style={{marginLeft:'20px', fontFamily: "NotoSansKR-SemiBold"}}>부적합 요소 확인</h1>
                <Divider style={{marginBottom:'10px'}} />
                <NonConformityCheck data={testData} />
            </div>
            <Divider style={{margin: "100px", opacity:0}} />

            <Box display="flex" justifyContent="flex-end" mt={4}>
                <Button onClick={nextStep} variant="outlined" color="primary" style={{fontFamily: "NotoSansKR-Bold"}}>상세 가이드라인</Button>
            </Box>
        </Container>
    );
    
}

export default Step4;
