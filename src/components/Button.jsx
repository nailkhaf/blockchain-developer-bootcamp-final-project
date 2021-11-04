import {button} from "../styles/Button.module.css"

export default function Button(props) {

    return (
        <button
            onClick={props.onClick}
            disabled={props.disabled}
            class={button}
        >
            {props.title}
        </button>)
}
