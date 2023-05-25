import { useEffect, useState } from "react";
import { Section, Input, InputSelect, InputArea } from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { equipmentSchema } from "../../../schema/master-data/equipment/equipmentSchema";
import { Disclosure } from "@headlessui/react";
import { Plus, Trash2 } from "react-feather";
import {
	EditEquipment,
	EditEquipmentPart,
	DeleteEquipmentPart,
} from "../../../services";
import { toast } from "react-toastify";

interface props {
	content: string;
	dataEquipment: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface dataEquipment {
	nama: string;
	keterangan_eq: string;
	eq_image: any;
}

interface dataPart {
	eq_part: [
		{
			id: string;
			id_equipment: string;
			nama_part: string;
			keterangan_part: string;
			part_img: any;
			action: string;
		}
	];
}

export const FormEditEquipment = ({
	content,
	dataEquipment,
	showModal,
}: props) => {
	const dataTabs = ["Equipment", "Part"];

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [activeTabs, setActiveTabs] = useState<any>(dataTabs[0]);
	const [file, setFile] = useState<any>("");
	const [files, setFiles] = useState<any>([]);
	const [data, setData] = useState<dataEquipment>({
		nama: "",
		keterangan_eq: "",
		eq_image: "",
	});
	const [dataPart, setDataPart] = useState<dataPart>({
		eq_part: [
			{
				id: "",
				id_equipment: "",
				nama_part: "",
				keterangan_part: "",
				part_img: "",
				action: "",
			},
		],
	});

	useEffect(() => {
		settingData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		let listPart: any = [];
		setData({
			nama: dataEquipment.nama,
			keterangan_eq: dataEquipment.keterangan_eq,
			eq_image: dataEquipment.eq_image,
		});

		if (dataEquipment.eq_part.length > 0) {
			dataEquipment.eq_part.map((res: any) => {
				listPart.push({
					id: res.id,
					id_equipment: dataEquipment.id,
					nama_part: res.nama_part,
					keterangan_part: res.keterangan_part,
					part_img: res.part_img,
					action: "not upload",
				});
			});
		} else {
			listPart.push({
				id: "",
				id_equipment: dataEquipment.id,
				nama_part: "",
				keterangan_part: "",
				part_img: "",
				action: "not upload",
			});
		}

		setDataPart({
			eq_part: listPart,
		});
	};

	const showUpload = (id: any) => {
		const inputan = document.getElementById(id);
		inputan?.click();
	};

	const handleOnChanges = (event: any) => {
		if (event.target.name === "eq_image") {
			setFile(event.target.files[0]);
		} else if (event.target.name === "part_img") {
			if (files.length === 0) {
				setFiles([event.target.files[0]]);
			} else {
				let dataUpload = files;
				dataUpload.push(event.target.files[0]);
				setFiles(dataUpload);
			}
		}
	};

	const editEquipment = async (data: any) => {
		setIsLoading(true);
		const form = new FormData();
		form.append("nama", data.nama);
		form.append("keterangan_eq", data.keterangan_eq);
		if (file === "") {
			form.append("eq_image", data.eq_image);
		} else {
			form.append("eq_image", file);
		}
		try {
			const response = await EditEquipment(form, dataEquipment.id);
			if (response.data) {
				toast.success("Edit Equipment Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				showModal(true, content, true);
			}
		} catch (error) {
			toast.error("Edit Equipment Failed", {
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
		setIsLoading(false);
	};

	const editPart = async (payload: any) => {
		setIsLoading(true);
		let listPart: any = [];
		const form = new FormData();
		let indexFile = 0;
		files.map((res: any, i: number) => {
			form.append("part_img", files[i]);
		});
		payload.eq_part.map((res: any, i: number) => {
			listPart.push({
				id: res.id,
				id_equipment: dataEquipment.id,
				nama_part: res.nama_part,
				keterangan_part: res.keterangan_part,
				part_img: res.part_img,
				action:
					res.action === "not upload" ? res.action : `upload.${indexFile}`,
			});
			if (res.action !== "not upload") {
				indexFile = indexFile + 1;
			}
		});
		form.append("eq_part", JSON.stringify(listPart));
		try {
			const response = await EditEquipmentPart(form);
			if (response.data) {
				toast.success("Edit Equipment Part Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				setFile([]);
				showModal(false, "add", true);
			}
		} catch (error) {
			toast.error("Edit Equipment Part Failed", {
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
		setIsLoading(false);
	};

	const deletePart = async (id: string) => {
		try {
			const response = await DeleteEquipmentPart(id);
			if (response.data) {
				toast.success("Delete Equipment Part Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				showModal(true, content, true);
			}
		} catch (error) {
			toast.error("Delete Equipment Part Failed", {
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
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<div className='flex items-center gap-4'>
				{dataTabs.map((res: any, i: number) => (
					<button
						key={i}
						className={`text-base font-semibold ${
							res === activeTabs
								? "text-[#66B6FF] border-b-4 border-[#66B6FF]"
								: "text-[#9A9A9A]"
						}`}
						onClick={() => setActiveTabs(res)}
					>
						{res}
					</button>
				))}
			</div>
			{activeTabs === "Equipment" ? (
				<>
					<Formik
						initialValues={{ ...data }}
						validationSchema={equipmentSchema}
						onSubmit={(values) => {
							editEquipment(values);
						}}
						enableReinitialize
					>
						{({ handleChange, handleSubmit, errors, touched, values }) => (
							<Form onChange={handleOnChanges}>
								<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<Input
											id='nama'
											name='nama'
											placeholder='nama'
											label='Equipment Name'
											type='text'
											value={values.nama}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
										{errors.nama && touched.nama ? (
											<span className='text-red-500 text-xs'>
												{errors.nama}
											</span>
										) : null}
									</div>
									<div className='w-full'>
										{values.eq_image !== null &&
										values.eq_image.includes("https://res.cloudinary.com/") ? (
											<div>
												<label className='block mb-2 text-sm font-medium text-gray-900'>
													Certificate Image
												</label>
												<div className='flex'>
													<a
														href={values.eq_image}
														target='_blank'
														className='justify-center rounded-full border border-transparent bg-green-500 px-4 py-1 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mt-2 mr-2'
													>
														Show File
													</a>
													<p
														className='justify-center rounded-full border border-transparent bg-orange-500 px-4 py-1 text-sm font-medium text-white hover:bg-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mt-2 cursor-pointer'
														onClick={() => showUpload("eq_image")}
													>
														Change File
													</p>
													<input
														id='eq_image'
														name='eq_image'
														placeholder='Certificate Image'
														type='file'
														className='hidden'
													/>
												</div>
											</div>
										) : (
											<Input
												id='eq_image'
												name='eq_image'
												placeholder='eq_image'
												label='Equipment Image'
												type='file'
												onChange={handleChange}
												required={true}
												withLabel={true}
												className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
											/>
										)}
									</div>
								</Section>
								<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<InputArea
										id='keterangan_eq'
										name='keterangan_eq'
										placeholder='keterangan_eq'
										label='Description Equipment'
										value={values.keterangan_eq}
										onChange={handleChange}
										row={2}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
									{errors.keterangan_eq && touched.keterangan_eq ? (
										<span className='text-red-500 text-xs'>
											{errors.keterangan_eq}
										</span>
									) : null}
								</Section>
								<div className='mt-8 flex justify-end'>
									<div className='flex gap-2 items-center'>
										<button
											type='button'
											className={`inline-flex justify-center rounded-full border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 ${
												isLoading ? "disabled" : ""
											}`}
											disabled={isLoading}
											onClick={() => {
												handleSubmit();
											}}
										>
											{isLoading ? (
												<>
													<svg
														role='status'
														className='inline mr-3 w-4 h-4 text-white animate-spin'
														viewBox='0 0 100 101'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
													>
														<path
															d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
															fill='#E5E7EB'
														/>
														<path
															d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
															fill='currentColor'
														/>
													</svg>
													Loading
												</>
											) : (
												"Edit Equipment"
											)}
										</button>
									</div>
								</div>
							</Form>
						)}
					</Formik>
				</>
			) : (
				<div>
					<p className='hidden'>{JSON.stringify(dataPart)}</p>
					<Formik
						initialValues={{ ...dataPart }}
						// validationSchema={equipmentSchema}
						onSubmit={(values) => {
							editPart(values);
						}}
						enableReinitialize
					>
						{({
							handleChange,
							setFieldValue,
							handleSubmit,
							errors,
							touched,
							values,
						}) => (
							<Form onChange={handleOnChanges}>
								<FieldArray
									name='eq_part'
									render={(arrayPart) => (
										<>
											{values.eq_part.map((res, i) => (
												<div key={i}>
													<Section className='grid md:grid-cols-3 sm:grid-cols- xs:grid-cols-1 gap-2 mt-2'>
														<div className='w-full'>
															<Input
																id={`eq_part.${i}.nama_part`}
																name={`eq_part.${i}.nama_part`}
																placeholder='Part Name'
																label='Part Name'
																type='text'
																value={res.nama_part}
																onChange={handleChange}
																required={true}
																withLabel={true}
																className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
															/>
														</div>
														<div className='w-full'>
															<InputSelect
																id={`eq_part.${i}.keterangan_part`}
																name={`eq_part.${i}.keterangan_part`}
																placeholder='Description Part'
																label='Deskription Part'
																onChange={handleChange}
																required={true}
																withLabel={true}
																className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
															>
																<option defaultValue=''>
																	Choose a Description Part
																</option>
																<option
																	value='Rotating'
																	selected={
																		res.keterangan_part === "Rotating"
																			? true
																			: false
																	}
																>
																	Rotation Part
																</option>
																<option
																	value='Static'
																	selected={
																		res.keterangan_part === "Static"
																			? true
																			: false
																	}
																>
																	Static Part
																</option>
																<option
																	value='Consumable'
																	selected={
																		res.keterangan_part === "Consumable"
																			? true
																			: false
																	}
																>
																	Consumable Part
																</option>
															</InputSelect>
														</div>
														<div className='w-full'>
															{res.part_img !== null &&
															res.part_img.includes(
																"https://res.cloudinary.com/"
															) ? (
																<div>
																	<label className='block mb-2 text-sm font-medium text-gray-900'>
																		Part Image
																	</label>
																	<div className='flex'>
																		<a
																			href={res.part_img}
																			target='_blank'
																			className='justify-center rounded-full border border-transparent bg-green-500 px-4 py-1 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mt-2 mr-2'
																		>
																			Show File
																		</a>
																		<p
																			className='justify-center rounded-full border border-transparent bg-orange-500 px-4 py-1 text-sm font-medium text-white hover:bg-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mt-2 cursor-pointer'
																			onClick={() =>
																				showUpload(`eq_part.${i}.part_img`)
																			}
																		>
																			Change File
																		</p>
																		<input
																			id={`eq_part.${i}.part_img`}
																			name='part_img'
																			placeholder='Certificate Image'
																			type='file'
																			className='hidden'
																			onChange={() =>
																				setFieldValue(
																					`eq_part.${i}.action`,
																					`upload.${i}`
																				)
																			}
																		/>
																	</div>
																</div>
															) : (
																<Input
																	id={`eq_part.${i}.part_img`}
																	name='part_img'
																	placeholder='Part Image'
																	label='Part Image'
																	type='file'
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	onChange={() =>
																		setFieldValue(
																			`eq_part.${i}.action`,
																			`upload.${i}`
																		)
																	}
																/>
															)}
														</div>
													</Section>
													{i === values.eq_part.length - 1 ? (
														<a
															className='inline-flex text-green-500 mr-6 mt-1 cursor-pointer'
															onClick={() => {
																arrayPart.push({
																	id: "",
																	id_equipment: dataEquipment.id,
																	nama_part: "",
																	keterangan_part: "",
																	part_img: null,
																	action: "not upload",
																});
															}}
														>
															<Plus size={18} className='mr-1 mt-1' /> Add Part
														</a>
													) : null}
													{values.eq_part.length !== 1 ? (
														<a
															className='inline-flex text-red-500 cursor-pointer mt-1'
															onClick={() => {
																res.id !== "" ? deletePart(res.id) : null;
																arrayPart.remove(i);
															}}
														>
															<Trash2 size={18} className='mr-1 mt-1' />
															Remove Part
														</a>
													) : null}
												</div>
											))}
										</>
									)}
								/>
								<div className='mt-8 flex justify-end'>
									<div className='flex gap-2 items-center'>
										<button
											type='button'
											className={`inline-flex justify-center rounded-full border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 ${
												isLoading ? "disabled" : ""
											}`}
											disabled={isLoading}
											onClick={() => {
												handleSubmit();
											}}
										>
											{isLoading ? (
												<>
													<svg
														role='status'
														className='inline mr-3 w-4 h-4 text-white animate-spin'
														viewBox='0 0 100 101'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
													>
														<path
															d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
															fill='#E5E7EB'
														/>
														<path
															d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
															fill='currentColor'
														/>
													</svg>
													Loading
												</>
											) : (
												"Edit Equipment Part"
											)}
										</button>
									</div>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			)}
		</div>
	);
};
