/**
 * Calculates the metrics for a covered call.
 *
 * @param {number} stockPrice - Current stock price.
 * @param {number} strikePrice - Strike price of the call option.
 * @param {number} premium - Premium received for selling the call.
 * @param {number} shares - number of shares.
 * @returns {object} An object containing the calculated metrics.
 */
export const calculateCoveredCall = (
  stockPrice,
  strikePrice,
  premium,
  shares
) => {
  const premiumReturn = (premium / (stockPrice * shares)) * 100;
  const totalPotentialGain = premium + (strikePrice - stockPrice) * shares;
  const breakevenPrice = strikePrice - premium / shares;
  let profitLossAtExpiration;
  if (stockPrice < strikePrice) {
    profitLossAtExpiration = (stockPrice - stockPrice) * shares + premium;
  } else {
    profitLossAtExpiration = totalPotentialGain;
  }

  return {
    premiumReturn,
    totalPotentialGain,
    breakevenPrice,
    profitLossAtExpiration,
  };
};
