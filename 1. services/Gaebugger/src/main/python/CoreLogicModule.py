import pandas as pd

df = pd.read_csv("test_instruction_bob_v1.csv")
def Matching_ALGO(text):
    # 문장 단위로 토큰화
    bob_token_dict={}
    bob_token = text.split('\n')
    cumulative_length = 0
    bob_token_dict = {}
    for item in bob_token:
        bob_token_dict[item] = cumulative_length  # 현재 누적 길이를 딕셔너리에 저장
        cumulative_length += len(item)+1 

    # rule별 딕셔너리 초기화
    match_rule = {str(i): -1 for i in range(23)}

    for i in range(len(df)):
        temp = [x.strip() for x in df['keywords'][i].split(',')]
    
        # 중첩된 반복문 최적화
        for j in temp:
            matched = False
            for k, index_in_bob in bob_token_dict.items():
                if j in k:
                    print(j)
                    match_rule[str(i)] = index_in_bob
                    matched = True
                    break
            if matched:
                break

    # 딕셔너리 정렬 및 필터링 통합
    sorted_items = sorted([(k, v) for k, v in match_rule.items() if v != -1], key=lambda x: x[1])
    df['keywords_matched']=""
    for i, (num, position) in enumerate(sorted_items):
        # 마지막 요소가 아니라면 end_idx를 설정, 마지막 요소라면 bob의 끝까지
        if i != len(sorted_items) - 1:
            end_idx = sorted_items[i+1][1] - 1
        else:
            end_idx = len(text)
    
        df['keywords_matched'][int(num)] = text[position:end_idx]
    
    return df #데이터 프레임 형태로 반환

