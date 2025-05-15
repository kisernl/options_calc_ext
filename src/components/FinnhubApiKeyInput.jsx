import React, { useState, useEffect } from "react";

const FinnhubApiKeyInput = () => {
  const [apiKey, setApiKey] = useState("");
  const [savedApiKey, setSavedApiKey] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const result = await chrome.storage.local.get("finnhubApiKey");
        if (result.finnhubApiKey) {
          setSavedApiKey(result.finnhubApiKey);
          setApiKey(result.finnhubApiKey);
        }
      } catch (err) {
        setError("Failed to load API key from storage.");
        console.error(err);
      }
    };
    loadApiKey();
  }, []);

  const handleSaveApiKey = async () => {
    setIsLoading(true);
    setError("");
    if (!apiKey.trim()) {
      setError("API Key cannot be empty.");
      setIsLoading(false);
      return;
    }

    try {
      await chrome.storage.local.set({ finnhubApiKey: apiKey });
      setSavedApiKey(apiKey);
      setApiKey("");
    } catch (err) {
      setError("Failed to save API key.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetApiKey = async () => {
    setIsLoading(true);
    setError("");
    try {
      await chrome.storage.local.remove("finnhubApiKey");
      setSavedApiKey("");
    } catch (err) {
      setError("Failed to reset API key.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Enter your Finnhub API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="input w-full"
          disabled={isLoading}
        />
        <div className="flex gap-2">
          <button
            onClick={handleSaveApiKey}
            disabled={isLoading}
            className="btn btn-primary font-bold py-2 px-4 rounded"
          >
            {isLoading ? "Saving..." : "Save API Key"}
          </button>
          <button
            onClick={handleResetApiKey}
            disabled={isLoading || !savedApiKey}
            className="btn btn-outline font-bold py-2 px-4 rounded"
          >
            {isLoading ? "Resetting..." : "Reset API Key"}
          </button>
        </div>
      </div>
      {savedApiKey ? (
        <p className="text-green-600 text-center mb-4">API Key is saved.</p>
      ) : (
        <p className="text-gray-700 text-center mb-4">
          Please enter your Finnhub API Key.
        </p>
      )}
      {error && (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l6-6m0 0l-6-6m6 6H9"
            />
          </svg>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </div>
      )}
    </div>
  );
};

export default FinnhubApiKeyInput;
