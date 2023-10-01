import React, {useState} from "react";
import CustomizedSteppers from "../../../../components/StepIndicator/StepIndicator";
import {  ToggleButton, ToggleButtonGroup, Typography, Paper, Box, Divider, Grid, List, ListItem, Container, Button, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
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
const customStyles = {
    color: '#007BFF',  
    textShadow: '3px 3px 10px rgba(0, 0, 0, 0.2)',  // 강조된 그림자 효과
    fontWeight: 'bold',  
    letterSpacing: '1.5px',  
    marginBottom: '25px', 
    fontFamily: 'NotoSansKR-Bold',  // NotoSansKR의 미디움 스타일 사용
    background: '-webkit-linear-gradient(45deg, #007BFF, #33CCFF)',  // 그라데이션 효과
    WebkitBackgroundClip: 'text',  // 배경의 그라데이션 효과를 텍스트에만 적용
    WebkitTextFillColor: 'transparent'  // 텍스트 색상을 투명하게 하여 그라데이션 효과만 보이게 함
};
const customStyles_title = {
    color: '#454545',  
    textShadow: '1px 1px 5px rgba(100, 100, 100, 0.1)',  
    letterSpacing: '0.5px',  
    marginBottom: '15px', 
    fontFamily: 'NotoSansKR-Regular',
    borderBottom: '2px solid #007BFF',  // 하단의 강조선
    paddingBottom: '5px',
    display: 'inline-block'  // borderBottom이 텍스트 너비만큼만 표시되도록
};

const StyledToggleButton = styled(ToggleButton)({
    height: '20px',
    fontSize: '10px',
    fontFamily: 'NotoSansKR-Regular',
    color:'black',
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
    const [guidelineTypes, setGuidelineTypes] = useState([1,2,3]); // 가이드라인 필터링을 위한 상태 변수
    const [solutionTypes,setSolutionTypes] = useState([1,2,3]);

    // 특정 wrong_type 필터링 토글 함수
    const toggleFilterType = (type) => {
      setFilteredTypes((prevTypes) => 
        prevTypes.includes(type) ? prevTypes.filter(t => t !== type) : [...prevTypes, type]
      );
    };
  
    // wrong_type 별로 텍스트 강조
    // const filteredHighlight = (txt, templates) => {
    //     let highlightedText = txt;
    //     templates.forEach(template => {
    //         if (filteredTypes.includes(template.wrong_type)) {
    //             const regex = new RegExp(template.wrong_content, "g");
    //             const className = `highlight type${template.wrong_type}`;
    //             highlightedText = highlightedText.replace(regex, `<span class="${className}">${template.wrong_content}</span>`);
    //         }
    //     });
    //     return highlightedText;
    // };


    const originalTxt = guidelineDetail.originalContent;

    const guideline = guidelineDetail.guideline;

    const modifiedTxt = guidelineDetail.modifiedText;

    const modifiedText_component = guidelineDetail.modifiedText_component;

    const filteredHighlight = (txt, templates) => {
        let highlightedText = txt;
        templates.forEach(template => {
            if (filteredTypes.includes(template.wrong_type)) {
                const regex = new RegExp(template.wrong_content, "g");
                const className = `highlight type${template.wrong_type}`;
                highlightedText = highlightedText.replace(
                    regex, 
                    `<span class="${className}"><span class="idCircle">${template.wrong_id}</span>${template.wrong_content}</span>`
                );
            }
        });
        return highlightedText;
    };
    
    // 가이드라인 부분에 대한 핸들러
    const handleGuidelineTypesChange = (event, newTypes) => {
        if (newTypes.includes("all")) {
            if (guidelineTypes.length === 3) {
                setGuidelineTypes([]);
            } else {
                setGuidelineTypes([1, 2, 3]);
            }
        } else {
            setGuidelineTypes(newTypes.filter(type => type !== "all"));
        }
    };

    const handleModifiedText = (event, newTypes) => {
        // 전체 버튼이 선택된 경우
        if (newTypes.includes("all")) {
            // 이미 모든 버튼이 선택된 상태인 경우 선택을 모두 해제
            if (solutionTypes.length === 3) {
                setSolutionTypes([]);
            } else {
                // 그렇지 않은 경우 모든 버튼을 선택
                setSolutionTypes([1, 2, 3]);
            }
        } else {
            // 전체 버튼을 선택 해제하고 다른 버튼 중 하나를 선택할 경우
            setSolutionTypes(newTypes.filter(type => type !== "all"));
        }
    };

    const highlightModifiedText = () => {
        let highlightedText = modifiedTxt;
        modifiedText_component.forEach(component => {
            if (solutionTypes.includes(component.wrong_id) || solutionTypes.includes('all')) {
                const regex = new RegExp(component.convertTo, "g");
                const className = `highlight type${component.wrong_id}`;
                highlightedText = highlightedText.replace(
                    regex, 
                    `<span class="${className}"><span class="idCircle">${component.wrong_id}</span>${component.convertTo}</span>`
                );
            }
        });
        return highlightedText;
    };
    

    const downloadModifiedText = () => {
        const element = document.createElement('a');
        const file = new Blob([guidelineDetail.modifiedText], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "modifiedText.txt";
        document.body.appendChild(element); // 이 부분이 필요하므로 Firefox에서 잘 동작하도록
        element.click();
    }
    
    
    // 서버에서 guideline_detail 과 txt원문을 가져옴.
    // 

    return (
        <Container className="compact-container">
            <CustomizedSteppers activeStep={3} />
            <Divider style={{ margin: "50px", opacity: 0 }} />

            <StyledPaper>
                <br />
                <Typography variant="h3" align="flex-start" gutterBottom style={customStyles}>
                    상세 가이드라인
                </Typography>
                <Divider style={{margin: '50px', opacity: 0}}/>
                <Grid container spacing={3}>
                    {/* 원본 txt파일 내용 */}
                    <Grid item xs={6}>
                        <Typography variant="h6" gutterBottom style={customStyles_title}>원본 파일</Typography>

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
                        <Typography variant="h6" gutterBottom style={customStyles_title}>가이드라인</Typography>
                        <Box border={1} p={2} borderColor="grey.300" position="relative">
                            <Box position="absolute" top={5} right={5}>
                            <StyledToggleButtonGroup 
                                    value={guidelineTypes} 
                                    onChange={handleGuidelineTypesChange}
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
                            <List>
                                {guideline.map((item, index) => (
                                    (guidelineTypes.includes(item.type) && guidelineTypes.length > 0) ? (
                                        <ListItem key={index}>
                                            <Grid container alignItems="center">
                                                <Grid item xs={1}> {/* idCircle */}
                                                    <div className="idCircle">{item.wrong_id}</div>
                                                </Grid>
                                                <Grid item xs={11}> {/* 본문 텍스트 */}
                                                    <Typography variant="body2" fontSize="14px">{item.text}</Typography>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                    ) : null
                                ))}
                            </List>
                        </Box>

                    </Grid>
                </Grid>

                <Box mt={4} display="flex" flexDirection="column" alignItems="center">
                <ArrowDownwardIcon style={{ 
                    fontSize: 150, 
                    color: "#3f51b5", 
                }} />
                </Box>

                {/* 수정된 txt파일 내용 */}
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom style={customStyles_title}>솔루션 적용 후</Typography>
                    <Box border={1} p={2} borderColor="grey.300" mt={2} position="relative">
                        <Box position="absolute" top={5} right={5}>
                            <StyledToggleButtonGroup 
                                value={solutionTypes} 
                                onChange={handleModifiedText}
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
                        <Divider style={{ margin: "20px", opacity: 0 }} />
                        <pre dangerouslySetInnerHTML={{ __html: highlightModifiedText() }} />
                    </Box>

                    <Box textAlign="right" mt={2}>
                        <IconButton onClick={downloadModifiedText} color="primary" aria-label="download">
                            <DescriptionIcon />
                        </IconButton>
                        <Typography>다운로드</Typography>
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