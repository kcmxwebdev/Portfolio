import "../styles/SwitchToggle.css";
import { useRef } from "react";

function SwitchToggle({onChange, leftLabel, rightLabel, checked}) {

    const checkboxRef = useRef(null);

    function handleChange(event) {
        onChange(event.target.checked ? rightLabel : leftLabel);    
    }

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            checkboxRef.current.click();
        }
    }


    return (
        <label className="switch">
            <input type="checkbox" onChange={handleChange} onKeyDown={handleKeyDown} checked={checked} ref={checkboxRef} className="checkbox"/>
            <span className="label left">{leftLabel}</span>
            <span className="label right">{rightLabel}</span>
            <span className="slider"></span>
        </label>
    )
}

export default SwitchToggle;