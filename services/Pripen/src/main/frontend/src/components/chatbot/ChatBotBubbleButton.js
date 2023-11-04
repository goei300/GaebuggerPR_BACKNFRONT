import React, {useState} from 'react';
import PriPenSvg from '../../assets/images/chatbotIcon.png'; // SVG 파일을 React 컴포넌트로 불러옵니다.

const ChatBotBubbleButton = () => {

  
  const fixedButtonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '40px',
    backgroundColor: '#409eff', // 밝은 파란색으로 변경
    border: 'none',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '50%', // 구형 모양
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)', // 부드러운 그림자로 변경
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    zIndex: 1000,
    
    // 하이라이트와 밝기를 강조하는 그라디언트
    background: `linear-gradient(145deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3)),
                 radial-gradient(circle at top left, rgba(255, 255, 255, 0.8), transparent),
                 radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.1), transparent),
                 #409eff` // 기본 색상을 더 밝은 색으로 변경
  };
  
  const bubbleButtonHover = {
    backgroundColor: '#5bbaff', // 호버 시 더 밝은 색상으로 변경
    boxShadow: '0 8px 16px rgba(0,0,0,0.1), 0 12px 20px rgba(0,0,0,0.1)', // 호버 시 더 큰 그림자 효과
    transform: 'translateY(-2px)', // 호버 시 약간 위로 움직임
  };
  
  const bubbleButtonActive = {
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)', // 클릭 시 눌리는 효과
    transform: 'translateY(1px)',
  };
  


  // 버튼의 상태를 추적하기 위한 state
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  const [showIframe, setShowIframe] = useState(false); // iframe 표시 상태 추가

  // 버튼 클릭 이벤트 핸들러
  const handleClick = () => {
    setShowIframe(!showIframe); // iframe 표시 상태 토글
    // 기타 onClick 이벤트 관련 로직이 있다면 여기에 추가
  };
  const iframeStyle = {
    position: 'fixed',
    bottom: showIframe ? '120px' : '-600px', // showIframe이 true일 때는 보이는 위치에, false일 때는 화면 밖에 위치하게 합니다.
    right: '20px',
    zIndex: 999,
    border: "2px solid black",
    transition: 'bottom 0.5s', // 부드러운 전환 효과
  };


  return (
    <>
      <button
        style={{
          ...fixedButtonStyle,
          ...(isHovered && bubbleButtonHover),
          ...(isActive && bubbleButtonActive),
        }}
        onClick={handleClick} // 클릭 이벤트 핸들러 변경
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        onTouchStart={() => setIsActive(true)}
        onTouchEnd={() => setIsActive(false)}
      >
        <img src={PriPenSvg} alt="ChatBot 버튼" style={{ width: '50px', height: 'auto' }} />
      </button>
        <p>개인정보 비서봇</p>
      {/* iframe을 조건부 렌더링 대신 항상 렌더링하되 위치를 변경합니다. */}
      <div style={iframeStyle}>
        <iframe
          src={process.env.REACT_APP_CHATBOT_URL}
          width="350"
          height="510"
          border="2px solid black"
          frameBorder="0"
          allowTransparency="true"
          allow="encrypted-media"
        ></iframe>
      </div>
    </>
  );
};

export default ChatBotBubbleButton;
