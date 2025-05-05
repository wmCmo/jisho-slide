export default function Option({ show, onClick, value }) {
    return (
        <div className={`transition-colors duration-300 ease-in-out bg-coarse-wool ${show ? "text-battery-charged-blue" : "text-steadfast"} hover:text-white rounded-md p-1 hover:cursor-pointer`} onClick={onClick}>
            {value}
        </div>
    );
}
