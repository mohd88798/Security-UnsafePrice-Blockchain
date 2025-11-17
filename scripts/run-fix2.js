const hre = require("hardhat");

async function main() {
  console.log("=== Fix #2: Chainlink Oracle Demo ===\n");

  // signer info
  const [deployer] = await hre.ethers.getSigners();
  console.log("Account:");
  console.log(" Deployer:", deployer.address);

  // Deploy mock Chainlink oracle
  console.log("\n--- Deploying Mock Chainlink Oracle ---");
  const ChainMock = await hre.ethers.getContractFactory("MockChainlink");
  const chainlinkOracle = await ChainMock.deploy(1500); // mock Chainlink price = 1500
  await chainlinkOracle.deployed();
  console.log("MockChainlink deployed at:", chainlinkOracle.address);
  console.log("Initial Chainlink mock price:", "1500");

  // Deploy the Chainlink-based fixed contract
  console.log("\n--- Deploying Fix2_ChainlinkProtocol ---");
  const CH = await hre.ethers.getContractFactory("Fix2_ChainlinkProtocol");
  const chainlinkContract = await CH.deploy(chainlinkOracle.address);
  await chainlinkContract.deployed();
  console.log("Fix2_ChainlinkProtocol deployed at:", chainlinkContract.address);

  // Read safe Chainlink price
  console.log("\n--- Reading safe price from Fix2_ChainlinkProtocol ---");
  const safePrice = await chainlinkContract.getSafeChainlinkPrice();
  console.log("Safe Chainlink Price (returned):", safePrice.toString());

  console.log("\n=== Demo complete: Chainlink fix functioning as expected ===");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
