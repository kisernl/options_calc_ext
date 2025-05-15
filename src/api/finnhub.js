export const fetchStockPrice = async (symbol, apiKey) => {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${apiKey}`
    );
    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
