import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CoinList = ({ coins, onSelectCoin }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Symbol</th>
          <th>Current Price</th>
          <th>Price Change 24h</th>
          <th>Market Cap</th>
        </tr>
      </thead>
      <tbody>
        {coins.map((coin) => (
          <tr key={coin.id} onClick={() => onSelectCoin(coin)}>
            <td>
              <img src={coin.image} alt={coin.name} />
            </td>
            <td>{coin.name}</td>
            <td>{coin.symbol}</td>
            <td>{coin.currentPrice}</td>
            <td>{coin.priceChange24h}%</td>
            <td>{coin.marketCap}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const CoinModal = ({ coin, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{coin.name}</h2>
        <p>Symbol: {coin.symbol}</p>
        <p>Current Price: {coin.currentPrice}</p>
        <p>Price Change 24h: {coin.priceChange24h}</p>
        <p>Total Volume: {coin.totalVolume}</p>
        <p>Low 24h: {coin.low24h}</p>
        <p>High 24h: {coin.high24h}</p>
        <p>Total Supply: {coin.totalSupply}</p>
        <p>Max Supply: {coin.maxSupply}</p>
        <p>Circulating Supply: {coin.circulatingSupply}</p>
        <p>All Time High (ath): {coin.ath}</p>
        <p>Last Updated: {coin.lastUpdated}</p>
      </div>
    </div>
  );
};

const SinglePage = () => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currency, setCurrency] = useState('INR');

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}`
      );
      const data = response.data.map((coin) => ({
        id: coin.id,
        image: coin.image,
        name: coin.name,
        symbol: coin.symbol,
        currentPrice: coin.current_price,
        priceChange24h: coin.price_change_percentage_24h,
        marketCap: coin.market_cap,
        totalVolume: coin.total_volume,
        low24h: coin.low_24h,
        high24h: coin.high_24h,
        totalSupply: coin.total_supply,
        maxSupply: coin.max_supply,
        circulatingSupply: coin.circulating_supply,
        ath: coin.ath,
        lastUpdated: coin.last_updated,
      }));
      setCoins(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currency]);

  const handleSelectCoin = (coin) => {
    setSelectedCoin(coin);
  };

  const handleCloseModal = () => {
    setSelectedCoin(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCoins = filteredCoins.sort((a, b) => {
    const aValue = parseFloat(a.marketCap);
    const bValue = parseFloat(b.marketCap);
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return (
    <div>
      <div>
        <label htmlFor="search">Search:</label>
        <input type="text" id="search" value={searchTerm} onChange={handleSearch} />
      </div>
      <div>
        <label htmlFor="sort">Sort by Market Cap:</label>
        <button id="sort" onClick={handleSort}>
          {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
        </button>
      </div>
      <div>
        <label htmlFor="currency">Currency:</label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>
      <CoinList coins={sortedCoins} onSelectCoin={handleSelectCoin} />
      {selectedCoin && <CoinModal coin={selectedCoin} onClose={handleCloseModal} />}
    </div>
  );
};

export default SinglePage;
