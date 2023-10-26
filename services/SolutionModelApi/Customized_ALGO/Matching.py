import pandas as pd

# 데이터 프레임에 Cutting 함수에서 추출한 딕셔너리 자료구조 반영
    # :해당하는 룰셋 대제목의 행에 matched_part라는 열에 매치된 파트 내용 추가
    # :데이터 프레임 반환
def Matching(text, result_dict, df):
    df['matched_part'] = ''
    df['matched_startIndex']=9999999
    for key, value in result_dict.items():
        df.loc[df['part'] == key, 'matched_part'] = value
        df.loc[df['part'] == key, 'matched_startIndex'] = text.find(value)

    return df