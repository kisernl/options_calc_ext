/**
 * Calculates the metrics for a cash-secured put.
 *
 * @param {number} stockPrice - Current stock price.
 * @param {number} strikePrice - Strike price of the put option.
 * @param {number} premium - Premium received for selling the put.
 * @param {number} daysToExpiration - Days until the option expires.
 * @returns {object} An object containing the calculated metrics.
 */
export const calculateCashSecuredPut = (
  stockPrice,
  strikePrice,
  premium,
  daysToExpiration
) => {
  const returnOnCapital = (premium / (strikePrice * 100)) * 100;
  const breakevenPrice = strikePrice - premium;
  const annualizedYield =
    (premium / (strikePrice * 100)) * (365 / daysToExpiration) * 100;
  let profitLossAtExpiration;

  if (stockPrice > strikePrice) {
    profitLossAtExpiration = premium;
  } else {
    profitLossAtExpiration = premium - (strikePrice - stockPrice) * 100;
  }

  return {
    returnOnCapital,
    breakevenPrice,
    annualizedYield,
    profitLossAtExpiration,
  };
};
