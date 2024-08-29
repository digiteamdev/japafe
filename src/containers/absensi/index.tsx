"use client";

import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Clock from "react-live-clock";
import Logo from "../../assets/logo/dwitama.png";
import moment from "moment";
import { AddAbsensi } from "@/src/services";
import Image from "next/image";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";

export const Absensi = () => {
	const ref = useRef(null);
	const refInput = useRef(null);
	const [cardId, setCardId] = useState<string>("asd");
	const [image, setImage] = useState<any>(false);
	const [isClock, setIsClock] = useState<boolean>(false);
	const [data, setData] = useState<any>([]);

	useEffect(() => {
		let input: any = refInput.current;
		if (input) {
			input.focus();
		}
		if (!isClock) {
			setTimeout(() => {
				setCardId("");
				setIsClock(true);
			}, 3000);
		}
	}, [isClock]);

	const ScreenShoot = async (id: string) => {
		let images: any = ref.current;
		setImage(images.getScreenshot());
		const trimmedString = images
			.getScreenshot()
			.replace("data:image/jpeg;base64", "");
		const imageContent = window.btoa(trimmedString);
		let time: any = new Date();
		const formData = new FormData();
		formData.append("idCard", id);
		formData.append("scan_in", imageContent);
		formData.append("scan_in_time", time);
		try {
			const response = await AddAbsensi(formData);
			setData(response.data.results);
			setIsClock(false);
		} catch (error: any) {
			setData([]);
			toast.error(`Absen Failed Try Angain`, {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		}
		setCardId("");
	};

	return (
		<>
			{isClock ? (
				<>
					<div className='w-2/4 h-screen items-center mx-auto justify-center hidden md:flex lg:flex bg-white cursor-none'>
						<div className=''>
							<Webcam
								ref={ref}
								audio={false}
								screenshotFormat='image/jpeg'
								className='border border-black rounded-lg w-[500px]'
							/>
						</div>
					</div>
					<div className='lg:w-2/4 cursor-none md:w-2/4 w-full bg-white h-screen flex items-center justify-center'>
						<div className=''>
							<div className='w-full justify-center flex p-3'>
								<Image
									className='w-[50%] h-[50%] mr-2 mb-2'
									src={Logo}
									alt='logo'
								/>
							</div>
							<Clock
								format={"HH:mm:ss"}
								ticking={true}
								timezone={"Asia/Jakarta"}
								className='text-9xl'
							/>
							<div className='flex justify-center mt-8'>
								<input
									ref={refInput}
									id='card_id'
									name='card_id'
									placeholder='Card Id'
									type='text'
									onChange={(e: any) => {
										setCardId(e.target.value);
										if (e.target.value.length === 10) {
											ScreenShoot(e.target.value);
										}
									}}
									value={cardId}
									required={false}
									disabled={false}
									className='bg-white z-50 border border-primary-300 text-gray-900 sm:text-sm rounded-lg w-full p-2.5 outline-primary-600 opacity-0'
								/>
							</div>
						</div>
					</div>
				</>
			) : !isClock && data ? (
				<div className='flex justify-center mx-auto space-x-4 p-2 bg-white rounded-lg cursor-none'>
					<img src={image} className='w-96' />
					<div className='text-lg font-semibold'>
						<p>Name: {data?.name}</p>
						<p>Position: {data?.position}</p>
						<p>
							Check in:{" "}
							{data?.scan_in_time
								? moment(new Date(data?.scan_in_time)).format(
										"DD-MMMM-YYYY, HH:mm:ss"
								)
								: "-"}
						</p>
						<p>
							Check out:{" "}
							{data?.scan_out_time
								? moment(new Date(data?.scan_out_time)).format(
										"DD-MMMM-YYYY, HH:mm:ss"
								)
								: "-"}
						</p>
					</div>
				</div>
			) : null}
			<ToastContainer />
		</>
	);
};
