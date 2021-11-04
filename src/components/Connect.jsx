import {
    createSignal,
    createMemo,
    createEffect,
    onCleanup,
    onMount,
    Switch,
    Match
} from "solid-js";
import {
    getProvider,
    getAccount,
    requestAccount,
    validNetwork,
    getNetworkName,
    addOnAccountChanged,
    addOnNetworkChanged,
    removeAllListeners
} from "../web3/provider";
import Button from './Button'
import Label from './Label'
import Badge from './Badge'

export default function Connect(props) {
    const [state, setState] = createSignal('loading');
    const [provider, setProvider] = createSignal();
    const [network, setNetwork] = createSignal();
    const [account, setAccount] = createSignal();
    const [error, setError] = createSignal();

    const capitalizeNetwork = () => {
        const networkName = network()
        if (networkName) {
            return networkName[0].toUpperCase().concat(networkName.slice(1))
        }
    }

    createEffect(() => console.log(state()))
    createEffect(() => account() ?? setError())
    createEffect(() => props.onAccountChanged && props.onAccountChanged(account()))
    createEffect(() => {
        if (provider()) {
            addOnAccountChanged(provider(), (account) => {
                setAccount(account)
                if (!account) {
                    setState('connect')
                }
            })
            addOnNetworkChanged(provider(), async () => {
                removeAllListeners(provider())
                const newProvider = getProvider()
                if (validNetwork(newProvider)) {
                    setProvider(newProvider)
                    setNetwork(await getNetworkName(newProvider))
                } else {
                    setState('wrong network')
                    setProvider()
                }
            })
        }
    })
    createEffect(async () => {
        if (provider()) {
            if (!await validNetwork(provider())) {
                setState('wrong network')
            } else {
                setNetwork(await getNetworkName(provider()))
                try {
                    const account = await getAccount(provider())
                    if (account) {
                        setState('connected')
                        setAccount(account)
                    } else {
                        setState('connect')
                    }
                } catch(e) {
                    console.error(e)
                    setState('connect')
                    setError(e.message)
                }
            }
        }
    })

    onMount(async () => {
        const provider = getProvider()
        if (provider) {
            setProvider(provider)
        } else {
            setState('no provider')
        }
    })

    onCleanup(() => {
        if (provider()) {
            removeAllListeners(provider())
        }
    })

    const onConnect = async () => {
        try {
            const account = await requestAccount(provider())
            if (account) {
                setState('connected')
                setAccount(account)
            }
        } catch(e) {
            console.error(e)
            setState('connect')
            setError(e.message)
            return null
        }
    }

    return (
        <div style={{display: 'flex', 'justify-content': 'end'}}>
            <Switch fallback={<Label title="Smth wrong" mode="error"/>}>
                <Match when={state() === "loading"}>
                    <Label title="Loading..." sticky />
                </Match>
                <Match when={state() === "wrong network"}>
                    <Label title="Wrong network" mode="error" sticky />
                </Match>
                <Match when={state() === "no provider"}>
                    <Label title="No web3 provider" mode="error" sticky />
                </Match>
                <Match when={state() === "connect" || state() === "connected"}>
                    <Label title={capitalizeNetwork()} sticky />
                </Match>
            </Switch>

            <Show when={state() === 'connected'}
                fallback={<Button title="Connect wallet" disabled={(state() in ['loading', 'connect'])} onClick={onConnect}/>}>

              <Badge title={account()} type="address"/>
            </Show>


        </div>
    )
}
