"use client";

import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Clock from "react-live-clock";
import { toast } from "react-toastify";
import moment from "moment";
import { AddAbsensi } from "@/src/services";

export const Absensi = () => {
	const ref = useRef(null);
	const [cardId, setCardId] = useState<string>("");
	const [image, setImage] = useState<any>(false);
	const [isClock, setIsClock] = useState<boolean>(false);
	const [data, setData] = useState<any>([]);

	useEffect(() => {
		if (!isClock) {
			setTimeout(() => {
				setCardId("");
				setIsClock(true);
			}, 3000);
		}
	}, [isClock]);

	const ScreenShoot = async () => {
		let images: any = ref.current;
		setImage(images.getScreenshot());
		const trimmedString = images
			.getScreenshot()
			.replace("data:image/jpeg;base64", "");
		const imageContent = window.btoa(trimmedString);
		let time: any = new Date();
		const formData = new FormData();
		formData.append("idCard", cardId);
		formData.append("scan_in", imageContent);
		formData.append("scan_in_time", time);
		try {
			const response = await AddAbsensi(formData);
			setData(response.data.results);
			setIsClock(false);
		} catch (error: any) {
			setData([]);
			console.log(error);
		}
	};

	return (
		<div>
			<div className="absolute top-10">
				<h1 className='flex text-4xl font-semibold justify-center'>Absensi</h1>
				<h1 className='flex text-4xl font-semibold justify-center'>PT DWITAMA MULYA PERSADA</h1>
			</div>
			{isClock ? (
				<>
					<Clock
						format={"HH:mm:ss"}
						ticking={true}
						timezone={"Asia/Jakarta"}
						className='text-9xl'
					/>
					<div className='fixed opacity-0'>
						<Webcam
							ref={ref}
							audio={false}
							screenshotFormat='image/jpeg'
							className='-z-10'
						/>
					</div>
					<div className='flex justify-center mt-8'>
						<input
							id='card_id'
							name='card_id'
							placeholder='Card Id'
							type='text'
							onChange={(e: any) => {
								setCardId(e.target.value);
							}}
							value={cardId}
							required={false}
							disabled={false}
							className='bg-white z-50 border border-primary-300 text-gray-900 sm:text-sm rounded-lg w-full p-2.5 outline-primary-600'
						/>
						<button
							type='button'
							className='mx-1 z-50 bg-green-500 hover:bg-green-700 text-white p-2 rounded-lg '
							onClick={() => {
								if (cardId !== "") {
									ScreenShoot();
								} else {
									toast.warning("Card id not empty", {
										position: "top-center",
										autoClose: 1000,
										hideProgressBar: true,
										closeOnClick: true,
										pauseOnHover: true,
										draggable: true,
										progress: undefined,
										theme: "colored",
									});
								}
							}}
						>
							Absen
						</button>
					</div>
				</>
			) : !isClock && cardId !== "" ? (
				<div className='flex space-x-4 p-2 bg-white rounded-lg'>
					<img src={image} className='w-60' />
					<div className='text-lg font-semibold'>
						<p>Nama: {data?.name}</p>
						<p>Position: {data?.position}</p>
						<p>
							Jam masuk:{" "}
							{data?.scan_in_time
								? moment(new Date(data?.scan_in_time)).format(
										"DD-MMMM-YYYY, HH:mm:ss"
								  )
								: "-"}
						</p>
						<p>
							Jam masuk:{" "}
							{data?.scan_out_time
								? moment(new Date(data?.scan_out_time)).format(
										"DD-MMMM-YYYY, HH:mm:ss"
								  )
								: "-"}
						</p>
					</div>
				</div>
			) : null}
		</div>
	);
};
function DataURIToBlob(images: any) {
	throw new Error("Function not implemented.");
}
