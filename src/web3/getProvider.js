import { ethers } from "ethers";
import detectProvider from "@metamask/detect-provider";

export async function getProvider() {
  const detectedProvider = await detectProvider();
  if (!detectedProvider) return null;
  return new ethers.providers.Web3Provider(detectedProvider);
}

export function subscribeProvider(provider, {
  onAccountsChanged,
  onChainChanged,
  onConnect,
  onDisconnect,
}) {
  const listeners = {};

  if (onAccountsChanged) {
    listeners.onAccountsChanged = (accounts) =>
      onAccountsChanged(accounts[0] && ethers.utils.getAddress(accounts[0]));
    provider.provider.on("accountsChanged", listeners.onAccountsChanged);
  }
  if (onChainChanged) {
    listeners.onChainChanged = (chainId) => onChainChanged(chainId.toString());
    provider.provider.on("chainChanged", listeners.onChainChanged);
  }
  if (onConnect) {
    listeners.onConnect = onConnect;
    provider.provider.on("connect", listeners.onConnect);
  }
  if (onDisconnect) {
    listeners.onDisconnect = onDisconnect;
    provider.provider.on("disconnect", listeners.onDisconnect);
  }

  return () => {
    if (listeners.onAccountsChanged) {
      provider.provider.removeListener(
        "accountsChanged",
        listeners.onAccountsChanged
      );
    }
    if (listeners.onChainChanged) {
      provider.provider.removeListener(
        "chainChanged",
        listeners.onChainChanged
      );
    }
    if (listeners.onConnect) {
      provider.provider.removeListener("connect", listeners.onConnect);
    }
    if (listeners.onDisconnect) {
      provider.provider.removeListener("disconnect", listeners.onDisconnect);
    }
  }
}
