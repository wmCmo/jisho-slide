export default function Slider({ min, max, step, value, onChange }) {
    return (
        <div alt='time control slider' title="Change Time (s)" className='flex flex-col items-center'>
            <input className='slider' type="range" name="slider" id="slider" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
            <span className='text-steadfast'><b>{value} S</b></span>
        </div>
    );
}
