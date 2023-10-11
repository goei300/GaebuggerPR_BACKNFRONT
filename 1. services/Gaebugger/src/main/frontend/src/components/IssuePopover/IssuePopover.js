import React from 'react';
import Popover from '@mui/material/Popover';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import { makeStyles } from '@mui/styles';
export default function IssuePopover() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <LiveHelpIcon
        onMouseEnter={handlePopoverOpen}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'center',   // 아이콘의 중앙
          horizontal: 'right',  // 아이콘의 오른쪽 끝
        }}
        transformOrigin={{
          vertical: 'center',   // Popover의 중앙
          horizontal: 'left',   // Popover의 왼쪽 끝
        }}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <div style={{ padding: '10px' }}>
          <h4 style={{fontFamily: "NotoSansKR-SemiBold"}}>이슈란?</h4>
          <p style={{fontFamily:"NotoSansKR-Regular"}}>진단 내린 후 부적합하다고 나온 부분 하나하나를 이슈라고 말해요.</p>
          <ul>
            <li>항목 1</li>
            <li>항목 2</li>
            <li>항목 3</li>
          </ul>
        </div>
      </Popover>
    </div>
  );
}
