import React from 'react';
import Select from 'react-select';

const options = [
  { value: '기재', label: '기재' },
  { value: '기재안함', label: '기재안함' }
];

const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 200,     // 이 값을 조정하여 원하는 너비로 설정하세요.
      minHeight: 5,  // 최소 높이 설정
    }),
  };

  function DropdownComponent({ onChange, value, options }) {
    return (
        <Select
            options={options}
            isSearchable={false}
            placeholder="선택해주세요..."
            onChange={onChange}
            value={value}   // 현재 선택된 값을 표시하도록 설정합니다.
            styles={customStyles}
        />
    );
}

export default DropdownComponent;
