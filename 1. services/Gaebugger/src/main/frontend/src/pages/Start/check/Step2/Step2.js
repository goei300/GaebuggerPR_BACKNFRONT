import React, { useState } from "react";
import axios from 'axios';
import { Box, Button, Typography, Container, Divider, Input, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import CustomizedSteppers from "../../../../components/StepIndicator/StepIndicator";
import './Step2.css';
import { CloudUpload as UploadFile } from '@mui/icons-material';

function Step2({ nextStep, prevStep, setProcessId, checkedItems }) {
    const [file, setFile] = useState(null);
    
    const StyledPaper = styled(Paper)({
        padding: '30px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        margin: '100px'
    });
    
    const handleFileChange = (event) => {
        const chosenFile = event.target.files[0];
    
        // 파일 확장자 검사
        if (chosenFile && !chosenFile.name.endsWith('.txt')) {
            alert("오직 .txt 파일만 허용됩니다.");
            event.target.value = '';  // 파일 입력을 초기화
            return;
        }
    
        // 원래의 로직 (파일 상태 업데이트 등)을 계속 실행
        setFile(chosenFile);
    };

    const handleNext = async () => {
        const formData = new FormData();
        formData.append('checkedItems', JSON.stringify(checkedItems));
        formData.append('uploadedFile', file);

/*         try {
            const response = await axios.post("http://localhost:8080/api/checklist/submit", formData);
            if (response.data && response.data.processId) {
                setProcessId(response.data.processId);
                console.log(response.data.processId);
                nextStep();
            } else {
                console.error("No processId received from server");
            }
        } catch (error) {
            console.error("Error sending data", error);
        } */
        nextStep();
    };

    return (
        <Container className="compact-container">
            <CustomizedSteppers activeStep={1} />
            <div className="instruction" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>개인정보 처리방침 파일을 업로드 해주세요!</div>
            <StyledPaper elevation={3}>
                <Box my={3}>
                    <Typography variant="h5" gutterBottom>개인정보 처리방침 문서 파일 업로드를 하세요! 테스트입니다!</Typography>
                    <Typography variant="subtitle1">파일 형식: .txt만 가능 (0.9v)</Typography>
                </Box>
                <Divider style={{ margin: '20px 0' }} />
                <Box display="flex" flexDirection="column" alignItems="center" my={4}>
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        component="label"
                        startIcon={<UploadFile />}
                    >
                        파일 선택
                        <Input type="file" accept=".txt" onChange={handleFileChange} style={{ display: 'none' }} />

                        {/* inline 스타일로 'display: none'을 추가하여 숨김 처리 */}
                    </Button>
                    {file && (
                        <Box width="100%" style={{ textAlign: 'center' }}>
                            <Typography variant="body2" style={{ marginTop: '10px', fontFamily:"NotoSansKR-SemiBold"}}>
                                <br/><br/>
                            </Typography>
                            <Typography variant="h6" style={{ fontFamily:"NotoSansKR-SemiBold"}}>
                                {file.name}
                            </Typography>
                            <Typography variant="body2" style={{ fontFamily:"NotoSansKR-SemiBold"}}>
                                <br/>
                                선택된 파일이 이 파일이 맞는지 확인하세요!
                                <br/><br/>
                            </Typography>
                        </Box>
                    )}
                </Box>
                <Divider style={{ margin: '20px 0' }} />
                <Box mt={3} display="flex" justifyContent="space-between">
                    <Button variant="outlined" color="primary" onClick={prevStep}>
                        이전 단계
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleNext} disabled={!file}>
                        점검 시작
                    </Button>
                </Box>
            </StyledPaper>
        </Container>
    );
}

export default Step2;
