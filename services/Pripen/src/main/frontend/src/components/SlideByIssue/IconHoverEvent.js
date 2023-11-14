import React,{useState} from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function IconHoverEvent({ otherIssues, handleIssueClick,wrapWithIssueSpan }) {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <div className="IconHoverEvent" onMouseLeave={() => setIsHovered(false)}>
        <body style={{marginTop:'5px', fontFamily:"NotoSansKR-Bold"}}>외 {otherIssues.length}건</body>
        &nbsp;
        &nbsp;
        <ExpandMoreIcon className="issueIcon" onMouseEnter={() => setIsHovered(true)}/>
        <div className="popover" style={{ display: isHovered ? 'flex' : 'none' }}>
          {otherIssues.map(issue => (
            <div key={issue.issue_id} onClick={() => handleIssueClick(issue)}>
              {wrapWithIssueSpan(null,issue)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default IconHoverEvent;
  