import { badge } from '../styles/Badge.module.css'

export default function Badge(props) {
    const formatAddress = (address) => address?.slice(0,6) + '...' + address?.slice(-4)
    const title = () => props.type === 'address' ? formatAddress(props.title) : props.title

    return (
        <span
            class={badge}
        >
            {title()}
        </span>
    )
}
