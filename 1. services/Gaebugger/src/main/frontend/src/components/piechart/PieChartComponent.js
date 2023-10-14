import React, { useRef, useState, useEffect } from 'react';
import { arc } from 'd3-shape';
import { ResponsivePie } from '@nivo/pie';
import {  Typography } from '@mui/material';

const PieChartComponent = ({ pieData, total }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);

    const CustomSliceLabels = props => {
        const { dataWithArc, centerX, centerY, innerRadius, outerRadius } = props;
    
        return (
            <g transform={`translate(${centerX}, ${centerY})`}>
                {dataWithArc.map(datum => {
                    const radius = innerRadius + ((outerRadius || 100) - innerRadius) * 0.5; // 조각의 중간 지점에서 레이블을 배치
                    const angle = (datum.arc.startAngle + datum.arc.endAngle) / 2; // 중심 각도
                    console.log("Start Angle:", datum.arc.startAngle);
                    console.log("End Angle:", datum.arc.endAngle);
                    console.log("Computed Angle:", angle);
                    console.log("radius:",radius);
                    console.log("Inner Radius:", innerRadius);
                    console.log("Outer Radius:", outerRadius);
                    console.log("Computed Radius:", radius);
                    const x = Math.cos(angle - Math.PI / 2) * radius; // -Math.PI/2는 조정을 위해 사용됩니다.
                    const y = Math.sin(angle - Math.PI / 2) * radius;
                    console.log("x:", x);
                    console.log("y:", y);
                    if (datum.data.id === "점수") {
                        return (
                            <text 
                                key={datum.data.id}
                                x={x}
                                y={y}
                                style={{ fontSize: '20px', fontFamily: 'NotoSansKR-SemiBold' }}
                                textAnchor="middle"
                                dominantBaseline="central"
                            >
                                {datum.label}
                            </text>
                        );
                    } else {
                        return (
                            <text 
                                key={datum.data.id}
                                x={x}
                                y={y}
                                style={{ fontSize: '16px', fontFamily: 'NotoSansKR-Regular' }}
                                textAnchor="middle"
                                dominantBaseline="central"
                            >
                                {datum.label}
                            </text>
                        );
                    }
                })}
            </g>
        );
    };

    
    const arcGenerator = arc()
        .innerRadius(85)  // 이 값을 조절하여 도넛 차트의 내부 반지름을 설정할 수 있습니다.
        .cornerRadius(3);  // 모서리를 둥글게 만들어 줍니다.

    const totalValue = pieData.reduce((sum, data) => {
        let additionalValue = data.value;
        if (data.label === "법률 위반") {
          additionalValue = data.value * 15;
        } else if (data.label === "법률 위반 위험") {
          additionalValue = data.value * 7;
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
        <div ref={containerRef} style={{ display: 'flex', position: 'relative', flexDirection: 'column', alignItems: 'center', height: '450px', width: '450px', opacity: isVisible ? 1 : 0, transition: 'opacity 1s' }}>
            <Typography variant='h5' style={{ 
                        fontFamily: "NotoSansKR-SemiBold",
                        textAlign: 'center',
                        marginTop: '60px',
                        color: '#333',
                        position: 'absolute',

                    }}>
                        점수 분셕 결과
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
