
def Cutting(text, title_dict, title_dict2):
    part_dict = {}
    part_dict = {key: '' for key in title_dict}

    for key in part_dict:
        index = text.find(key)
        part_dict[key] = index
    part_dict = dict(sorted(part_dict.items(), key=lambda item: item[1]))
    result_dict = {key: part_dict[value] for key, value in title_dict2.items()}

    keys = list(result_dict.keys())
    for i in range(len(keys)):
        # 마지막 키인 경우 텍스트 끝까지 자른다.
        if i == len(keys) - 1:
            result_dict[keys[i]] = text[result_dict[keys[i]]:]
        else:
            # 그 외의 경우 다음 인덱스까지 자른다.
            result_dict[keys[i]] = text[result_dict[keys[i]]:result_dict[keys[i + 1]]]
    return result_dict