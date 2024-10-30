import { useState } from "react";
import { Section, InputSelectSearch, InputArea, Input } from "../../../components";
import { Formik, Form } from "formik";
import { AddGolongan, AddPermit } from "../../../services";
import { toast } from "react-toastify";
import { rupiahFormat } from "@/src/utils";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	golongan: string;
	huruf: string;
	jabatan: string;
	t_keluarga: number;
	t_susu: number;
	t_jabatan: number;
	t_komunikasi: number;
	t_kehadiran: number;
	p_kedisiplinan: number;
	uang_makan: number;
	uang_transport: number;
}

export const FormCreateGolongan = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [data] = useState<data>({
        golongan: "",
        huruf: "",
        jabatan: "",
        t_keluarga: 0,
        t_susu: 0,
        t_jabatan: 0,
        t_komunikasi: 0,
        t_kehadiran: 0,
        p_kedisiplinan: 0,
        uang_makan: 0,
        uang_transport: 0,
	});

	const addGolongan = async (payload: data) => {
		setIsLoading(true);
		try {
            const body = {
                golongan: payload.golongan,
                huruf: payload.huruf,
                jabatan: payload.jabatan,
                t_keluarga: parseInt(payload.t_keluarga.toString()),
                t_susu: parseInt(payload.t_susu.toString()),
                t_jabatan: parseInt(payload.t_jabatan.toString()),
                t_komunikasi: parseInt(payload.t_komunikasi.toString()),
                t_kehadiran: parseInt(payload.t_kehadiran.toString()),
                p_kedisiplinan: parseInt(payload.p_kedisiplinan.toString()),
                uang_makan: parseInt(payload.uang_makan.toString()),
                uang_transport: parseInt(payload.uang_transport.toString()),
            }
			const response = await AddGolongan(body);
			if (response.data) {
				toast.success("Add Golongan Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				showModal(false, content, true);
			}
		} catch (error) {
			toast.error("Add Golongan Failed", {
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

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			<Formik
				initialValues={{ ...data }}
				// validationSchema={sumarySchema}
				onSubmit={(values) => {
					addGolongan(values);
				}}
				enableReinitialize
			>
				{({
					handleChange,
					handleSubmit,
					setFieldValue,
					errors,
					touched,
					values,
				}) => (
					<Form>
						<h1 className='text-xl font-bold mt-3'>Golongan</h1>
						<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='golongan'
									name='golongan'
									placeholder='Golongan'
									label='Golongan'
									type='text'
									value={values.golongan}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
                            <div className='w-full'>
								<Input
									id='huruf'
									name='huruf'
									placeholder='Huruf'
									label='Huruf'
									type='text'
									value={values.huruf}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
                            <div className='w-full'>
								<Input
									id='jabatan'
									name='jabatan'
									placeholder='Jabatan'
									label='Jabatan'
									type='text'
									value={values.jabatan}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
                            <div className='w-full'>
								<Input
									id='t_keluarga'
									name='t_keluarga'
									placeholder='Tunjangan keluarga'
									label='Tunjangan keluarga'
									type='text'
                                    pattern="\d*"
									value={rupiahFormat(values.t_keluarga)}
									onChange={(e:any) => {
                                        let jumlah = e.target.value
                                        .toString()
                                        .replaceAll(".", "");
                                    setFieldValue("t_keluarga", jumlah);
                                    }}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
                            <div className='w-full'>
								<Input
									id='t_susu'
									name='t_susu'
									placeholder='Tunjangan susu'
									label='Tunjangan susu'
									type='text'
                                    pattern="\d*"
									value={rupiahFormat(values.t_susu)}
									onChange={(e:any) => {
                                        let jumlah = e.target.value
                                        .toString()
                                        .replaceAll(".", "");
                                    setFieldValue("t_susu", jumlah);
                                    }}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
                            <div className='w-full'>
								<Input
									id='t_jabatan'
									name='t_jabatan'
									placeholder='Tunjangan jabatan'
									label='Tunjangan jabatan'
									type='text'
                                    pattern="\d*"
									value={rupiahFormat(values.t_jabatan)}
									onChange={(e:any) => {
                                        let jumlah = e.target.value
                                        .toString()
                                        .replaceAll(".", "");
                                    setFieldValue("t_jabatan", jumlah);
                                    }}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
                            <div className='w-full'>
								<Input
									id='t_komunikasi'
									name='t_komunikasi'
									placeholder='Tunjangan komunikasi'
									label='Tunjangan komunikasi'
									type='text'
                                    pattern="\d*"
									value={rupiahFormat(values.t_komunikasi)}
									onChange={(e:any) => {
                                        let jumlah = e.target.value
                                        .toString()
                                        .replaceAll(".", "");
                                    setFieldValue("t_komunikasi", jumlah);
                                    }}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
                            <div className='w-full'>
								<Input
									id='t_kehadiran'
									name='t_kehadiran'
									placeholder='Tunjangan kehadiran'
									label='Tunjangan kehadiran'
									type='text'
                                    pattern="\d*"
									value={rupiahFormat(values.t_kehadiran)}
									onChange={(e:any) => {
                                        let jumlah = e.target.value
                                        .toString()
                                        .replaceAll(".", "");
                                    setFieldValue("t_kehadiran", jumlah);
                                    }}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
                            <div className='w-full'>
								<Input
									id='p_kedisiplinan'
									name='p_kedisiplinan'
									placeholder='Tunjangan kedisiplinan'
									label='Tunjangan kedisiplinan'
									type='text'
                                    pattern="\d*"
									value={rupiahFormat(values.p_kedisiplinan)}
									onChange={(e:any) => {
                                        let jumlah = e.target.value
                                        .toString()
                                        .replaceAll(".", "");
                                    setFieldValue("p_kedisiplinan", jumlah);
                                    }}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
                            <div className='w-full'>
								<Input
									id='uang_makan'
									name='uang_makan'
									placeholder='Uang makan'
									label='Uang makan'
									type='text'
                                    pattern="\d*"
									value={rupiahFormat(values.uang_makan)}
									onChange={(e:any) => {
                                        let jumlah = e.target.value
                                        .toString()
                                        .replaceAll(".", "");
                                    setFieldValue("uang_makan", jumlah);
                                    }}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
                            <div className='w-full'>
								<Input
									id='uang_transport'
									name='uang_transport'
									placeholder='Uang transport'
									label='Uang transport'
									type='text'
                                    pattern="\d*"
									value={rupiahFormat(values.uang_transport)}
									onChange={(e:any) => {
                                        let jumlah = e.target.value
                                        .toString()
                                        .replaceAll(".", "");
                                    setFieldValue("uang_transport", jumlah);
                                    }}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<div className='mt-8 flex justify-end'>
							<div className='flex gap-2 items-center'>
								<button
									type='button'
									className='inline-flex justify-center rounded-full border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
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
										"Save"
									)}
								</button>
							</div>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};
