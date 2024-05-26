# Specification

In this file we describe the minimum changes that are required to be made in Ethereum Execution Client. We will take `geth` as a source of concrete changes but this can be easily replicated to other execution clients.

## 1. Data Structure

Considering that as of now, there are approximately 270 million unique addresses on Ethereum mainnet, adding another variable to store information is BIG DEAL!
For example, if we add another `uint256`, the storage size of the node (at least archive node) will increase by approx. **8 GB**.

Instead we propose using a single `byte` to store this info. A byte, 8 bits, can represent whatever multiplication factor we want to add to that. As the goal is to have a range of voting power rather than concrete ones, we can round down to the closest voting power an address has. A `byte` gives us 128 buckets that we can use to grant voting power. This is actually a good thing that **the voting power gets capped** at some point and does not increase indefinitely. 

With this, we reduce the state size growth from 8 GB to approx. **260 MB** and the increase is only dependent on the number of accounts increase.

## 2. Modification of existing Struct

The best possible place for this would be to add it in `core/types/state_account.go`, in the `StateAccount` struct. The new struct looks like:
```
type StateAccount struct {
	Nonce      uint64
	Balance    *uint256.Int
	Root       common.Hash // merkle root of the storage trie
	CodeHash   []byte
	UsageScore byte
}
```
This does not affect changing the `stateObject` or `StateDB` struct since they only refer to the whole `StateAccount` struct.

## 3. Modification of core logic

Due to the struct modification, there will be several places where corresponding modifications will need to be done. Some of them that came to my mind are:

- `newObject()` in `core/state/state_object.go`

## 4. Accounting for gas

A lot of magic happens during the final stages of the transaction execution. This is where we want to add the `UsageScore` update logic, when we know for sure the transaction is going to be included. Please note that we do not account for gas burnt in failed transaction!

Most of the post-accouting happens in `core/state/statedb.go`, especially in `Finalise()` and `IntermediateRoot()` functions. Also, the corresponding `get`, `set` functions in `core/state/state_object.go` needs to be updated. Same in StateDb.

Interface modification of `StateDB` in `core/vm/interface.go` should also be taken care of.

## 5. API

Internally, `geth` also uses API calls to fetch latest information. We also need to add an API call for `getUsageScore()` in `internal/ethapi/api.go`.

## Conclusion

We began with implementing these changes, but they broke the entire `geth` build and we were not able to fix it in time. We switched the focus to application layer of accounting for gas usage. 
Do note that, if this is implemented correctly for EOA and Smart contract accounts, it can be natively used in JSON-RPC calls to get latest info about the usage score.