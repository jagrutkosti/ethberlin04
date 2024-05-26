import { generateMerkleRoot, generateMerkleTree, getProof, verifyProof } from "./Merkle.js"
import { fetchNormalTransactions, calculateGasUsage } from "./FetchMainnetData.js"

// Example of protocol interaction, https://docs.buildwithsygma.com/environments/mainnet/
const SYGMA_MAINNET_BRIDGE = '0x4D878E8Fb90178588Cda4cf1DCcdC9a6d2757089'

const transactions = await fetchNormalTransactions({contractAddr: SYGMA_MAINNET_BRIDGE, page: 1, offset: 100})
const gasUsageMap = await calculateGasUsage(transactions)

// Concat address + gasUsage and use those as leaves. This would be required for granting appropriate voting power to SBT.
const leaves = Array.from(gasUsageMap, ([name, value]) => (name+value))

const tree = generateMerkleTree(leaves)
// Post this on smart contract
const root = generateMerkleRoot(tree)

console.log(root)

const proof = getProof(tree, leaves[0])
const verify = verifyProof(leaves[0], root, proof, tree)

console.log(verify)
