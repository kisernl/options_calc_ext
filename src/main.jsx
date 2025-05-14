import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <div className="bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-blue-600 text-center mb-4">
          Options Calculator
        </h1>
        <p className="text-gray-700 text-center mb-4">
          Welcome! This is a React App.
        </p>
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
            placeholder="e.g., AAPL"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Calculate
        </button>
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold">Results will appear here.</p>
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
