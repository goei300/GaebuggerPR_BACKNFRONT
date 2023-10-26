from .Answer_Model import Answer_Model
# 나중에 상속, CoT_SC으로 바꾸기
def Answer_CoT_SC(df, text):
    return Answer_Model(df, text)