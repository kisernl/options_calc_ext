import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { fetchStockPrice } from "./api/finnhub";
import { calculateCashSecuredPut } from "./calculators/putCalculator";
import { calculateCoveredCall } from "./calculators/callCalculator";
import FinnhubApiKeyInput from "./components/FinnhubApiKeyInput";

const App = () => {
  const [apiKey, setApiKey] = useState("");
  const [stockSymbol, setStockSymbol] = useState("");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [error, setError] = useState(null);
  const [putParams, setPutParams] = useState({
    strikePrice: 0,
    premium: 0,
    daysToExpiration: 0,
  });
  const [callParams, setCallParams] = useState({
    strikePrice: 0,
    premium: 0,
    shares: 100,
  });
  const [putResults, setPutResults] = useState(null);
  const [callResults, setCallResults] = useState(null);

  const handleApiKeySaved = (key) => {
    setApiKey(key);
  };

  const handleFetchStockPrice = async () => {
    if (!apiKey) {
      setError("Please enter and save your Finnhub API key first.");
      return;
    }

    if (!stockSymbol.trim()) {
      setError("Please enter a stock symbol.");
      return;
    }

    setError(null);
    try {
      const data = await fetchStockPrice(stockSymbol, apiKey);
      if (data && data.c) {
        setCurrentPrice(data.c);
      } else {
        setCurrentPrice(null);
        setError(
          "Could not retrieve stock price. Check the symbol and API key."
        );
      }
    } catch (err) {
      setError(err.message);
      setCurrentPrice(null);
    }
  };

  const handlePutInputChange = (e) => {
    setPutParams({
      ...putParams,
      [e.target.name]: parseFloat(e.target.value) || 0,
    });
  };

  const handleCallInputChange = (e) => {
    setCallParams({
      ...callParams,
      [e.target.name]: parseFloat(e.target.value) || 0,
    });
  };

  const calculatePut = () => {
    if (currentPrice === null) {
      setError("Please get the current stock price first");
      return;
    }
    const results = calculateCashSecuredPut(
      currentPrice,
      putParams.strikePrice,
      putParams.premium,
      putParams.daysToExpiration
    );
    setPutResults(results);
  };

  const calculateCall = () => {
    if (currentPrice === null) {
      setError("Please get the current stock price first");
      return;
    }
    const results = calculateCoveredCall(
      currentPrice,
      callParams.strikePrice,
      callParams.premium,
      callParams.shares
    );
    setCallResults(results);
  };

  return (
    <div className="bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-blue-600 text-center mb-4">
          Options Calculator
        </h1>
        <FinnhubApiKeyInput onApiKeySaved={handleApiKeySaved} />

        <div className="mb-4">
          <label
            htmlFor="stockSymbol"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Stock Symbol:
          </label>
          <input
            type="text"
            id="stockSymbol"
            value={stockSymbol}
            onChange={(e) => setStockSymbol(e.target.value)}
            placeholder="e.g., AAPL"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          onClick={handleFetchStockPrice}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Get Price
        </button>
        {currentPrice !== null && (
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold">
              Current Price: {currentPrice}
            </p>
          </div>
        )}
        {error && (
          <div className="mt-4 text-center text-red-500">
            <p>{error}</p>
          </div>
        )}

        {/* Cash Secured Put Calculator */}
        <div className="mt-8 p-4 border rounded-md">
          <h2 className="text-xl font-semibold mb-4">Cash Secured Put</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Strike Price:
            </label>
            <input
              type="number"
              name="strikePrice"
              onChange={handlePutInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Premium:
            </label>
            <input
              type="number"
              name="premium"
              onChange={handlePutInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Days to Expiration:
            </label>
            <input
              type="number"
              name="daysToExpiration"
              onChange={handlePutInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            onClick={calculatePut}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Calculate Put
          </button>

          {putResults && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Results:</h3>
              <p>Return on Capital: {putResults.returnOnCapital.toFixed(2)}%</p>
              <p>Breakeven Price: {putResults.breakevenPrice.toFixed(2)}</p>
              <p>Annualized Yield: {putResults.annualizedYield.toFixed(2)}%</p>
              <p>
                Profit/Loss at Expiration:{" "}
                {putResults.profitLossAtExpiration.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        {/* Covered Call Calculator */}
        <div className="mt-8 p-4 border rounded-md">
          <h2 className="text-xl font-semibold mb-4">Covered Call</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Strike Price:
            </label>
            <input
              type="number"
              name="strikePrice"
              onChange={handleCallInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Premium:
            </label>
            <input
              type="number"
              name="premium"
              onChange={handleCallInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Shares:
            </label>
            <input
              type="number"
              name="shares"
              onChange={handleCallInputChange}
              value={callParams.shares}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            onClick={calculateCall}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Calculate Call
          </button>

          {callResults && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Results:</h3>
              <p>Premium Return: {callResults.premiumReturn.toFixed(2)}%</p>
              <p>
                Total Potential Gain:{" "}
                {callResults.totalPotentialGain.toFixed(2)}
              </p>
              <p>Breakeven Price: {callResults.breakevenPrice.toFixed(2)}</p>
              <p>
                Profit/Loss at Expiration:{" "}
                {callResults.profitLossAtExpiration.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
