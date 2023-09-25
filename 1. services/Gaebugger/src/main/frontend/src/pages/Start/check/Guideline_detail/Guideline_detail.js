import React, {useState} from "react";
import CustomizedSteppers from "../../../../components/StepIndicator/StepIndicator";
import {  ToggleButton, ToggleButtonGroup, Typography, Paper, Box, Divider, Grid, List, ListItem, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import wrongtemplete from './test.json';
import guidelineDetail from './test_process.json';
import './Highlight.css';
import '../../../../assets/fonts/fonts.css';
const StyledPaper = styled(Paper)({
    padding: '30px',
    borderRadius: '10px',
    marginTop: '20px',
    marginBottom: '20px',
});

const StyledToggleButton = styled(ToggleButton)({
    height: '20px',
    fontSize: '10px',
    fontFamily: 'NotoSansKR-Regular',
    width: '90px',  // 너비 설정
    border: '2px solid rgba(0,0,0,0.12)',
    borderRadius: '30px',  // 동그란 형태로 만들기
    marginRight: '10px',
    '&.Mui-selected': {
        backgroundColor: 'rgba(0, 150, 225, 0.15)', 
        '&:hover': {
            backgroundColor: 'rgba(0, 128, 192, 0.5)',
        }
    },
    '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.04)'
    }
});

const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
    '& .MuiToggleButton-root': {
        padding: '2px 5px',
    }
});

function Guideline_detail({processId, prevStep}){

    // 임의의 데이터

    const [filteredTypes, setFilteredTypes] = useState([1, 2, 3]); // 기본적으로 모든 타입 활성화
    // 특정 wrong_type 필터링 토글 함수
    const toggleFilterType = (type) => {
      setFilteredTypes((prevTypes) => 
        prevTypes.includes(type) ? prevTypes.filter(t => t !== type) : [...prevTypes, type]
      );
    };
  
    // wrong_type 별로 텍스트 강조
    const filteredHighlight = (txt, templates) => {
        let highlightedText = txt;
        templates.forEach(template => {
            if (filteredTypes.includes(template.wrong_type)) {
                const regex = new RegExp(template.wrong_content, "g");
                const className = `highlight type${template.wrong_type}`;
                highlightedText = highlightedText.replace(regex, `<span class="${className}">${template.wrong_content}</span>`);
            }
        });
        return highlightedText;
    };

    const originalTxt = guidelineDetail.originalContent;

    const guideline = guidelineDetail.guideline;

    const modifiedTxt = guidelineDetail.modifiedText;
    // 서버에서 guideline_detail 과 txt원문을 가져옴.
    // 

    return (
        <Container className="compact-container">
            <CustomizedSteppers activeStep={3} />
            <Divider style={{ margin: "50px", opacity: 0 }} />

            <StyledPaper>
                <Typography variant="h4" align="center" gutterBottom>상세 가이드라인</Typography>

                <Grid container spacing={3}>
                    {/* 원본 txt파일 내용 */}
                    <Grid item xs={6}>
                        <Typography variant="h6">원본 파일</Typography>

                        <Box border={1} p={2} borderColor="grey.300" position="relative">
                            <Box position="absolute" top={5} right={5}>
                            <StyledToggleButtonGroup 
                                value={filteredTypes} 
                                onChange={(event, newTypes) => {
                                    // 전체 버튼이 선택된 경우
                                    if (newTypes.includes("all")) {
                                        // 이미 모든 버튼이 선택된 상태인 경우 선택을 모두 해제
                                        if (filteredTypes.length === 3) {
                                            setFilteredTypes([]);
                                        } else {
                                            // 그렇지 않은 경우 모든 버튼을 선택
                                            setFilteredTypes([1, 2, 3]);
                                        }
                                    } else {
                                        // 전체 버튼을 선택 해제하고 다른 버튼 중 하나를 선택할 경우
                                        setFilteredTypes(newTypes.filter(type => type !== "all"));
                                    }
                                }}
                            >
                                <StyledToggleButton value="all" aria-label="전체">
                                    전체
                                </StyledToggleButton>
                                <StyledToggleButton value={1} aria-label="Type 1">
                                    법률 위반
                                </StyledToggleButton>
                                <StyledToggleButton value={2} aria-label="Type 2">
                                    법률 위반 위험
                                </StyledToggleButton>
                                <StyledToggleButton value={3} aria-label="Type 3">
                                    작성지침 미준수
                                </StyledToggleButton>
                            </StyledToggleButtonGroup>
                            </Box>
                            <Divider style={{margin: "20px" ,  opacity:0}} />
                            <pre dangerouslySetInnerHTML={{ __html: filteredHighlight(originalTxt, wrongtemplete) }} />
                        </Box>
                    </Grid>

                    {/* 가이드라인 */}
                    <Grid item xs={6}>
                    <Box border={1} p={2} borderColor="grey.300" mt={2}>
                        <Typography variant="h6">가이드라인</Typography>
                        <List>
                            {guideline.map((item, index) => (
                                <ListItem key={index}>
                                    <Typography variant="body1">{item.text}</Typography>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    </Grid>
                </Grid>

                {/* 수정된 txt파일 내용 */}
                <Box mt={4}>
                    <Typography variant="h6">솔루션 적용 후</Typography>
                    <Box border={1} p={2} borderColor="grey.300" mt={2}>
                        <pre>{modifiedTxt}</pre>
                    </Box>
                </Box>

                <Divider style={{ margin: '20px 0' }} />

                <Box mt={3} display="flex" justifyContent="space-between">
                    <Button variant="outlined" color="primary" onClick={prevStep}>
                        이전 단계
                    </Button>
                </Box>
            </StyledPaper>
        </Container>
    );
}

export default Guideline_detail;