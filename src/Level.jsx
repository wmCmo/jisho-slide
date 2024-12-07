/* eslint-disable react/prop-types */
export default function Level(props) {
    return (
        <div onClick={() => props.onclick(props.index)} className={`transition-colors duration-300 ease-in-out cursor-pointer text-2xl ${props.index === props.level ? 'text-battery-charged-blue font-semibold' : 'text-steadfast'}`}>{props.index.toUpperCase()}</div>
    )
}
