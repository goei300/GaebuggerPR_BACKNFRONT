import sys
import os
sys.path.append("C://Users//scw10//PycharmProjects//rest_test//venv//config")
import config
api_key = os.getenv("OPENAI_API_KEY")

# Module
from .Rule_Validation.Rule_Validation import checking_list
from .Search_Title import Search_Title, Search_Unique_Title, Make_Unique_Title

def Search_ToT(documents, docs, rule):

    title_list = Search_Title(documents, docs, rule)
    unique_title_list = Make_Unique_Title(title_list)

    return title_list, unique_title_list

