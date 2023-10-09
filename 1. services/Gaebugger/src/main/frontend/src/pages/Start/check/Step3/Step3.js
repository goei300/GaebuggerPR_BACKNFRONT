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
/*         const checkResponseStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/check-response/${processId}`);
                if (response.status === 200) {
                    setLoadingComplete(true);
                    return;
                }
                setTimeout(checkResponseStatus, 5000);
            } catch (error) {
                console.error("Error checking processing status", error);
                setTimeout(checkResponseStatus, 5000);
            }
        };

        checkResponseStatus(); */

        const timeout = setTimeout(() => {
            setLoadingComplete(true);
        },5000);

        return () => {
            clearTimeout(timeout);/* checkResponseStatus */
        };
    }, [processId, nextStep]);

    return (
        <Container className="compact-container">
            <CustomizedSteppers activeStep={2} />
            <Divider style={{ margin: '20px 0' }} />
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
