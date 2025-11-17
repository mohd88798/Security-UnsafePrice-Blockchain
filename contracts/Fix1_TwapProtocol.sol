// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/* ---------- TWAP Oracle Interface ---------- */
// Interface for a Time-Weighted Average Price (TWAP) oracle.
// Provides a method to fetch the average price over a specified time interval.
interface IUniswapV3TwapOracle {
    function getAveragePrice(uint32 secondsAgo) external view returns (int256);
}

/* ---------- Mock TWAP Oracle (for testing) ---------- */
// A mock implementation of the TWAP oracle interface.
// Used for testing purposes to simulate TWAP price behavior.
contract MockTwapOracle is IUniswapV3TwapOracle {
    int256 public twapPrice; // Stores the mock TWAP price.

    // Constructor to initialize the mock TWAP price.
    constructor(int256 _price) {
        twapPrice = _price;
    }

    // Returns the mock TWAP price. The `secondsAgo` parameter is ignored in this mock.
    function getAveragePrice(uint32)
        external
        view
        override
        returns (int256)
    {
        return twapPrice;
    }
}

/* ---------- FIXED Contract Using TWAP ---------- */
// A contract that uses a TWAP oracle to fetch a safe price.
// This approach mitigates price manipulation by relying on a time-weighted average.
contract Fix1_TwapProtocol {
    IUniswapV3TwapOracle public twapOracle; // Reference to the TWAP oracle contract.

    // Constructor to initialize the contract with the address of a TWAP oracle.
    constructor(address _oracle) {
        twapOracle = IUniswapV3TwapOracle(_oracle);
    }

    // Fetches the TWAP price over a 30-minute interval (1800 seconds).
    // This ensures the price is less susceptible to short-term manipulation.
    function getSafeTwapPrice() public view returns (int256) {
        uint32 interval = 1800; // Time interval in seconds (30 minutes).
        return twapOracle.getAveragePrice(interval);
    }
}
