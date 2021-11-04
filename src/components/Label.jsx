import { label, sticky, info, error } from "../styles/Label.module.css";

export default function Label(props) {
    const mode = props.mode ?? 'info'

    return (
        <span
            class={label}
            classList={{
                [info]: mode === 'info',
                [error]: mode === 'error',
                // [sticky]: props.sticky ?? false
            }}
        >
            {props.title}
        </span>
    )
}
