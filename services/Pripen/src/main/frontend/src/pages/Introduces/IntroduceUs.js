import React,{useState} from "react";
import './IntroduceUs.css';
import OptionIntro from "../../components/OptionIntro/OptionIntro";
const IntroduceUs = () => {
    
    const [selectedOption, setSelectedOption] = useState("team"); 

    const handleOptionChange =(option) =>{
        setSelectedOption(option);
    };
    

    return (
        <OptionIntro handleOptionChange={handleOptionChange} selectedOption={selectedOption}/>
    )

};

export default IntroduceUs;