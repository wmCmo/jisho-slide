import { useEffect, useState } from "react";
import Level from "./Level";

function App() {
	const [level, setLevel] = useState('n1');
	const [data, setData] = useState([])
	const [show, setShow] = useState(true)
	const [play, setPlay] = useState(true)
	const [tango, setTango] = useState({
		word: '言語',
		reading: 'げんご',
		senses: [["language"]]
	})
	useEffect(() => {

		const fetchData = async () => {
			try {
				const importedData = await import(`./assets/${level}.json`);
				setData(importedData.default);
			} catch (error) {
				console.log('Error loading JSON:', error)
				setData([])
			}
		}
		fetchData();
	}, [level])

	useEffect(() => {
		if (!data?.length) return;
		const len = data.length;
		const getWord = () => data[Math.floor(Math.random() * len)]
		setTango(getWord());
		setShow(true);
		const interval = setInterval(() => {
			setTango(getWord());
			setShow(true);
			setTimeout(() => setShow(false), 7000)
		}, 8000);
		return () => clearInterval(interval);
	}, [data])

	const handleSelect = (newLevel) => {
		setLevel(newLevel)
	}
	return (
		<>
			<div className="absolute right-8 top-6 flex flex-col gap-4 p-4 bg-river-styx rounded-md text-center">
				{[...Array(5)].map((_, i) => `n${i + 1}`).map(lvl => {
					return <Level key={lvl} level={level} index={lvl} onclick={handleSelect} />
				})}
			</div>
			<div className={`transition-opacity duration-1000 ${show ? 'opacity-100' : 'opacity-0'}`}>
				{!data && <h1>Loading</h1>}
				<div className="font-util font-normal text-center text-7xl tracking-[0.5em] text-steadfast">
					{tango.reading}
				</div>
				<div style={{ fontSize: `${25 - (tango.word.length * 2.5)}em` }} className={`font-display font-black text-center text-only-olive}`}>
					{tango.word}
				</div>
				<hr className="mb-8 border-steadfast" />
				<div className="flex gap-16 items-center text-left">
					<a className="px-8 py-4 bg-river-styx rounded-lg hover:text-battery-charged-blue hover:font-semibold transition duration-300 ease-in-out" role="button"
						href={`https://jisho.org/search/${tango.word}`} target="_blank">Open
						Jisho.org</a>
					<div className="font-mono text-only-olive">
						<ol className="list-decimal marker:text-battery-charged-blue">
							{data && tango.senses?.slice(0, 3).map((sense, idx) => <li key={idx}>{sense.slice(0, 3).join('; ')}</li>)}
						</ol>
					</div>
				</div>
			</div>
		</>
	)
}

export default App;
