import React, {useState} from "react";
import CustomizedSteppers from "../../../../components/StepIndicator/StepIndicator";
import {   Paper, Typography,  Box, Divider, Container, Button, IconButton,Table, TableBody, TableCell, TableHead, TableRow,TablePagination  } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import testIssue from './issues.json';
import ResultSlide from "../../../../components/ResultSlide/ResultSlide";
import RenderIssue from "../../../../components/RenderIssue/RenderIssue";
import guidelineDetail from './test_process.json';
import './Highlight.css';
import '../../../../assets/fonts/fonts.css';
import { 
    StyledPaper, 
    customStyles, 
    customStyles_title, 
    StyledToggleButton, 
    StyledToggleButtonGroup 
} from './styles/ComponentStyles';
function Guideline_detail({processId, prevStep}){
    // 임의의 데이터    
    const [solutionTypes,setSolutionTypes] = useState([1,2,3]);
    const modifiedTxt = guidelineDetail.modifiedText;
    const modifiedText_component = guidelineDetail.modifiedText_component;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [selectedOption, setSelectedOption] = useState("paragraph"); // 초기값은 "paragraph"


    const handleIssueClick = (issuelist) => {
        setSelectedIssue(issuelist);
    }
    const handleOptionChange = (option) => {
        setSelectedOption(option);
    }
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
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 5));
        setPage(0); // 페이지 수를 변경할 때 첫 페이지로 돌아갑니다.
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

    return (
        <Container className="compact-container" style={{padding:"0px"}}>
            <CustomizedSteppers activeStep={3} />
            <Divider style={{ margin: "20px", opacity: 0 }} />

            <StyledPaper style={{margin:"20px"}}>
                <div className="eachIssue">
                    <h1 style={{ marginLeft: '10px', fontFamily: "NotoSansKR-SemiBold" }}>이슈 개별 분석</h1>
                    <Divider style={{ marginBottom: '30px',border: "1px solid" }} />

                    {/* 이슈 테이블 */}
                    <div className="issueTable">
                        <h2 style={{fontFamily:"NotoSansKR-SemiBold", marginLeft: "20px"}}>이슈 테이블</h2>
                        <Divider style={{marginBottom:'10px'}} />
                        <h3 style={{marginLeft:"25px", fontFamily:"NotoSansKR-Medium", color:"#999"}}>표를 통해 모든 이슈를 간편하게 확인해보세요.</h3>
                        <Divider style={{marginBottom:'20px',opacity:0}} />
                        <StyledPaper elevation={3} style={{ margin: '10px', padding: '20px' }}>
                            <Table style={{ width: "100%"}}>
                                <TableHead>
                                    <TableRow style={{}}>
                                        <TableCell style={{fontFamily:"NotoSansKR-Bold", width:"5%"}}>번호</TableCell>
                                        <TableCell style={{fontFamily:"NotoSansKR-Bold",width:"15%"}}> 유형</TableCell>
                                        <TableCell style={{fontFamily:"NotoSansKR-Bold",width:"40%"}}>내용</TableCell>
                                        <TableCell style={{fontFamily:"NotoSansKR-Bold",width:"30%"}}>근거</TableCell>
                                        <TableCell style={{fontFamily:"NotoSansKR-Bold"}}>확인하기</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {testIssue.process_Issues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(issue => (
                                        <TableRow key={issue.issue_id}>
                                            <TableCell style={{width:"10%", fontFamily:"NotoSansKR-Regular"}}>{issue.issue_id}</TableCell>
                                            <TableCell style={{width:"10%", fontFamily:"NotoSansKR-Regular"}}>
                                                {issue.issue_type}
                                                {issue.issue_type === "법률 위반" && <span style={{color: "red", fontWeight: "bold", marginLeft: "7px"}}>(-10)</span>}
                                                {issue.issue_type === "법률 위반 위험" && <span style={{color: "orange", fontWeight: "bold", marginLeft: "7px"}}>(-5)</span>}
                                                {issue.issue_type === "작성지침 미준수" && <span style={{color: "goldenrod", fontWeight: "bold", marginLeft: "7px"}}>(-3)</span>}
                                            </TableCell>
                                            <TableCell style={{width:"40%", fontFamily:"NotoSansKR-Regular"}}>{issue.issue_content}</TableCell>
                                            <TableCell style={{width:"30%", fontFamily:"NotoSansKR-Regular"}}>{issue.issue_reason}</TableCell>
                                            <TableCell>
                                                <Button 
                                                    variant="contained" 
                                                    color="primary" 
                                                    size="small" 
                                                    style={{ borderRadius: '25px', padding: '5px 15px' }} // 이 부분에서 버튼의 모양과 크기를 조절합니다.
                                                >
                                                    확인
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={testIssue.length}  // 전체 행의 수
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPageOptions={[]}  // 페이지 당 행 수 선택 옵션을 숨김
                                labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}  // "페이지 당 행" 라벨을 숨기기 위한 추가 설정
                                style={{display:"flex",justifyContent:"center",alignContent:"center"}}
                            />
                        </StyledPaper>
                    </div>

                    <Divider style={{marginBottom:"50px", opacity:0}} />
                    {/* 이슈사항 상세 검토 */}
                    <div className="issueDetail">
                        <h2 style={{fontFamily:"NotoSansKR-SemiBold", marginLeft: "20px"}}>이슈 상세검토</h2>
                        <Divider style={{marginBottom:'10px'}} />
                        <h3 style={{marginLeft:"25px", fontFamily:"NotoSansKR-Medium", color:"#999"}}>이슈 정보와 가이드라인까지 한번에 확인해보세요.</h3>
                        <Divider style={{marginBottom:'20px',opacity:0}} />
                        
                        <div className="slideOption" style={{fontFamily:"NotoSansKR-Medium",width:"400px", borderRadius:"10px", marginBottom:"0px",border:"1px solid #d9d9d9"}}>
                            <p style={{fontFamily:"NotoSansKR-Medium",marginLeft:"25px",fontSize:"20px"}}>슬라이드 넘기기 형식 </p>
                            <div className="OptionChoice" style={{fontFamily:"NotoSansKR-Bold", marginLeft:"25px", display: "flex", flexDirection:"row", justifyContent:"flex-start",fontSize:"22px"}}>
                                <p className="perParagrah" onClick={() => handleOptionChange("paragraph")} style={{marginTop:"0px",marginBottom:"0px"}}>단락별</p>
                                <span style={{margin: '0 10px'}}>|</span> {/* 여기에 구분 문자를 추가 */}
                                <p className="perIssue" onClick={() => handleOptionChange("issue")} style={{marginTop:"0px",marginBottom:"0px"}}>이슈별</p>
                            </div>
                        </div>
                        <div className="showingIssue" style={{ border:"1px solid #d9d9d9",borderRadius:"10px",padding:"30px"}}>
                            {selectedOption === "paragraph" ? (
                                <div className="paragraph" style={{display:"flex",justifyContent:"space-between"}}>
                                    <ResultSlide issues={testIssue.process_Issues} paragraph={testIssue.process_Paragraph} style={{flex:"1",margin:"0 10px",width: "10%"}} onIssueClick={handleIssueClick}/>
                                    <RenderIssue issuelist={selectedIssue} style={{flex:"1",margin:"0 10px"}}/>
                                </div>
                            ) : (
                                <div className="issue">
                                    {/* 여기에 이슈별로 렌더링되는 컴포넌트를 넣습니다. */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 수정된 txt파일 내용 */}

                <Divider style={{marginTop:"500px",opacity:0}} />
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