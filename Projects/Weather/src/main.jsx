import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const DATA = {
  location: undefined,
  temperature2m: undefined,
  apparentTemperature: undefined,
  currentTime: undefined,
  precipitation: undefined,
  humidity: undefined,
  windSpeed: undefined
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App weatherData={DATA}/>
  </StrictMode>,
)
