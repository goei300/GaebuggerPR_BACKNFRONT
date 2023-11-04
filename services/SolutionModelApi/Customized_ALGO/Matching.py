import pandas as pd

# 데이터 프레임에 Cutting 함수에서 추출한 딕셔너리 자료구조 반영
    # :해당하는 룰셋 대제목의 행에 matched_part라는 열에 매치된 파트 내용 추가

    # : 처음부터 제일위의 파트전까지는 '제목 및 서문'으로 취급한다.(제목은 무조건 있는 값임)

    # :데이터 프레임 반환


def Matching(text, result_dict, df):
    # 필터링과 정렬을 한번에 수행
    df = df[df['user_input'] == '1'].copy()

    # matched_part와 matched_startIndex를 설정
    df['matched_part'] = df['part'].apply(lambda x: result_dict.get(x, ''))
    df['matched_startIndex'] = df['matched_part'].apply(lambda x: text.find(x) if x != '' else 9999999)

    # '제목 및 서문' 처리
    title_section_index = df['matched_startIndex'].min()
    df.loc[df['part'] == "제목 및 서문", 'matched_part'] = text[:title_section_index]
    df.loc[df['part'] == "제목 및 서문", 'matched_startIndex'] = 0

    # 비어 있지 않은 matched_part를 가진 행만 필터링
    df = df[df['matched_part'] != '']

    # 최종 데이터프레임 정렬
    df.sort_values(by='matched_startIndex', inplace=True)
    df.reset_index(drop=True, inplace=True)

    return df