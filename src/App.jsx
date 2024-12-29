import { useState } from 'react';
import './App.css';

function App() {
  const [catImage, setCatImage] = useState(null);
  const [catBreed, setCatBreed] = useState('N/A');
  const [catWeight, setCatWeight] = useState('N/A');
  const [catLocation, setCatLocation] = useState('N/A');
  const [catLifespan, setCatLifespan] = useState('N/A');
  const [banList, setBanList] = useState([]);

  const isBannedAttribute = (breedInfo) => {
    return banList.includes(breedInfo.name) || 
           banList.includes(breedInfo.weight.metric + " kg") ||
           banList.includes(breedInfo.origin) ||
           banList.includes(breedInfo.life_span + " years");
  };

  const fetchRandomCatImage = async () => {
    const apiKey = "live_O6ipuhAOKZvygYJER0iIifVk5myr6IaYhqCHKiW5HEFCXv1H6RTz1wrTvwnDbb6P";
    try {
      let fetchedData = null;
      while (!fetchedData) {
        console.log('Fetching an image with breed info...');
        const response = await fetch('https://api.thecatapi.com/v1/images/search?limit=1&has_breeds=1', {
          headers: {
            'x-api-key': apiKey,
          },
        });
        const data = await response.json();
        if (data.length > 0 && data[0].breeds.length > 0) {
          const breedInfo = data[0].breeds[0];
          if (!isBannedAttribute(breedInfo)) {
            fetchedData = data[0];
          }
        }
      }

      // Once we have data where no attribute is banned, update the state
      const breedInfo = fetchedData.breeds[0];
      setCatImage(fetchedData.url);
      setCatBreed(breedInfo.name);
      setCatWeight(breedInfo.weight.metric ? `${breedInfo.weight.metric} kg` : 'N/A');
      setCatLocation(breedInfo.origin);
      setCatLifespan(breedInfo.life_span ? `${breedInfo.life_span} years` : 'N/A');
      
    } catch (error) {
      console.error('Error fetching random cat image:', error);
    }
  };

  const addToBanList = (attribute) => {
    if (attribute && !banList.includes(attribute)) {
      setBanList((currentBanList) => [...currentBanList, attribute]);
    }
  };

  return (
    <div className="App">
      <h1>Purrfect Kitty Parade 🐾</h1>
      <div className="attributes">
        <button onClick={() => addToBanList(catBreed)} className="attribute-button">{catBreed}</button>
        <button onClick={() => addToBanList(catWeight)} className="attribute-button">{catWeight}</button>
        <button onClick={() => addToBanList(catLocation)} className="attribute-button">{catLocation}</button>
        <button onClick={() => addToBanList(catLifespan)} className="attribute-button">{catLifespan}</button>
      </div>
      {catImage && <img src={catImage} alt="Random Cat" className="cat-image" />}
      <button onClick={fetchRandomCatImage} className="random-cat-button">Unleash the Cuteness! ✨</button>
      <div className="ban-list">
        <h2>Ban List</h2>
        <ul>
          {banList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
