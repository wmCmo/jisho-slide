import { useCallback, useEffect, useState } from "react";
import Level from "./Level";
import Option from "./Option";
import Slider from "./Slider";

const KANA = "あいうえおかきくけこがぎぐげごさしすせそざじずぜぞたちつてとだぢづでどなにぬねのはひふへほばびぶべぼぱぴぷぺぽまみむめもやゆよゃゅょらりるれろわをんゎっアイウエオカキクケコガギグゲゴサシスセソザジズゼゾタチツテトダヂヅデドナニヌネノハヒフヘホバビブベボパピプペポマミムメモヤユヨャュョラリルレロワヲンヮーッ-";

function App() {
	const [level, setLevel] = useState('n1');
	const [data, setData] = useState([]);
	const [show, setShow] = useState(true);
	const [play, setPlay] = useState(true);
	const [speed, setSpeed] = useState(4);
	const [showMenu, setShowMenu] = useState(true);
	const [showInfo, setShowInfo] = useState(false);
	const [showArrows, setShowArrows] = useState(true);
	const [showReading, setShowReading] = useState(true);
	const [showSenses, setShowSenses] = useState(false);
	const [kakuFont, setKakuFont] = useState(false);
	const [tango, setTango] = useState({
		word: '言語',
		reading: 'げんご',
		senses: [["language"]]
	});


	const handlePlay = useCallback(() => {
		setPlay(prevPlay => !prevPlay);
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

	const [timeline, setTimeline] = useState([Math.floor(Math.random() * 100)]);
	const [position, setPosition] = useState(0);

	const getWord = useCallback(() => {
		const len = data.length;
		const index = Math.floor(Math.random() * len);
		setTimeline(prevTimeline => {
			const newTimeline = [...prevTimeline, index];
			return newTimeline;
		});
		setPosition(prevPosition => {
			const newPosition = prevPosition + 1;
			setTango(data[timeline[newPosition] || index]);
			return newPosition;
		});
	}, [data, timeline]);

	useEffect(() => {
		setTimeline([Math.floor(Math.random() * 100)]);
		if (data.length > 0) {
			const firstIndex = Math.floor(Math.random() * data.length);
			setTimeline([firstIndex]);
			setPosition(0);
			setTango(data[firstIndex]);
		}
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

	const handleLeft = useCallback(() => {
		if (position > 0) {
			setPosition(prevPosition => {
				const newPosition = prevPosition - 1;
				setTango(data[timeline[newPosition]]);
				return newPosition;
			});
		}
	}, [data, position, timeline]);

	useEffect(() => {
		const arrowLeft = document.getElementById('arrow-left');
		const arrowRight = document.getElementById('arrow-right');

		const handleKeys = e => {
			const code = e.code;
			if (/^Digit[1-5]$/.test(code)) {
				setLevel('n' + code.substr(-1));
			}
			switch (code) {
				case 'Space':
					handlePlay();
					break;
				case 'ArrowLeft':
				case 'KeyA':
					arrowLeft?.classList.add('active-fill');
					handleLeft();
					break;
				case 'ArrowRight':
				case 'KeyD':
					arrowRight?.classList.add('active-fill');
					getWord();
					break;
				case 'KeyR':
					setShowReading(prev => !prev);
					break;
				case 'KeyM':
					setShowSenses(prev => !prev);
					break;
				case 'KeyC':
					setShowArrows(prev => !prev);
					break;
				case 'KeyF':
					setKakuFont(prev => !prev);
					break;
				case 'KeyY':
					setLevel('熟');
					break;
				case 'Escape':
					setShowMenu(prev => !prev);
					break;
				default:
					break;
			}
		};

		const handleKeyUp = () => {
			[arrowLeft, arrowRight].forEach(arrow => arrow?.classList.remove('active-fill'));
		};

		window.addEventListener('keydown', handleKeys);
		window.addEventListener('keyup', handleKeyUp);
		return () => {
			window.removeEventListener('keydown', handleKeys);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [handlePlay, handleLeft, getWord]);

	return (
		<div className="">
			<div className={`absolute left-6 top-6 select-none text-steadfast`} onClick={() => setShowInfo(prevShowInfo => !prevShowInfo)}>
				<img className={`transform duration-300 ease-in-out ${showInfo ? "rotate-90" : "rotate-0"}`} src="./triangle.svg" alt="" />
				<div className={`bg-river-styx px-4 py-2 mt-2 rounded-lg transition-all duration-300 ease-in-out ${showInfo ? "translate-0" : "-translate-y-5 opacity-0"}`}>
					<a href="https://www.producthunt.com/posts/jisho-slides?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-jisho&#0045;slides" target="_blank"><img className="mt-2" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=966843&theme=neutral&t=1747506853455" alt="Jisho&#0032;Slides - Minimal&#0032;JLPT&#0032;Japanese&#0032;word&#0032;slideshow | Product Hunt" width="250px" height="54px" /></a>
					<div className="flex gap-1 mt-4">
						<img src="./code.svg" alt="" />
						<a href="https://github.com/wmCmo/jisho-slide"><p className="hover:text-only-olive"><b>Code</b></p></a>
					</div>
					<div className="flex gap-1 mt-2">
						<img src="./info.svg" alt="" />
						<a href="https://exzachly.notion.site/" target="_blank"><p className="hover:text-battery-charged-blue"><b>wmcmo</b></p></a>
					</div>
				</div>
			</div>
			<div className="absolute right-6 top-6 select-none z-10">
				<div className="flex justify-center p-4 mb-4 bg-river-styx rounded-xl" onClick={() => { setShowMenu(prevShowMenu => !prevShowMenu); }}>
					<img src="./menu.svg" alt="hamburger" width="30px" height="30px" />
				</div>
				{showMenu &&
					<div className="flex flex-col gap-3 p-4 mb-4 bg-river-styx rounded-xl text-center font-kaku-gothic-new font-medium">
						{[...Array(5)].map((_, i) => `n${i + 1}`).map(lvl => {
							return <Level key={lvl} level={level} index={lvl} onclick={setLevel} />;
						})}
						<Level level={level} index={'熟'} onclick={setLevel} />
						<Slider min={3} max={10} step={1} value={speed} onChange={setSpeed} />
						<div className="bg-coarse-wool rounded-md p-1 hover:cursor-pointer" onClick={() => setShowArrows(prevShowArrows => !prevShowArrows)}>
							<svg className={`${showArrows ? "fill-battery-charged-blue" : "fill-steadfast"} transition-colors duration-300 ease-in-out hover:fill-white`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4b5975" viewBox="0 0 256 256">
								<path
									d="M104,128a8,8,0,0,1-8,8H56v24a8,8,0,0,1-13.66,5.66l-32-32a8,8,0,0,1,0-11.32l32-32A8,8,0,0,1,56,96v24H96A8,8,0,0,1,104,128Zm141.66-5.66-32-32A8,8,0,0,0,200,96v24H160a8,8,0,0,0,0,16h40v24a8,8,0,0,0,13.66,5.66l32-32A8,8,0,0,0,245.66,122.34ZM128,32a8,8,0,0,0-8,8V216a8,8,0,0,0,16,0V40A8,8,0,0,0,128,32Z"></path>
							</svg>
						</div>
						<hr className="border-coarse-wool border-4" />
						<Option show={showReading} onClick={() => setShowReading(prev => !prev)} value="読" />
						<Option show={showSenses} onClick={() => setShowSenses(prev => !prev)} value="意" />
						<hr className="border-coarse-wool border-4" />
						<Option show={kakuFont} onClick={() => setKakuFont(prev => !prev)} value="新" />
					</div>
				}
			</div>
			{!tango ? <h1>Loading...</h1> :
				<>
					<div className={`transition-opacity duration-1000 ${show ? 'opacity-100' : 'opacity-0'}`}>
						{showReading &&
							<div className="font-util font-normal text-center text-4xl md:text-7xl md:tracking-[0.5em] text-steadfast">
								{tango.reading}
							</div>}
						<div style={{
							fontSize: window.innerWidth >= 768 ?
								`${25 - (tango.word.length * 2.5)}rem` :
								`${12 - (tango.word.length * 2.5)}rem`
						}} className={`text-8xl ${kakuFont ? 'font-kaku-gothic-new' : 'font-old-mincho'} font-black text-center text-only-olive mb-8`}>
							{[...tango.word].map((char, i) => {
								if (KANA.includes(char) || /[0-9]/.test(char)) {
									return <span key={char + i}>{char}</span>;
								} else {
									return <span key={char + i} className="hover:text-battery-charged-blue"><a href={`http://kakimashou.com/dictionary/character/${char}`} target="_blank" rel="noopener noreferrer">{char}</a></span>;
								}
							}
							)}
						</div>
						{showSenses &&
							<>
								<hr className="mb-8 border-steadfast" />
								<div className="flex flex-col md:flex-row gap-4 md:gap-16 items-center text-left">
									<a className="px-8 py-4 bg-river-styx rounded-lg hover:text-battery-charged-blue hover:font-semibold transition duration-300 ease-in-out" role="button"
										href={`https://jisho.org/search/${tango.word}`} target="_blank" rel="noopener noreferrer" onClick={() => setPlay(false)}>Open
										Jisho.org</a>
									<div className="font-mono text-only-olive ml-8 md:ml-0">
										<ol className="list-decimal marker:text-battery-charged-blue ">
											{data && tango.senses?.slice(0, 3).map((sense, idx) => <li key={idx}>{sense.slice(0, 3).join('; ')}</li>)}
										</ol>
									</div>
								</div>
							</>
						}
					</div>
					{
						showArrows &&
						<div className="mt-16 flex justify-center gap-8 cursor-pointer">
							<div className="bg-river-styx rounded-lg p-3" onClick={handleLeft}>
								<svg id="arrow-left" className="hover:fill-battery-charged-blue transition-colors duration-300 ease-in-out" xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="#4b5975" viewBox="0 0 256 256">
									<path
										d="M200,48V208a8,8,0,0,1-13.66,5.66l-80-80a8,8,0,0,1,0-11.32l80-80A8,8,0,0,1,200,48ZM72,40a8,8,0,0,0-8,8V208a8,8,0,0,0,16,0V48A8,8,0,0,0,72,40Z"></path>
								</svg>
							</div>
							<div className="bg-river-styx rounded-lg p-3" onClick={handlePlay}>
								{
									play ?
										<svg className="hover:fill-battery-charged-blue transition-colors duration-300 ease-in-out" xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="#4b5975" viewBox="0 0 256 256">
											<path
												d="M216,48V208a16,16,0,0,1-16,16H160a16,16,0,0,1-16-16V48a16,16,0,0,1,16-16h40A16,16,0,0,1,216,48ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Z"></path>
										</svg>
										:
										<svg className="hover:fill-battery-charged-blue transition-colors duration-300 ease-in-out" xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="#4b5975" viewBox="0 0 256 256">
											<path
												d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"></path>
										</svg>
								}
							</div>
							<div id="arrow-right" className="bg-river-styx rounded-lg p-3" onClick={getWord}>
								<svg className="hover:fill-battery-charged-blue transition-colors duration-300 ease-in-out" xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="#4b5975" viewBox="0 0 256 256">
									<path
										d="M149.66,122.34a8,8,0,0,1,0,11.32l-80,80A8,8,0,0,1,56,208V48a8,8,0,0,1,13.66-5.66ZM184,40a8,8,0,0,0-8,8V208a8,8,0,0,0,16,0V48A8,8,0,0,0,184,40Z"></path>
								</svg>
							</div>
						</div>
					}
				</>
			}

		</div>
	);
}

export default App;
