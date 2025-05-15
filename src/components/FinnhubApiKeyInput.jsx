import React, { useState, useEffect } from "react";

const FinnhubApiKeyInput = ({ onApiKeySaved }) => {
  const [apiKey, setApiKey] = useState("");
  const [savedApiKey, setSavedApiKey] = useState("");
  const [error, setError] = useState(null);

  // Load API key from storage on component mount
  useEffect(() => {
    chrome.storage.local.get("finnhubApiKey", (result) => {
      if (result.finnhubApiKey) {
        setSavedApiKey(result.finnhubApiKey);
        onApiKeySaved(result.finnhubApiKey);
      }
    });
  }, [onApiKeySaved]);

  // Function to save the API key
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      chrome.storage.local.set({ finnhubApiKey: apiKey.trim() }, () => {
        setSavedApiKey(apiKey.trim());
        onApiKeySaved(apiKey.trim()); // Pass the key to the parent
        setApiKey(""); // Clear the input field after saving
        setError(null);
      });
    } else {
      setError("Please enter a valid API key.");
    }
  };

  return (
    <div>
      {savedApiKey ? (
        <p className="text-green-600 text-center mb-4">API Key is saved.</p>
      ) : (
        <p className="text-gray-700 text-center mb-4">
          Enter your Finnhub.io API Key:
        </p>
      )}
      {!savedApiKey && (
        <div className="mb-4">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Your Finnhub API Key"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      )}
      {!savedApiKey && (
        <button
          onClick={handleSaveApiKey}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
        >
          Save API Key
        </button>
      )}
      {error && (
        <div className="mt-4 text-center text-red-500">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default FinnhubApiKeyInput;
