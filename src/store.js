import { createStore } from 'solid-js/store'

const [store, setStore] = createStore({ account: undefined })

export default function getStore() {
    return [store, setStore]
}
