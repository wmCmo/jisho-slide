import { useCallback, useEffect, useState } from "react";
import Level from "./Level";
import Pause from '/pause.svg';
import Play from '/play.svg';
import Slider from "./Slider";

function App() {
	const [level, setLevel] = useState('n1');
	const [data, setData] = useState([]);
	const [show, setShow] = useState(true);
	const [play, setPlay] = useState(true);
	const [speed, setSpeed] = useState(4);
	const [showReading, setShowReading] = useState(true);
	const [showSenses, setShowSenses] = useState(true);
	const [tango, setTango] = useState({
		word: '言語',
		reading: 'げんご',
		senses: [["language"]]
	});

	const handlePlay = () => {
		setPlay(prevPlay => !prevPlay);
	};

	useEffect(() => {
		const handleSpace = e => {
			if (e.code === 'Space') handlePlay();
		};
		window.addEventListener('keydown', handleSpace);
		return () => {
			window.removeEventListener('keydown', handleSpace);
		};
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const importedData = await import(`./assets/${level}.json`);
				setData(importedData.default);
			} catch (error) {
				console.log('Error loading JSON:', error);
				setData([]);
			}
		};
		fetchData();
	}, [level]);


	const getWord = useCallback(() => {
		const len = data.length;
		setTango(data[Math.floor(Math.random() * len)]);
	}, [data]);


	useEffect(() => {
		let interval;
		if (!data) return;
		setShow(true);
		if (play) {
			interval = setInterval(() => {
				setShow(false);
				setTimeout(() => {
					getWord();
					setShow(true);
				}, 1000);
			}, speed * 1000);
		}

		return () => {
			clearInterval(interval);
		};
	}, [data, play, level, speed, getWord]);


	const handleSelect = (newLevel) => {
		getWord();
		setLevel(newLevel);
	};

	const handleSlide = (value) => {
		setSpeed(value);
	};

	return (
		<>
			<div className="absolute right-8 top-6 select-none">
				<div className="flex flex-col gap-4 p-4 mb-6 bg-river-styx rounded-md text-center">
					{[...Array(5)].map((_, i) => `n${i + 1}`).map(lvl => {
						return <Level key={lvl} level={level} index={lvl} onclick={handleSelect} />;
					})}
					<hr className="border-coarse-wool border-4" />
					<div className="bg-steadfast rounded-md p-1 hover:cursor-pointer" onClick={handlePlay}>
						<img src={play ? Pause : Play} alt="Pause / Play icon" className="mx-auto" />
					</div>
					<Slider min={3} max={10} step={1} value={speed} onChange={handleSlide} />
					<hr className="border-coarse-wool border-4" />
					<div className={`transition-colors duration-300 ease-in-out bg-coarse-wool ${showReading ? "text-battery-charged-blue" : "text-steadfast"} hover:text-white rounded-md p-1 hover:cursor-pointer`} onClick={() => { setShowReading(prevReading => !prevReading); }}>
						読
					</div>
					<div className={`transition-colors duration-300 ease-in-out bg-coarse-wool ${showSenses ? "text-battery-charged-blue" : "text-steadfast"} hover:text-white rounded-md p-1 hover:cursor-pointer`} onClick={() => { setShowSenses(prevSenses => !prevSenses); }}>
						意
					</div>
				</div>
			</div>
			<div className={`transition-opacity duration-1000 ${show ? 'opacity-100' : 'opacity-0'}`}>
				{!data?.length === 0 && <h1>Loading</h1>}
				{showReading &&
					<div className="font-util font-normal text-center text-7xl tracking-[0.5em] text-steadfast">
						{tango.reading}
					</div>}
				<div style={{ fontSize: `${25 - (tango.word.length * 2.5)}em` }} className={`font-display font-black text-center text-only-olive}`}>
					{tango.word}
				</div>
				{showSenses &&
					<>
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
					</>
				}

			</div>
		</>
	);
}

export default App;
