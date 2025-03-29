import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [cat, setCat] = useState(null);
  const [error, setError] = useState('');
  const [banList, setBanList] = useState([]);

  const fetchCat = async () => {
    try {
      for (let i = 0; i < 10; i++) {
        const res = await fetch(
          'https://api.thecatapi.com/v1/images/search?has_breeds=1&api_key=live_z4x2IF3MgnzpdoqJjjr41tuKcdpeV7L0LeGixNayENDGmVRlQuwEZCilh8BqAJZp'
        );
        const data = await res.json();
        const catData = data[0];
        const breed = catData.breeds?.[0]?.name;

        // Check against ban list
        if (!breed || !banList.includes(breed)) {
          setCat(catData);
          setError('');
          return;
        }
      }

      // If no cat found that’s not banned
      setCat(null);
      setError('No more cats available (everything is banned).');
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Something went wrong. Try again!');
    }
  };

  useEffect(() => {
    fetchCat(); // Load first cat on page load
  }, []);

  const handleBanClick = () => {
    const breed = cat?.breeds?.[0]?.name;
    if (breed && !banList.includes(breed)) {
      setBanList([...banList, breed]);
    }
  };

  const removeFromBanList = (breedToRemove) => {
    setBanList(banList.filter((b) => b !== breedToRemove));
  };

  return (
    <div className="app">
      <h1>🐱 Cat Discoverer</h1>
      <button onClick={fetchCat}>Discover</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {cat && (
        <div className="card">
          <img src={cat.url} alt="A random cat" />
          <h2 onClick={handleBanClick} className="clickable">
            Breed: {cat.breeds?.[0]?.name || 'Unknown'}
          </h2>
          <p>Origin: {cat.breeds?.[0]?.origin || 'Unknown'}</p>
          <p>Temperament: {cat.breeds?.[0]?.temperament || 'Unknown'}</p>
        </div>
      )}

      <div className="ban-list">
        <h3>🚫 Ban List</h3>
        {banList.length > 0 ? (
          banList.map((breed) => (
            <span
              key={breed}
              className="ban-item"
              onClick={() => removeFromBanList(breed)}
            >
              {breed} ❌
            </span>
          ))
        ) : (
          <p>No banned breeds yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;