import React, { createContext, useState, useContext } from 'react';
import html2canvas from 'html2canvas';

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
    if (captured[step]?.includes(elementId)) return;  // 해당 step에서 이미 캡처됐다면 중복 캡처 방지

    try {
      const element = document.getElementById(elementId);
      if (element) {
        const canvas = await html2canvas(element);
        setCanvases(prevCanvases => ({ ...prevCanvases, [elementId]: canvas }));
        setCaptured(prevCaptured => ({
          ...prevCaptured,
          [step]: [...(prevCaptured[step] || []), elementId]
        }));
      }
    } catch (error) {
      console.error('Error capturing canvas:', error);
    }
  };
  const mergeCanvases = () => {
    // 캔버스가 없을 경우
    if (Object.keys(canvases).length === 0) {
      return null;
    }

    const mergedCanvas = document.createElement('canvas');
    const context = mergedCanvas.getContext('2d');

    let totalHeight = 0;
    let maxWidth = 0;

    Object.values(canvases).forEach(canvas => {
      totalHeight += canvas.height;
      maxWidth = Math.max(maxWidth, canvas.width);
    });

    mergedCanvas.width = maxWidth;
    mergedCanvas.height = totalHeight;

    let currentY = 0;
    Object.values(canvases).forEach(canvas => {
      context.drawImage(canvas, 0, currentY);
      currentY += canvas.height;
    });

    return mergedCanvas;
  };

  const downloadMergedImage = () => {
    const mergedCanvas = mergeCanvases();
    if (!mergedCanvas) return;

    const image = mergedCanvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = image;
    downloadLink.download = 'mergedCanvas.png';
    downloadLink.click();
  };

  const contextValue = {
    canvases,
    captureCanvas,
    downloadMergedImage  // 다운로드 함수를 컨텍스트 값에 추가
  };

  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
    </CanvasContext.Provider>
  );
};
