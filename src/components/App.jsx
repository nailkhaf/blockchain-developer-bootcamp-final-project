import logo from "../logo.svg";
import Connect from "./Connect"
import { createSignal, createEffect, Switch, Match } from "solid-js";

function App() {
  const [account, setAccount] = createSignal()

  createEffect(() => console.log(account()))

  const onAccountChanged = account => setAccount(account)

  return (<Connect
      onAccountChanged={onAccountChanged}
    />);
}

export default App;
