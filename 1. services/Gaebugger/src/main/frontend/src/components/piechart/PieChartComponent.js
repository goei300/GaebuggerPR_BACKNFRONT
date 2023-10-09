import React, { useRef, useState, useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';
import {  Typography } from '@mui/material';

const PieChartComponent = ({ pieData, total }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);
    const totalValue = pieData.reduce((sum, data) => {
        let additionalValue = data.value;
        if (data.label === "법률 위반") {
          additionalValue = data.value * 10;
        } else if (data.label === "법률 위반 위험") {
          additionalValue = data.value * 5;
        } else if (data.label === "작성지침 미준수") {
          additionalValue = data.value * 3;
        }
        return sum + additionalValue;
      }, 0);
      
      const remainingValue = 100 - totalValue;
      
      // 변환된 pieData 생성
      const transformedPieData = [
        ...pieData.map(data => {
          let newValue = data.value;
          if (data.label === "법률 위반") {
            newValue = data.value * 10;
          } else if (data.label === "법률 위반 위험") {
            newValue = data.value * 5;
          } else if (data.label === "작성지침 미준수") {
            newValue = data.value * 3;
          }
          return { ...data, value: newValue };
        }),
        { id:"점수", label: "나머지", value: remainingValue } // 남은 값을 추가 항목으로 추가
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
        <div ref={containerRef} style={{ display: 'flex', position: 'relative', flexDirection: 'column', alignItems: 'center', height: '450px', width: '450px', opacity: isVisible ? 1 : 0, transition: 'opacity 1s' }}>
            <Typography variant='h5' style={{ 
                        fontFamily: "NotoSansKR-SemiBold",
                        textAlign: 'center',
                        marginTop: '60px',
                        color: '#333',
                        position: 'absolute',

                    }}>
                        감점 요인
            </Typography>
            <ResponsivePie
                data={transformedPieData}
                margin={{ top: 40, right: 120, bottom: 0, left: 120 }}
                innerRadius={0.8}
                padAngle={0.7}
                cornerRadius={3}
                colors={['#d32f2f','#ff9800', '#ffeb3b', '#D9D9D9']}
                borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
                animate={true}
                motionStiffness={90}    
                motionDamping={15}
                theme={{
                    labels: {
                        fontSize: '16px', // 크기 조절
                        fontWeight: 'bold', // 볼드체 적용
                        fontFamily: 'NotoSansKR-SemiBold'
                    }
                }}
                labelSkipWidth={16}
                labelSkipHeight={16}
                labelTextColor={data => {
                    if (data.id === "전체") {
                        return '#FF0000'; // "전체"에 대한 텍스트 색상 변경
                    } else {
                        return data.color; // 나머지는 원래의 데이터 색상을 사용
                    }
                }}
                label={data => {
                    if (data.id === "전체") {
                        // "전체" 레이블에 대한 개별적 스타일 조정 (예: 폰트 크기 변경)
                        return <text style={{ fontSize: '20px' }}>{`${data.label}: ${data.value}`}</text>;
                    } else {
                        return `${data.label}: ${data.value}`;
                    }
                }}
            />
            <div style={{
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
