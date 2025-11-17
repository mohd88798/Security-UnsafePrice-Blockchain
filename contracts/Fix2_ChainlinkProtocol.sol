// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/* ---------- Chainlink Interface ---------- */
// Defines the interface for Chainlink's AggregatorV3, which provides price data.
// The `latestRoundData` function returns the latest price and related metadata.
interface IChainlinkAggregatorV3 {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,       // The round ID of the price data.
            int256 answer,        // The latest price value.
            uint256 startedAt,    // Timestamp when the round started.
            uint256 updatedAt,    // Timestamp when the round was last updated.
            uint80 answeredInRound // The round ID in which the answer was computed.
        );
}

/* ---------- Mock Chainlink Oracle (for testing) ---------- */
// A mock implementation of the Chainlink AggregatorV3 interface.
// Used for testing purposes to simulate Chainlink price behavior.
contract MockChainlink is IChainlinkAggregatorV3 {
    int256 public price; // Stores the mock price value.

    // Constructor to initialize the mock price.
    constructor(int256 _price) {
        price = _price;
    }

    // Returns mock price data. The timestamps and round IDs are simulated.
    function latestRoundData()
        external
        view
        override
        returns (
            uint80,       // Simulated round ID.
            int256,       // Mock price value.
            uint256,      // Simulated start timestamp.
            uint256,      // Simulated update timestamp.
            uint80        // Simulated answered-in-round ID.
        )
    {
        return (1, price, block.timestamp, block.timestamp, 1);
    }
}

/* ---------- FIXED Contract Using Chainlink Oracle ---------- */
// A contract that uses Chainlink's AggregatorV3 to fetch a reliable price.
// This approach ensures the use of a trusted and decentralized price feed.
contract Fix2_ChainlinkProtocol {
    IChainlinkAggregatorV3 public priceFeed; // Reference to the Chainlink price feed contract.

    // Constructor to initialize the contract with the address of a Chainlink price feed.
    constructor(address _feed) {
        priceFeed = IChainlinkAggregatorV3(_feed);
    }

    // Fetches the latest price from the Chainlink oracle.
    // This ensures the price is sourced from a trusted and decentralized oracle.
    function getSafeChainlinkPrice() public view returns (int256) {
        (, int256 safePrice, , , ) = priceFeed.latestRoundData(); // Fetch the latest price.
        return safePrice; // Return the fetched price.
    }
}
