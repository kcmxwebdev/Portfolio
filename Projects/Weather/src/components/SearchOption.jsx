import "../styles/SearchOption.css";

function SearchOption(props) {

    async function handleClick() {
        const place = props.placeInfo;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,is_day&timezone=auto&forecast_days=1&temperature_unit=fahrenheit`;
        try {
            const responses = await fetch(url);
            const response = await responses.json();
            const current = response.current;
            props.setData(
                {
                    location: place.name,
                    temperature2m: current.temperature_2m,
                    apparentTemperature: current.apparent_temperature,
                    currentTime: current.time,
                    precipitation: current.precipitation,
                    humidity: current.relative_humidity_2m,
                    windSpeed: current.wind_speed_10m
                }    
            )
            props.setPlaces([]);
        }
        catch (error){
            console.log(error);
        }
    }

    return (
        <>
            <button
                type="button"
                className="search-option"
                onClick={handleClick}
            >
                {[props.placeInfo.name, props.placeInfo.admin2, props.placeInfo.admin1, props.placeInfo.country]
                .filter(Boolean)
                .join(", ")}    
            </button>
        </>
    )

}
export default SearchOption;