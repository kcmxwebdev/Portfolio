import "../styles/DataDisplay.css";

function DataDisplay(props) {

    function convert24Hours(time) {
        if (typeof time !== "string") return "TIME ERROR";
        
        let [hours, minutes] = time.split(":");
        
        const meridiem = Number(hours) >= 12 ? "P.M." : "A.M.";
        hours = ((Number(hours) + 11) % 12 + 1).toString();
        return `${hours}:${minutes}\u00A0${meridiem}`;
    }

    if (props.data.location === undefined) {
        return null;
    }

    const isF = (props.temp === "°F");
    const is12H = (props.time === "12h");

    const temperature =  (isF ? (props.data.temperature2m).toFixed(2) : ((props.data.temperature2m - 32) * (5 / 9)).toFixed(2));
    const feelsLike = (isF ? (props.data.apparentTemperature).toFixed(2) : ((props.data.apparentTemperature - 32) * (5 / 9)).toFixed(2));
    const time = (is12H ? convert24Hours(((props.data.currentTime).split("T"))[1]) : (props.data.currentTime).split("T")[1]);
    const precipitation = (isF ? (props.data.precipitation / 25.4).toFixed(2): (props.data.precipitation).toFixed(2));
    const windSpeed = (isF ? (props.data.windSpeed / 1.609).toFixed(2) : (props.data.windSpeed).toFixed(2));

    const temperatureUnit = (isF ? "°F" : "°C");
    const precipitationUnit = (isF ? "in" : "mm");
    const windSpeedUnit = (isF ? "mph" : "km/h");


    return (
        <div className="data-display-component">
            <h2>{props.data.location}</h2>
            <div className="data-info">
                <p id="temperature-2m">Temperature: {temperature}{temperatureUnit}</p>
                <p id="apparent-temperature">Feels Like: {feelsLike}{temperatureUnit}</p>
                <p id="current-time">Time: {time}</p>
                <p id="precipitation">Precipitation: {precipitation}&nbsp;{precipitationUnit}</p>
                <p id="humidity">Humidity: {props.data.humidity}%</p>
                <p id="wind-speed">Wind Speed: {windSpeed}&nbsp;{windSpeedUnit}</p>
            </div>
        </div>
    )
}

export default DataDisplay;
