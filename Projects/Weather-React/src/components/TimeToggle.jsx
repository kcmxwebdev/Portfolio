function TimeToggle(props) {

    function handleChange(event) {
        props.setTime(event.target.value);
    }


    return (
        <>
            <label>
                <select type="drop" id="select-temp" onChange={handleChange}>
                    <option className="dropdown-option" value="12h" >12h</option>
                    <option className="dropdown-option" value="24h" >24h</option>
                </select>
            </label>
        </>
    )
}

export default TimeToggle;