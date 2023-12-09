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
    formData.append("process_Id", processId);

    //https://backapi.pri-pen.com/api/upload
    //http://localhost:8080/api/upload
    axios.post('http://localhost:8080/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true  // 쿠키를 포함시키기 위해 true로 설정
    })
    .then(response => {
      console.log("upload worked!!");
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
// FormData에 담긴 모든 이미지를 백엔드에 전송하고, 받은 PDF를 다운로드하는 함수
const downloadReportPdf = async (processId) => {
  try {
    // https://backapi.pri-pen.com/api/download?process_id=${processId}
    const response = await axios.get(`http://localhost:8080/api/download?process_id=${processId}`, {
      responseType: 'blob', // PDF 파일을 Blob 형태로 받기 위함
      withCredentials: true // 쿠키를 포함시키기 위해 true로 설정
    });

    // PDF 파일 다운로드 처리
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'report.pdf'); // 다운로드 파일 이름 설정
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error('Error during download:', error);
  }
};
  // const downloadImage = (canvas, filename) => {
  //   if (!canvas) return;
  //   const image = canvas.toDataURL('image/png');
  //   const downloadLink = document.createElement('a');
  //   downloadLink.href = image;
  //   downloadLink.download = `${filename}.png`;
  //   downloadLink.click();
  // };

  // const downloadAllImages = () => {
  //   Object.entries(canvases).forEach(([key, canvas]) => {
  //     downloadImage(canvas, key); // 각 캔버스에 대한 다운로드
  //   });
  // };

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
