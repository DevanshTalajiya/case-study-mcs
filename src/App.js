// App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [weather, setWeather] = useState('');
  const [kValue, setKValue] = useState(4); // Number of nearest neighbors to consider

  // Sample dataset with city information
  const citiesData = [
    { name: 'Srinagar', latitude:34.0837 , longitude: 74.7973, season: 'Snowy' },
    { name: 'Katra', latitude:32.9915 , longitude:74.9318 , season: 'Snowy' },
    { name: 'Gulmarg', latitude:34.0484 , longitude:74.3805 , season: 'Snowy' },
    { name: 'Cherrapunji', latitude:25.2702 , longitude:91.7323 , season: 'Rainy' },
    { name: 'Mahabaleshwar', latitude:17.9307 , longitude:73.6477 , season: 'Rainy' },
    { name: 'Gangtok', latitude:27.3314 , longitude:88.6138 , season: 'Rainy' },
    { name: 'Darjeeling', latitude:27.0410 , longitude:88.2663 , season: 'Cloudy' },
    { name: 'Shillong', latitude:25.5788 , longitude:91.8933 , season: 'Cloudy' },
    { name: 'Kodaikanal', latitude:10.2391 , longitude:77.4977 , season: 'Cloudy' },
    { name: 'Hyderabad', latitude:17.4065 , longitude:78.4772 , season: 'Sunny' },
    { name: 'Ahmedabad', latitude:23.0225 , longitude:72.5714 , season: 'Sunny' },
    { name: 'Jaipur', latitude:26.9124 , longitude:75.7873 , season: 'Sunny' },
   // { name: '', latitude: , longitude: , season: 'Sunny' },
  ];

  const handleForecast = () => {
    // Convert latitude and longitude to numbers
    const userLatitude = parseFloat(latitude);
    const userLongitude = parseFloat(longitude);

    // Check if inputs are valid numbers
    if (isNaN(userLatitude) || isNaN(userLongitude)) {
      alert('Please enter valid latitude and longitude.');
      return;
    }

    // Find the k nearest cities using KNN algorithm
    const nearestCities = findNearestCities(userLatitude, userLongitude, citiesData, kValue);

    // Count the occurrences of each season among the nearest cities
    const seasonCounts = {};
    nearestCities.forEach(city => {
      const season = city.season;
      seasonCounts[season] = (seasonCounts[season] || 0) + 1;
    });

    // Find the most common season among the nearest cities
    let mostCommonSeason = '';
    let maxCount = 0;
    for (const season in seasonCounts) {
      if (seasonCounts[season] > maxCount) {
        mostCommonSeason = season;
        maxCount = seasonCounts[season];
      }
    }

    setWeather(mostCommonSeason);
  };

  // Function to calculate Euclidean distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    return Math.sqrt(dLat * dLat + dLon * dLon);
  };

  // Function to find k nearest cities using KNN algorithm
  const findNearestCities = (userLat, userLon, cities, k) => {
    const distances = [];
    cities.forEach(city => {
      const distance = calculateDistance(userLat, userLon, city.latitude, city.longitude);
      distances.push({ city, distance });
    });

    // Sort distances array by distance in ascending order
    distances.sort((a, b) => a.distance - b.distance);

    // Return the k nearest cities
    return distances.slice(0, k).map(item => item.city);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Weather Forecasting</h1>
        <div className="input-group">
          <label>City:</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Latitude:</label>
          <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Longitude:</label>
          <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Number of Neighbors (k):</label>
          <input type="number" value={kValue} onChange={(e) => setKValue(parseInt(e.target.value))} />
        </div>
        <div className="button-container">
          <button onClick={handleForecast}>Forecast</button>
        </div>
        {weather && <p className="result">Weather: {weather}</p>}
        <div className="info">
          <p>This weather forecasting application predicts the weather condition (sunny, rainy, cloudy, snowy) based on the coordinates provided by the user. Enter the city name, latitude, longitude, and the number of nearest neighbors to consider (k value) and click "Forecast" to get the prediction.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
