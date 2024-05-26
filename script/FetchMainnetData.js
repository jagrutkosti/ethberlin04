import fetch from 'node-fetch'
import dotenv  from 'dotenv'

dotenv.config()

// Queries the Eth mainnet to fetch transactions made to an address within specified block numbers
export const fetchNormalTransactions = async ({contractAddr, startBlock=0, endBlock=99999999, page=1, offset=10}) => {
    const URL = "https://api.etherscan.io/api"+
        "?module=account" +
        "&action=txlist" +
        "&address=" + contractAddr +
        "&startblock=" + startBlock +
        "&endblock=" + endBlock +
        "&page=" + page +
        "&offset=" + offset +
        "&sort=asc" +
        "&apikey=" + process.env.ETHERSCAN_API_KEY

    const response = await fetch(URL)
    const data = await response.json()

    return data.result
}

// Returns a map with address as key and total gas usage as value
export const calculateGasUsage = async (transactions) => {
    const gasUsageMap = new Map()
    transactions.forEach((item, index) => {
        const oldVal = parseInt(gasUsageMap.get(item.from))
        oldVal ? gasUsageMap.set(item.from, oldVal + parseInt(item.gasUsed)) : gasUsageMap.set(item.from, parseInt(item.gasUsed))
    })

    return gasUsageMap
}

export const fetchInternalTransactions = async () => {
    const URL = "https://api.etherscan.io/api"+
        "?module=account" +
        "&action=txlistinternal" +
        "&address=" + process.env.SYGMA_MAINNET_BRIDGE+
        "&startblock=19940080" +
        "&endblock=99999999" +
        "&page=1" +
        "&offset=10" +
        "&sort=asc" +
        "&apikey=" + process.env.ETHERSCAN_API_KEY

    const response = await fetch(URL)
    const data = await response.json()

    return data.result
}