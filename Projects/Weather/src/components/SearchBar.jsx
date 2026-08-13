import { useState, useEffect, useRef } from "react";
import SearchOption from "./SearchOption.jsx";
import "../styles/SearchBar.css";
import "../styles/SearchOption.css";
import magnifyingGlass from "../assets/MagnifyingGlass.png";

function SearchBar(props) {

    const [name, setName] = useState("");   
    const [places, setPlaces] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const searchRef = useRef(null);
    const optionStyle = {
        border: isOpen && (places.length > 0) ? "2px solid var(--search-border)" : "none",
        backgroundColor: isOpen && (places.length > 0) ? "var(--option-container-bg)" : "var(--bg)",
        visibility: isOpen && (places.length > 0) ? "visible" : "hidden"
    }

    let options;

    useEffect(() => {
        function handleClick(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        }
    }, [])

    function handleChange(event) {
        setName(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (name === "") return;
        try {
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${name.replaceAll(" ", "+")}&count=10&language=en&format=json`;
            const placePromise = await fetch(url); 
            const placeJson = await placePromise.json();
            placeJson.results ? setPlaces(placeJson.results) : setPlaces([]);
        }
        catch (error){
            console.log(error);
        }
        setName("");
    }   

    if (isOpen && (places.length > 0)) {
        options = places.map((place, index) => <SearchOption key={index} placeInfo={place} data={props.data} setData={props.setData} setPlaces={setPlaces}/>);
    }
    else {
        options = null;
    }


    return (
        <div ref={searchRef} onFocus={() => setIsOpen(true)} className="search-bar-component">
            <div className="search-container">
                <label className="search-label" htmlFor="search">Search for a location or zip code</label>
                <form autoComplete="off" onSubmit={handleSubmit} className="search-bar">
                    <input 
                        type="search"
                        name="text"
                        autoComplete="off"
                        value={name}
                        onChange={handleChange}
                        className="search-input"
                        aria-label="Search"
                        id="search"
                    />
                    <button type="submit" className="submit-button">
                        <img src={magnifyingGlass} className="submit-image" alt="Black magnifying glass"></img>
                    </button>
                </form>
            </div>
            <div className="option-container" style={optionStyle}>
                {options}
            </div>
        </div>
    );
}

export default SearchBar;