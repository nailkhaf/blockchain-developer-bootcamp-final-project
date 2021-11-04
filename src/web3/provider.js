import { ethers } from "ethers";

export function getProvider() {
    if (window.ethereum !== undefined) {
        return new ethers.providers.Web3Provider(window.ethereum)
    } else {
        return null
    }
}

export async function requestAccount(provider) {
    const accounts = await provider.provider.request({ method: 'eth_requestAccounts' })
    return accounts[0] && ethers.utils.getAddress(accounts[0])
}

export async function getAccount(provider) {
    const accounts = await provider.listAccounts()
    return accounts[0] && ethers.utils.getAddress(accounts[0])
}

export async function validNetwork(provider) {
    const { name } = await provider.getNetwork()
    return name === 'rinkeby'
}

export async function getNetworkName(provider) {
    const { name } = await provider.getNetwork()
    return name
}

export function addOnAccountChanged(provider, callback) {
    provider.provider.on('accountsChanged', async (accounts) => await callback(accounts[0]))
}

export function addOnNetworkChanged(provider, callback) {
    provider.provider.on('chainChanged', callback)
}

export function removeAllListeners(provider) {
    provider.provider.removeAllListeners()
}
