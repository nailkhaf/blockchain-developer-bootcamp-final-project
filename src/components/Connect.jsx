import {
  createSignal,
  createMemo,
  createEffect,
  createResource,
  on,
  onCleanup,
  onMount,
  Switch,
  Match,
  Show
} from "solid-js";
import {
  getAccount,
  requestAccount,
  getNetwork,
  removeAllListeners,
} from "../web3/utils";
import { getProvider, subscribeProvider } from "../web3/getProvider";
import Button from "./Button";
import Label from "./Label";
import Badge from "./Badge";

export default function Connect(props) {
  const [account, setAccount] = createSignal();

  const [provider, { refetch: updateProvider }] = createResource(getProvider);
  const [network, { refetch: updateNetwork }] = createResource(
    async () => provider() && (await getNetwork(provider()))
  );

  const capitalize = (text) => text[0].toUpperCase().concat(text.slice(1));
  let unsubscribe;

  createEffect(on(provider, () => updateNetwork()));
  createEffect(() => props.onAccountChanged?.(account()));
  createEffect(() => {
    if (!provider()) return;

    unsubscribe?.();
    unsubscribe = subscribeProvider(provider(), {
      onAccountsChanged: (account) => {
        setAccount(account);
      },
      onChainChanged: () => {
        updateProvider();
      },
    });
  });

  const onConnect = async () => {
    try {
      setAccount(await requestAccount(provider()));
    } catch (e) {
      console.error(e);
    }
  };

  onCleanup(() => {
    unsubscribe?.();
    unsubscribe = undefined;
  });

  return (
    <div style={{ display: "flex", "justify-content": "end" }}>
      <Switch fallback={<Label title="Smth wrong" mode="error" />}>
        <Match when={provider.loading || network.loading}>
          <Label title="Loading..." sticky />
        </Match>
        <Match when={!provider()}>
          <Label title="No web3 provider" mode="error" sticky />
        </Match>
        <Match when={network()?.name !== props.network}>
          <Label title="Wrong network" mode="error" sticky />
        </Match>
        <Match when={network()?.name === props.network}>
          <Label title={capitalize(network().name)} sticky />
        </Match>
      </Switch>

      <Show
        when={account()}
        fallback={<Button title="Connect wallet" onClick={onConnect} />}
      >
        <Badge title={account()} type="address" />
      </Show>
    </div>
  );
}
