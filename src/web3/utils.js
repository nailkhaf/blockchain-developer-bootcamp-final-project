import { ethers } from "ethers";

export async function requestAccount(provider) {
    const accounts = await provider.provider.request({
        method: "eth_requestAccounts",
    });
    return accounts[0] && ethers.utils.getAddress(accounts[0]);
}

export async function getAccount(provider) {
    const accounts = await provider.listAccounts();
    return accounts[0] && ethers.utils.getAddress(accounts[0]);
}

export async function getNetwork(provider) {
    return await provider.getNetwork();
}

export function addOnAccountChanged(provider, callback) {
    provider.provider.on(
        "accountsChanged",
        async (accounts) => await callback(accounts[0])
    );
}

export function addOnNetworkChanged(provider, callback) {
    provider.provider.on("chainChanged", callback);
}

export function removeAllListeners(provider) {
    provider.provider.removeAllListeners();
}
