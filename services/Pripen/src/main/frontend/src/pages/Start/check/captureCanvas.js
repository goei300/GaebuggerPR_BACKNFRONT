import html2canvas from "html2canvas";

let capturedCanvasData = [];

export const captureCanvas = async (elementId) => {
  try {
    const element = document.getElementById(elementId);
    if (element) {
      const canvas = await html2canvas(element);
      capturedCanvasData.push({ id: elementId, canvas: canvas });
      return canvas;
    } else {
      console.error(`Element with ID ${elementId} not found.`);
    }
  } catch (error) {
    console.error('Error capturing canvas:', error);
  }
};

// 캡처된 캔버스 데이터를 가져오는 함수
export const getCapturedCanvasData = () => capturedCanvasData;

// 캔버스 데이터를 초기화하는 함수
export const clearCapturedCanvasData = () => {
  capturedCanvasData = [];
};
