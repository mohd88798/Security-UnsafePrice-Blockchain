const hre = require("hardhat");

async function main() {
  console.log("=== Fix #1: TWAP Oracle Demo ===\n");

  // signer info
  const [deployer] = await hre.ethers.getSigners();
  console.log("Account:");
  console.log(" Deployer:", deployer.address);

  // Deploy mock TWAP oracle
  console.log("\n--- Deploying Mock TWAP Oracle ---");
  const TwapMock = await hre.ethers.getContractFactory("MockTwapOracle");
  const twapOracle = await TwapMock.deploy(1200); // mock TWAP price = 1200
  await twapOracle.deployed();
  console.log("MockTwapOracle deployed at:", twapOracle.address);
  console.log("Initial TWAP value (mock):", "1200");

  // Deploy the TWAP-based fixed contract
  console.log("\n--- Deploying Fix1_TwapProtocol ---");
  const TWAP = await hre.ethers.getContractFactory("Fix1_TwapProtocol");
  const twapContract = await TWAP.deploy(twapOracle.address);
  await twapContract.deployed();
  console.log("Fix1_TwapProtocol deployed at:", twapContract.address);

  // Read safe TWAP price (interval is 1800 seconds inside contract)
  console.log("\n--- Reading safe TWAP price from Fix1_TwapProtocol ---");
  const safePrice = await twapContract.getSafeTwapPrice();
  console.log("TWAP interval (seconds):", 1800);
  console.log("Safe TWAP Price (returned):", safePrice.toString());

  console.log("\n=== Demo complete: TWAP fix functioning as expected ===");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
