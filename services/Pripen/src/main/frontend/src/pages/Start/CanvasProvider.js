import React, { createContext, useState, useContext } from 'react';
import html2canvas from 'html2canvas';
import axios from 'axios';

// 캔버스 데이터를 위한 Context 생성
const CanvasContext = createContext();

// Context를 사용하기 위한 훅
export const useCanvas = () => useContext(CanvasContext);

// 캔버스 데이터와 관련된 기능을 제공하는 Provider 컴포넌트
export const CanvasProvider = ({ children }) => {
  const [canvases, setCanvases] = useState({});
  const [captured, setCaptured] = useState({}); // 각 step별 캡처 여부를 추적

  // 캔버스 캡처 함수
  const captureCanvas = async (elementId, step) => {
    const uniqueId = `${step}-${elementId}`; // 단계와 elementId의 조합으로 고유 ID 생성
    console.log("unique id is " , uniqueId);
    if (captured[uniqueId]) return;  // 이미 캡처된 경우 중복 캡처 방지
  
    try {
      const element = document.getElementById(elementId);
      if (element) {
        const canvas = await html2canvas(element, { scale: 4 });
        setCanvases(prevCanvases => ({ ...prevCanvases, [uniqueId]: canvas }));
        setCaptured(prevCaptured => ({ ...prevCaptured, [uniqueId]: true }));
      }
    } catch (error) {
      console.error('Error capturing canvas:', error);
    }
  };
  // 모든 Canvas 이미지를 FormData에 추가하는 함수
  const appendAllCanvasToFormData = async (canvases) => {
    const formData = new FormData();
    for (const [key, canvas] of Object.entries(canvases)) {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      formData.append(`files`, blob, `${key}.png`);
    }
    return formData;
  };

  // FormData에 담긴 모든 이미지를 백엔드에 전송하고, 받은 PDF를 다운로드하는 함수
  const uploadAllImagesAndPdf = async (userName,companyName,processId) => {
    const formData = await appendAllCanvasToFormData(canvases);
    
    // userName과 companyName을 formData에 추가
    formData.append("userName", userName);  // 사용자 이름에
    formData.append("companyName", companyName);  // 회사 이름
    formData.append("processId", "8d0d047e-bbff-466a-a275-b533a1bdb170");

    //https://backapi.pri-pen.com/api/upload
    //http://localhost:8080/api/upload
    axios.post('https://backapi.pri-pen.com/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true  // 쿠키를 포함시키기 위해 true로 설정
    })
    .then(response => {
      alert('업로드 잘됨'); // 오류 메시지 표시
      console.log("upload worked!!");
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  // https://backapi.pri-pen.com/api/download?process_id=${processId}
  // http://localhost:8080/api/download?process_id=${processId}
// FormData에 담긴 모든 이미지를 백엔드에 전송하고, 받은 PDF를 다운로드하는 함수
const downloadReportPdf = async (processId) => {
  try {
    const response = await axios.get(`https://backapi.pri-pen.com/api/download?process_id=${processId}`, {
      responseType: 'blob', // PDF 파일을 Blob 형태로 받기 위함
      withCredentials: true // 쿠키를 포함시키기 위해 true로 설정
    });

    if (response.data.type === "application/json") {
      // JSON 응답인 경우 (예: "좀만 기다려주세요" 메시지)
      const reader = new FileReader();
      reader.onload = function() {
        const message = JSON.parse(reader.result).message;
        alert(message); // 메시지 표시
      };
      reader.readAsText(response.data);
    } else {
      // PDF 파일 다운로드 처리
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report.pdf'); // 파일 이름 설정
      document.body.appendChild(link);
      link.click();
    }
  } catch (error) {
    console.error('Error during download:', error);
    alert('다운로드 중 오류가 발생했습니다.'); // 오류 메시지 표시
  }
};
  const contextValue = {
    canvases,
    captureCanvas,
    downloadAllImages : uploadAllImagesAndPdf, // 모든 이미지를 다운로드하는 함수
    downloadReportPdf
  };

  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
    </CanvasContext.Provider>
  );
};
