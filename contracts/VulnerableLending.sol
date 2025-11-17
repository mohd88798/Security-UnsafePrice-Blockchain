// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/* ---------- Oracle Interface ---------- */
// Defines the interface for a price feed oracle.
// Any contract implementing this interface must provide the latest price.
interface IPriceFeed {
    function getLatestPrice() external view returns (int);
}

/* ---------- Mock Price Feed Contract ---------- */
// A mock implementation of the IPriceFeed interface.
// This contract allows setting and retrieving a price, making it useful for testing.
contract MockPriceFeed is IPriceFeed {
    int public price; // Stores the current price.

    // Constructor to initialize the price.
    constructor(int _initialPrice) {
        price = _initialPrice;
    }

    // Returns the latest price.
    function getLatestPrice() external view returns (int) {
        return price;
    }

    // Allows updating the price. This is insecure in a real-world scenario.
    function setPrice(int _newPrice) external {
        price = _newPrice;
    }
}

/* ---------- Vulnerable Lending Contract ---------- */
// A lending contract that relies on an external price feed for its operations.
// This contract contains a critical vulnerability due to lack of collateral checks.
contract VulnerableLending {
    IPriceFeed public priceFeed; // Reference to the price feed oracle.

    // Constructor to initialize the contract with the address of a price feed oracle.
    constructor(address _oracle) payable {
        priceFeed = IPriceFeed(_oracle);
    }

    // Fallback function to accept Ether deposits.
    receive() external payable {}

    // Allows users to borrow Ether based on the price feed.
    function borrow(uint256 amount) public {
        int price = priceFeed.getLatestPrice(); // Fetch the latest price from the oracle.
        require(price > 0, "Invalid price"); // Ensure the price is valid (greater than 0).

        // ⚠️ Vulnerability: No collateral check is performed here.
        // The contract blindly trusts the price feed and allows borrowing without security.

        (bool ok, ) = payable(msg.sender).call{value: amount}(""); // Transfer Ether to the borrower.
        require(ok, "Transfer failed"); // Ensure the transfer was successful.
    }
}
