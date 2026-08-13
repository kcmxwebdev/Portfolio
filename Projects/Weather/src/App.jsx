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
      <footer>
        <h2>Attributions</h2>
        <ul>
          <li>
            Magnifying Glass Icon: <a href="https://www.flaticon.com/free-icons/magnifying-glass" title="magnifying glass icons" target="_blank" rel="noopener noreferrer">Royyan Wijaya - Flaticon</a>
          </li>
          <li>
            Toggle Switch: <a href="https://www.w3schools.com/howto/howto_css_switch.asp" title="View the base code for the toggle switch" target="_blank" rel="noopener noreferrer">W3Schools</a> and <a href="https://csstoggles.github.io/" title="View the toggle switches made by Vineeth T R" target="_blank" rel="noopener noreferrer">Vineeth T R</a>
          </li>
          <li>
            Weather API Data: <a href="https://open-meteo.com/" title="View Open-Meteo's APIs" target="_blank" rel="noopener noreferrer">Open-Meteo</a>
          </li>
        </ul>
      </footer>
    </>
  )
}

export default App  
