import pandas as pd
import config
import os
api_key = os.getenv("OPENAI_API_KEY")

# Module
from Prompt_Template import chatchain


def Answer_Model(df):
    df = df[df['matched_part'] != '']
    df.reset_index(drop=True, inplace=True)
    ans = ""
    for i in range(len(df)):
        ans += str(i+1)+">" +" " + "instuction: " + df['part'][i] + "에 해당하는 가이드라인은 이렇습니다." + "\n" + chatchain.run(
            policy=df['matched_part'][i], instruction=df['instruction'][i]) + "\n\n\n\n"
    return ans