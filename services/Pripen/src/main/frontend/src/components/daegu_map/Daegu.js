import React,{useState,useEffect} from "react";

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
};
const Daegu = () => {
    const [width, height] = useWindowSize();
    return (
        <iframe
            src={process.env.REACT_APP_MAP_URL}
            style={{
                width: width > 768 ? '1200px' : '100%', // 768px 이상인 경우 400px, 미만인 경우 전체 너비
                height: width > 768 ? '1400px' : '300px', // 768px 이상인 경우 550px, 미만인 경우 300px
                border: '2px solid #d9d9d9',
                marginRight: '30px',
                borderRadius: '20px',
                frameBorder: '0',
                allowTransparency: 'true',
                allow: 'encrypted-media',
                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)' // 여기에 그림자 스타일을 추가합니다.
            }}
        ></iframe>

    )

};

export default Daegu;