// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interface for a price feed contract
interface IPriceFeed { 
    function getLatestPrice() external view returns (int); 
}

// Mock implementation of the IPriceFeed interface
// This is used for testing purposes and allows setting a price manually
contract MockPriceFeed is IPriceFeed {
    int public price; // Stores the current price

    // Constructor to initialize the price
    constructor(int _initialPrice) { 
        price = _initialPrice; 
    }

    // Returns the latest price
    function getLatestPrice() external view returns (int) { 
        return price; 
    }

    // Allows updating the price manually
    function setPrice(int _newPrice) public { 
        price = _newPrice; 
    }
}

// Vulnerable lending contract
// This contract allows borrowing Ether based on a price feed, but lacks proper security checks
contract VulnerableLending {
    address public owner; // Address of the contract owner
    IPriceFeed public priceFeed; // Reference to the price feed contract

    // Constructor to initialize the contract with a price feed address
    constructor(address _priceFeed) payable {
        owner = msg.sender; // Set the deployer as the owner
        priceFeed = IPriceFeed(_priceFeed); // Set the price feed contract
    }

    // Fallback function to accept Ether
    receive() external payable {}

    // Function to borrow Ether
    // This function is vulnerable because it does not check for collateral or other security measures
    function borrow(uint256 amount) public {
        int price = priceFeed.getLatestPrice(); // Get the latest price from the price feed
        require(price > 0, "Price must be positive"); // Ensure the price is valid

        // Vulnerability: No collateral checks, directly sends the requested amount
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Failed to send Ether"); // Ensure the transfer was successful
    }

    // Function for the owner to withdraw Ether from the contract
    function ownerWithdraw(uint256 amount) public {
        require(msg.sender == owner, "Only owner"); // Ensure only the owner can withdraw
        (bool success, ) = owner.call{value: amount}(""); // Transfer the requested amount to the owner
        require(success, "Withdraw failed"); // Ensure the transfer was successful
    }
}
