import React, { useRef, useState, useEffect } from 'react';
import { arc } from 'd3-shape';
import { ResponsivePie } from '@nivo/pie';
import {  Typography } from '@mui/material';
import './PieChartComponent.css';
const PieChartComponent = ({ pieData, total }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);

    const totalValue = pieData.reduce((sum, data) => {
        let additionalValue = data.value;
        if (data.label === "법률 위반") {
          additionalValue = data.value * 15;
        } else if (data.label === "법률 위반 위험") {
          additionalValue = data.value * 7;
        } else if (data.label === "작성지침 미준수") {
          additionalValue = data.value * 3;
        } else if (data.label === "기재 항목 누락") {
            additionalValue = data.value;
        }
        return sum + additionalValue;
      }, 0);
      
      const remainingValue = 100 - totalValue;
      
      // 변환된 pieData 생성
      const transformedPieData = [
        ...pieData.map(data => {
          let newValue = data.value;
          if (data.label === "법률 위반") {
            newValue = data.value * 15;
          } else if (data.label === "법률 위반 위험") {
            newValue = data.value * 7;
          } else if (data.label === "작성지침 미준수") {
            newValue = data.value * 3;
          } else if(data.label === "기재 항목 누락"){
            newValue = data.value;
          }
          return { ...data, value: newValue };
        }),
        { id:"점수", label: "점수", value: remainingValue } // 남은 값을 추가 항목으로 추가
      ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        setIsVisible(true);
                    }, 500);  
                }
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 0.1
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);
    return (
        <div className="piechartComponent" ref={containerRef} style={{ display: 'flex', position: 'relative', flexDirection: 'column', alignItems: 'center', height: '450px', width: '450px', opacity: isVisible ? 1 : 0, transition: 'opacity 1s' }}>
            <Typography variant='h5' style={{ 
                        fontFamily: "NotoSansKR-SemiBold",
                        textAlign: 'center',
                        marginTop: '30px',
                        color: '#333',
                        position: 'absolute',
                        marginBottom: "20px"
                    }}>
                        점수 분석 결과
            </Typography>

            <ResponsivePie
                data={transformedPieData}
/*                 layers={[CustomSliceLabels,'slices']} */
                margin={{ top: 40, right: 120, bottom: 0, left: 120 }}
                innerRadius={0.8}
                outerRadius={100}
                padAngle={0.7}
                cornerRadius={3}
                colors={['#d32f2f','#ff9800', '#ffeb3b', '#00CC00']}
                borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
                animate={true}
                motionStiffness={90}
                motionDamping={15}

                theme={{
                    labels:{
                        text:{
                            fontFamily: "NotoSansKR-SemiBold",
                            fontSize: 15
                        }
                    }
                }}
                labelSkipWidth={16}
                labelSkipHeight={16}
            />
            <div className="allNum" style={{
                position: 'absolute',
                top: '53%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '50px',
                fontFamily: 'NotoSansKR-SemiBold',
                fontWeight: 'bold',
            }}>
                {total}건
            </div>
        </div>
    );
};

export default PieChartComponent;
