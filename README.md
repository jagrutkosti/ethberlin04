# EthBerlin 04 - Proof-of-Usage for distributing voting power to the users of the protocol

Human co-ordination is a hard problem to solve! Web3 has been experimenting with it in different contexts and we believe incremental changes are what is going to make it better over time. With each iteration of implementation, we identify new problems and try to tackle them.

### Problem Statement

For current governance structures in Web3, how much voting power to grant to someone is really important! *We don't want whales buying into the governance proposals.* Several factors determine how much should someone be granted with voting power be it via fungible tokens or Soulbound tokens (SBTs). Some factors are:

1. Protocol contributions
    - Code
    - Social identity build up / Communication
    - Co-ordination
    - Writing (papers, blogs, etc.)
2. Network 
    - Running Nodes
    - Maintenance
3. Usage

**We are targeting measuring usage**. At the end of the day, a protocol's adoption is dependent on its users, and they should have a say in where the protocol should be going. The more a protocol is used by someone, they should get relatively equivalent voting power in governance proposals.

## Two Options:

### Option 1: For tracking usage of L1/L2s

Granting voting power for the usage of the underlying chain itself can be done via:

- Transaction value -> NOT good, since whales can easily send spam transactions to accumulate voting power.
- Transaction count (nonce) -> NOT good, can be spammed as well to generate fake transaction of low value.
- **Gas Usage -> Optimal!** The more gas is burned by a transaction, the higher their voting power. This ensures that the spammers don't directly get voting power but have to "burn their money" to acquire voting power.

For each transaction executed and included in L1/L2, based on the gas used, a corresponding score will be calculated and allocated to `from` address of the transaction. This is Non-transferable token!

This Option requires protocol level changes.

#### Implementation

To demonstrate this, we started with `geth` and the changes that are required to actually execute it. We know that such EIPs are exceptionally hard to be accepted but all L2s which use `geth` (most of them) as their execution layer, can adopt this easily!

We tried to modify `geth`, but with the new changes, the `build` is throwing several errors. 

### Specification:ß

We wrote down the things that needs to be changed in [SPECIFICATION.md](./SPECIFICATION.md).

### Option 2: For tracking usage of protocols built on top of L1/L2

This is more relevant for a lot of protocols as they are built on top of L1/L2 e.g. Uniswap, ENS, etc. 

For such protocols, the entire history of gas usage/burn of an address is not relevant but only for the interaction with the set of smart contracts that are defined by the protocol. This can also be extended if a new protocol wishes to grant a certain weighted voting power to users who have interacted with older protocols.

In this option, we define SBT, and allocate voting power based on the gas used/burned till a certain `snapshot` time defined by the protocol governance mechanism. Owners of EOA can claim the voting power by simply submitting Merkle Proofs for the address and the respective gas burned.

**This repo contains the code for Option 2, with specification for Option 1**.

An example of fetching the relevant addresses that interacted with [Sygma's Bridge](https://buildwithsygma.com/) contract, filtering and summation of gas usage is done via files in `script/`.

`FetchMainnetData.js` performs the API calls using Etherscan and post-processes the data and `Merkle.js` merklizes the fetched data. We are not persisting the data for now. The generated tree however is stored under `data/`.

#### Running 
1. To generate the tree locally, please create `.env` file under the project's root dir with the format and values as mentioned in `.env.example`.
2. Then run `npm run testRun`.

Two important contracts that are required for successfully accounting is (1) merkle proof verification and triggering minting of SBT and (2) SBT token contract giving the user with corresponding voting power.

The contracts are under `src/`, namely `VerifyGasUsage.sol` and `VotingWeight.sol`. The contracts are complete to the best of my knowledge but I did not get the time to write tests for it.

