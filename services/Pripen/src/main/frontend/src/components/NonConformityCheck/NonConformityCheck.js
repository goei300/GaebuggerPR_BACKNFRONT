import React, { useState } from 'react';
import { Button, Typography, Box, ToggleButtonGroup, ToggleButton, Paper, Divider } from '@mui/material';
import "../../assets/fonts/fonts.css";
import { makeStyles } from '@mui/styles';

const NonConformityCheck = ({ data, omissionData }) => {
  const [selectedViolations, setSelectedViolations] = useState(['법률 위반','법률 위반 위험','작성지침 미준수']);
  console.log("data is?");
  console.log(data);
  const contentPieces = [];
  const getMissingIssue = () => {
    const missingIssues = data.issues.filter(issue => issue.startIndex === -999 && selectedViolations.includes(issue.type));

    const countByIssueType = {
      "법률 위반": 0,
      "법률 위반 위험": 0,
      "작성지침 미준수": 0
    };

    missingIssues.forEach(issue => {
      if (countByIssueType[issue.type] !== undefined) {
        countByIssueType[issue.type]++;
      }
    });

    if (missingIssues.length === 0) {
      return null; // 누락된 항목이 없으면 null 반환
    }

    return (
        <div key="missingIssue" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: "3px", borderRadius: "3px", margin: "5px 0", border: "1px solid black" }}>
          <h3 style={{ marginRight: '10px', marginTop:"5px", marginBottom:"5px", fontFamily:"NotoSansKR-SemiBold" }}>누락된 항목</h3>
          <Divider style={{marginBottom:"10px"}} />
          {countByIssueType["법률 위반"] > 0 && (
              <span style={{fontWeight:"bold", marginRight: '10px',fontFamily:"NotoSansKR-Regular"}}>
                <span style={{backgroundColor:"red",borderRadius:"5px"}}>법률 위반</span>: {countByIssueType["법률 위반"]} 건
              </span>
          )}
          {countByIssueType["법률 위반 위험"] > 0 && (
              <span style={{fontWeight:"bold", marginRight: '10px',fontFamily:"NotoSansKR-Regular"}}>
                <span style={{backgroundColor:"orange",borderRadius:"5px"}}>법률 위반 위험</span>: {countByIssueType["법률 위반 위험"]} 건
              </span>
          )}
          {countByIssueType["작성지침 미준수"] > 0 && (
              <span style={{fontWeight:"bold",fontFamily:"NotoSansKR-Regular"}}>
                <span style={{backgroundColor:"gold",borderRadius:"5px"}}>작성지침 미준수</span>: {countByIssueType["작성지침 미준수"]} 건
              </span>
          )}
        </div>
    );
  };
  const getOmissionParagraph = () => {


    return (
      <div className="omissionParagraph" style={{ border: "2px solid black" }}>
        <p>누락된 항목</p>
        {/* omissionData의 omissionData.content만 ul로 보여주기 */}
        <ul>
          {omissionData.map((data, index) => (
            <li key={index}>{data.content}</li>
          ))}
        </ul>
    </div>
    );
  };
  const getHighlightedContent = () => {
    let lastIndex = 0;


    data.issues.forEach((issue) => {
      if (selectedViolations.includes(issue.type)) {
        if (issue.startIndex === -999) {
          return; // 이 issue는 이미 처리되었으므로 다음 issue로 넘어갑니다.
        }
        // 중간 문자열을 처리
        const midContent = data.content.slice(lastIndex, issue.startIndex);
        contentPieces.push(parseText(midContent));

        // issue 부분을 처리 (끝나는 부분에 \n이 있으면 <br /> 추가)
        let issueContent = data.content.slice(issue.startIndex, issue.endIndex);
        if (data.content[issue.endIndex] === '\n') {
          issueContent += '\n';
        }
        contentPieces.push(
          <span key={issue.startIndex} style={{ backgroundColor: getColorByType(issue.type) ,borderRadius:"10px", fontFamily:"NotoSansKR-Medium", fontSize:"1.15em" }}>
            <h3 style={{ color: "black", marginLeft: "5px" , fontSize:"18px",fontWeight:"bold"}}>위반 문장</h3>
            {parseText(issueContent)}
          </span>
        );
        lastIndex = issue.endIndex + (data.content[issue.endIndex] === '\n' ? 1 : 0);
      }
    });
    contentPieces.push(parseText(data.content.slice(lastIndex)));
    return contentPieces;
  };

  const getColorByType = (type) => {
    switch (type) {
      case "법률 위반": return 'red';
      case "법률 위반 위험": return 'orange';
      case "작성지침 미준수": return 'gold';
      default: return 'transparent';
    }
  };
  const parseText = (text) => {
    const splitByNewLine = text.split('\n');
    return splitByNewLine.map((line, index) => (
        <React.Fragment key={index}>
            {line.replace(/\t/g, '    ')} {/* 탭을 4개의 공백으로 변경. 필요에 따라 조정 가능 */}
            {index !== splitByNewLine.length - 1 && <br />}
        </React.Fragment>
    ));
  };
const useStyles = makeStyles({
  lawViolation: {
    fontFamily:"NotoSansKR-Regular",
    backgroundColor: "transparent", // 예: 빨간색
    '&.Mui-selected': {
      fontFamily:"NotoSansKR-SemiBold",
      borderBottom: "6px solid red",  // 밑줄 적용
      paddingBottom: "5px"            // 밑줄과 텍스트 간의 간격
    }
  },
  lawRisk: {
    fontFamily:"NotoSansKR-Regular",
    backgroundColor: "transparent", // 예: 노란색
    '&.Mui-selected': {

      fontFamily:"NotoSansKR-SemiBold",
      borderBottom: "6px solid orange",  // 밑줄 적용
      paddingBottom: "5px"            // 밑줄과 텍스트 간의 간격
    }
  },
  guidelineViolation: {
    fontFamily:"NotoSansKR-Regular",
    backgroundColor: "transparent", // 예: 자주색
    '&.Mui-selected': {
      fontFamily:"NotoSansKR-SemiBold",
      borderBottom: "6px solid gold",  // 밑줄 적용
      paddingBottom: "5px"            // 밑줄과 텍스트 간의 간격
    }
  },
});
const classes = useStyles();
  return (
    <Box mt={4} style={{display: "flex", flexDirection: "column", marginLeft:"20px",marginRight:"20px"}}>
      <ToggleButtonGroup
        value={selectedViolations}
        onChange={(event, newValues) => setSelectedViolations(newValues)}
        aria-label="issues"
        style={{justifyContent:"flex-end"}}
      > 
        <ToggleButton 
          value="법률 위반" 
          aria-label="법률 위반" 
          className={classes.lawViolation}
        >
          법률 위반
        </ToggleButton>
        <ToggleButton 
          value="법률 위반 위험" 
          aria-label="법률 위반 위험" 
          className={classes.lawRisk}
        >
          법률 위반 위험
        </ToggleButton>
        <ToggleButton 
          value="작성지침 미준수"
          aria-label="작성지침 미준수"
          className={classes.guidelineViolation}
        >
          작성지침 미준수
        </ToggleButton>
      </ToggleButtonGroup>
      <Paper style={{maxHeight: '450px', overflowY: 'scroll', padding: '16px', border: "2px solid #d9d9d9"}}>
        {getOmissionParagraph}
        {getHighlightedContent().map((item, index) => (
          <Typography key={index} variant="body1" display="inline" style={{fontFamily:"NotoSansKR-Regular"}}>{item}</Typography>
        ))}
        {getMissingIssue()}
      </Paper>
    </Box>
  );
};

export default NonConformityCheck;
