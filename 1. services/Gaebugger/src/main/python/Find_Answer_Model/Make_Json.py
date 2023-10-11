# [답변 주기전에 약속된 JSON형태로 바꿔주는 함수]

import pandas as pd
import re

# 1> 잘린항목의 고유값 주고 모든 항목 리스트로 반환하는 함수
    # 반복문 다 돌고 (결과가 총 나오고) 계산하는 함수
def Make_Paragraph(df, text):
    paragraph_list = []

    for i in range(0, len(df)):
        paragraph = {"paragraph_id": 0, "paragraph_content": "", "paragraph_startIndex": 0, "paragraph_endIndex": 0}
        paragraph["paragraph_id"] = i
        paragraph["paragraph_content"] = df["matched_part"][i]
        startIndex = text.find(df["matched_part"][i])
        endIndex = len(df["matched_part"][i]) + startIndex
        paragraph["paragraph_startIndex"] = startIndex
        paragraph["paragraph_endIndex"] = endIndex
        paragraph_list.append(paragraph)

    print("Make_Paragraph의 최종결과입니다.", paragraph_list)
    return paragraph_list



# 각 위반한 룰별 고유값(전역변수)
issue_id=0


# 2> 위반한 이슈의 내용을 약속된 JSON형태로 정제해주는 함수
    #: 한번 결과에는 규칙1, 규칙2, 규칙 3 이게 다있음
def Make_Issues(ans, issue_paragraph_id, text):
    global issue_id

    process_Law_Violate = 0
    process_Law_Danger = 0
    process_Guide_Violate = 0

    issue = {"issue_id": 0, "issue_paragraph_id": 0, "issue_type": "", "issue_content": "", "issue_reason": "", "issue_startIndex": 0, "issue_endIndex": 0, "issue_guideline": "", "issue_goodCase": ""}
    issue_paragraph_id = issue_paragraph_id

    print("Make_Issues에 들어온 LLM의 결과입니다.", ans)

    issue_type_pattern = r'위반 유형: (.+?)\n'
    issue_content_pattern = r'규칙\d+: (.+?)\n'
    issue_text_pattern = r'위반 문장: (.+?)\n'
    issue_guideline_pattern = r"설명: (.+?)\n"



    issue_types = re.findall(issue_type_pattern, ans)
    issue_contents = re.findall(issue_content_pattern, ans)
    issue_texts = re.findall(issue_text_pattern, ans)
    issue_guideline_matches = re.findall(issue_guideline_pattern, ans)

    issue_guidelines = []
    buffer = []

    for desc in issue_guideline_matches:
        # 버퍼에 설명을 추가
        buffer.append(desc)
        # 다음 설명이 없거나 다음 설명이 '설명:'으로 시작하지 않는 경우
        if not re.search(r"설명:", ans[ans.find(desc) + len(desc):ans.find(desc) + len(desc) + 10]):
            # 버퍼의 내용을 하나의 문자열로 합치고 리스트에 추가
            issue_guidelines.append(' '.join(buffer))
            buffer = []

    issue_startIndex=[]
    issue_endIndex=[]

    for i in issue_texts:
        startIndex = text.find(i)
        endIndex = len(i) + startIndex
        issue_startIndex.append(startIndex)
        issue_endIndex.append(endIndex)

    process_Issues = []

    for issue_type, issue_content, start, end, issue_guideline, issue_text in zip(issue_types, issue_contents, issue_startIndex, issue_endIndex, issue_guidelines, issue_texts):

        print(issue_type)
        print(issue_content)
        print(start)
        print(end)
        print(issue_guideline)
        if (issue_type == '없음'):
            continue
        elif(issue_type=='법률 위반'):
            process_Law_Violate+=1
        elif(issue_type=='법률 위반 가능'):
            process_Law_Danger+=1
        elif(issue_type=='지침 미준수'):
            process_Guide_Violate+=1

        print("법률 위반", process_Law_Violate)
        print("법률 위반 가능", process_Law_Danger)
        print("지침 미준수", process_Guide_Violate)


        if((issue_type=='법률 위반') or (issue_type=='법률 위반 가능') or (issue_type=='지침 미준수')):
            if(issue_text == '없음'):
                issue["issue_startIndex"] = -999
                issue["issue_endIndex"] = -999
            else:
                issue["issue_startIndex"] = start
                issue["issue_endIndex"] = end


        issue["issue_id"] = issue_id
        issue["issue_paragraph_id"] = issue_paragraph_id
        issue["issue_type"] = issue_type
        issue["issue_content"] = issue_content
        issue["issue_guideline"] = issue_guideline

        print("issue", issue_id, "입니다.", issue)

        print("증가하는 이슈리스트", process_Issues)
        process_Issues.append(issue.copy())

        issue_id += 1  # 유니크값(고유값) 계속 증가
    return process_Issues, process_Law_Violate, process_Law_Danger, process_Guide_Violate





