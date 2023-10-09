import React, { useState } from 'react';
import { Button, Typography, Box, ToggleButtonGroup, ToggleButton, Paper } from '@mui/material';


const NonConformityCheck = ({ data }) => {
  const [selectedViolations, setSelectedViolations] = useState([]);

  const getHighlightedContent = () => {
    let lastIndex = 0;
    const contentPieces = [];

    data.violations.forEach((violation) => {
      if (selectedViolations.includes(violation.type)) {
        // 중간 문자열을 처리
        const midContent = data.content.slice(lastIndex, violation.startIndex);
        contentPieces.push(parseText(midContent));

        // violation 부분을 처리 (끝나는 부분에 \n이 있으면 <br /> 추가)
        let violationContent = data.content.slice(violation.startIndex, violation.endIndex);
        if (data.content[violation.endIndex] === '\n') {
          violationContent += '\n';
        }
        contentPieces.push(
          <span key={violation.startIndex} style={{ backgroundColor: getColorByType(violation.type) }}>
            {parseText(violationContent)}
          </span>
        );
        lastIndex = violation.endIndex + (data.content[violation.endIndex] === '\n' ? 1 : 0);
      }
    });
    contentPieces.push(parseText(data.content.slice(lastIndex)));
    return contentPieces;
  };

  const getColorByType = (type) => {
    switch (type) {
      case '법률 위반': return 'red';
      case '법률 위반 위험': return 'yellow';
      case '작성지침 미준수': return 'blue';
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
  return (
    <Box mt={4} style={{display: "flex", flexDirection: "column"}}>
      <ToggleButtonGroup
        value={selectedViolations}
        onChange={(event, newValues) => setSelectedViolations(newValues)}
        aria-label="violations"
        style={{justifyContent:"flex-end"}}
      >
        <ToggleButton value="법률 위반" aria-label="법률 위반" style={{ '&.Mui-selected': { backgroundColor: '#707070' } }}>법률 위반</ToggleButton>
        <ToggleButton value="법률 위반 위험" aria-label="법률 위반 위험" style={{ '&.Mui-selected': { backgroundColor: '#707070' } }}>법률 위반 위험</ToggleButton>
        <ToggleButton value="작성지침 미준수" aria-label="작성지침 미준수" style={{ '&.Mui-selected': { backgroundColor: "#ffffff" } }}>작성지침 미준수</ToggleButton>
      </ToggleButtonGroup>
      <Paper style={{maxHeight: '300px', overflowY: 'scroll', padding: '16px'}}>
        {getHighlightedContent().map((item, index) => (
          <Typography key={index} variant="body1" display="inline">{item}</Typography>
        ))}
      </Paper>
    </Box>
  );
};

export default NonConformityCheck;
