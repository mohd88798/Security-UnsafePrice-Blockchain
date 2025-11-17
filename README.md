# Oracle Security Demonstration (Vulnerable + Two Fixes)

This project demonstrates:
1. A **vulnerable lending protocol** that uses an unprotected on-chain oracle.
2. **Fix #1: TWAP Oracle (Time-Weighted Average Price)**
3. **Fix #2: Chainlink Decentralized Oracle Network**

All three versions run independently using simple commands.

# How to Run

Follow these steps exactly:

## 1️⃣ Install Dependencies
Run this once after downloading/cloning the project, in root folder:

npm install 

## 2️⃣ Run the Vulnerable Version (Attack Demo)
This simulates price manipulation and drains the lending contract.

npm run vulnerable

## 3️⃣ Run Fix #1 (TWAP Oracle)
Uses a Time-Weighted Average Price oracle to prevent manipulation.

npm run fix1

## 4️⃣ Run Fix #2 (Chainlink Oracle)
Uses a decentralized off-chain aggregated oracle (Chainlink-style).

npm run fix2
