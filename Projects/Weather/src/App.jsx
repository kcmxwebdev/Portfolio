import { useState } from 'react';
import SwitchToggle from './components/SwitchToggle';
import TimeToggle from './components/TimeToggle';
import SearchBar from './components/SearchBar';
import DataDisplay from './components/DataDisplay';
import './App.css';

function App(props) {

  const [weatherData, setWeatherData] = useState(props.weatherData);
  const [temperatureScale, setTemperatureScale] = useState("°F");
  const [timeScale, setTimeScale] = useState("12h");



  return (
    <>
      <header>
        <h1>Weather App</h1>
      </header>
      <main>
        <SwitchToggle 
          onChange={setTemperatureScale} 
          leftLabel={"°F"} 
          rightLabel={"°C"} 
          checked={temperatureScale === "°C"}
        />
        <SwitchToggle 
          onChange={setTimeScale} 
          leftLabel={"12h"} 
          rightLabel={"24h"} 
          checked={timeScale === "24h"}
        />
        <SearchBar data={weatherData} setData={setWeatherData}/>
        <DataDisplay data={weatherData} temp={temperatureScale} time={timeScale}/>
      </main>
    </>
  )
}

export default App  
