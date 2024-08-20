import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Clock from "react-live-clock";
import { log } from "console";

export const Absensi = () => {
	const ref = useRef(null);
	const [s, setA] = useState<any>(false);
	const [isClock, setIsClock] = useState(false)

	useEffect(() => {
		setIsClock(true)
	}, [])

	const a = () => {
		let as: any = ref.current;
		setA(as.getScreenshot());
	};

	return (
		<div>
			{ isClock ? (
				<Clock
					format={"HH:mm:ss"}
					ticking={true}
					timezone={"Asia/Jakarta"}
					className='text-9xl'
				/>
			) : null }
			<div className="fixed opacity-0">
				<Webcam ref={ref} audio={false} screenshotFormat='image/jpeg' className="-z-10" />
			</div>
			<div className="flex justify-center mt-20">
				<button type="button" className="mx-1 z-40 bg-green-500 hover:bg-green-700 text-white p-2 rounded-lg " onClick={() => a()}>Absen</button>
			</div>
				<img src={s} className='w-52' />
		</div>
	);
};
