import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Divider, Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import '../compactContainer.css';
import CustomizedSteppers from "../../../../components/StepIndicator/StepIndicator";
import './Step3.css';
import axios from "axios";
import Loading from '../../../../components/animation/Loading';

const StyledPaper = styled(Paper)({
    padding: '30px',
    borderRadius: '10px',
});

function Step3({ nextStep, processId }) {
    const [loadingComplete, setLoadingComplete] = useState(false);

    useEffect(() => {
        // SSE 연결 설정
        const sse = new EventSource(`http://localhost:8080/api/check-response/${processId}`);

        // 서버에서 이벤트를 받을 때 처리할 리스너 설정
        sse.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data && data.completed) {
                setLoadingComplete(true);
                sse.close();
            }
        };

        // 에러가 발생하면 연결 종료
        sse.onerror = (error) => {
            console.error("SSE error:", error);
            sse.close();
        };

        // 컴포넌트 언마운트 시 연결 종료
        return () => sse.close();
    }, [processId, nextStep]);
    return (
        <Container className="compact-container" style={{padding:"0px"}}>
            <CustomizedSteppers activeStep={2} />
            <StyledPaper elevation={3}>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="400px">
                    {!loadingComplete ? (
                        <>
                            <Loading />
                            <Typography variant="h6" style={{ height:'250px' , position: 'absolute', marginTop: '1px', color: '#333', fontFamily: 'NotoSansKR-Black', animation: 'blink 3s infinite' }}>
                                진단 중입니다. 평균적으로 3~5분정도 소모되니 잠시만 기다려주세요.
                            </Typography>
                        </>
                    ) : (
                        <div className="after-acting" style={{display:"flex", justifyContent:"center", alignContent: "center"}}>
                            <Button variant="contained" color="primary" onClick={nextStep}>
                                결과 확인
                            </Button>
                        </div>
                    )}
                </Box>
            </StyledPaper>
        </Container>
    );
}

export default Step3;
