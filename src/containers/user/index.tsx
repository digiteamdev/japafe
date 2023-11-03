import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { removeToken, setImage } from "../../configs/session";
import { Modal } from "../../components";
import { User, Edit } from "react-feather";
import { GetAccount, EditPhoto } from "../../services";
import { FormChangePassword } from "./formChangePassword";
import moment from "moment";
import Image from "next/image";
import { toast } from "react-toastify";

export const Account = () => {
	const hiddenFileInput: any = useRef(null);
	const router = useRouter();
	const [isModal, setIsModal] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [user, setUser] = useState<any>(null);
	const [photo, setPhoto] = useState<any>(null);

	useEffect(() => {
		getUser();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getUser = async () => {
		try {
			const response = await GetAccount();
			if (response.data) {
				setUser(response.data.result[0]);
				setPhoto(null);
			}
		} catch (error: any) {
			if (error.response.data.login) {
				setUser(null);
			} else {
				removeToken();
				router.push("/");
			}
		}
	};

	const showModal = (val: boolean, content: string, reload: boolean) => {
		setIsModal(val);
	};

	const showUpload = (id: any) => {
		const inputan = document.getElementById(id);
		inputan?.click();
	};

	const editPhoto = async () => {
		setIsLoading(true);
		let form = new FormData();
		form.append("photo", photo);
		try {
			const response = await EditPhoto(user.employee.id, form);
			if (response) {
				setImage(response.data.results.photo)
				getUser();
				toast.success("Change Photo Success", {
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
		} catch (error) {
			toast.error("Change Photo Failed", {
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
		<div className='mt-14 lg:mt-20 md:mt-20 sm:mt-20 xs:mt-24'>
			<div className='grid grid-cols-2'>
				<div className='flex items-center'>
					<div className='bg-red-200 p-[12px] flex justify-center items-center rounded-[23px]'>
						<User className='w-[36px] h-[36px]' />
					</div>

					<div className='ml-[13px]'>
						<h1 className='text-3xl font-bold'>Account</h1>
						<p className='text-small'>{user !== null ? user.username : ""}</p>
					</div>
				</div>
				<div className='mt-4 flex justify-end w-full'>
					<button
						className='bg-primary-100 hover:bg-primary-50 text-black py-2 px-4 rounded-lg inline-flex justify-center border border-primary-300 w-[50%] right-0'
						onClick={() => showModal(true, "", false)}
					>
						<Edit size={18} className='mt-[5px]' />
						<span className='ml-2'>Change Password</span>
					</button>
				</div>
			</div>
			<div className='mt-8'>
				{user === null ? null : user.employee.photo === null ? (
					<div className='w-full flex justify-center mb-4'>
						<div className='rounded-lg bg-gray-400'>
							<div
								className='absolute cursor-pointer mt-[-6px] ml-20 bg-red-300 p-1 rounded-full'
								onClick={() => showUpload("upload")}
							>
								<Edit size={20} />
							</div>
							<User size={100} />
						</div>
					</div>
				) : photo !== null ? (
					<div className='w-full flex justify-center mb-4'>
						<div className='rounded-2xl bg-gray-400'>
							<div
								className='absolute cursor-pointer mt-[-6px] ml-20 bg-red-300 p-1 rounded-full'
								onClick={() => showUpload("upload")}
							>
								<Edit size={20} />
							</div>
							<Image
								className='rounded-2xl'
								src={URL.createObjectURL(photo)}
								width={100}
								height={100}
								alt='Picture Employe'
							/>
						</div>
					</div>
				) : (
					<div className='w-full flex justify-center mb-4'>
						<div className='rounded-2xl bg-gray-400'>
							<div
								className='absolute cursor-pointer mt-[-6px] ml-20 bg-red-300 p-1 rounded-full'
								onClick={() => showUpload("upload")}
							>
								<Edit size={20} />
							</div>
							<Image
								className='rounded-2xl'
								src={user.employee.photo}
								width={100}
								height={100}
								alt='Picture Employe'
							/>
						</div>
					</div>
				)}
				<input
					id='upload'
					name='upload'
					placeholder='Certificate Image'
					type='file'
					accept='image/*'
					ref={hiddenFileInput}
					className='hidden'
					onChange={(e: any) => setPhoto(e.target.files[0])}
				/>
				{photo !== null ? (
					<div className='w-full flex justify-center mb-4'>
						<button
							className={`${isLoading ? 'cursor-not-allowed' : ''}  bg-primary-100 hover:bg-primary-50 text-black py-2 px-2 rounded-lg inline-flex justify-center border border-primary-300 right-0`}
							onClick={() => editPhoto()}
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
								<span className='ml-2'>Change Image</span>
							)}
						</button>
					</div>
				) : null}
				<table className='w-full'>
					<thead></thead>
					<tbody>
						<tr>
							<td className='w-[30%] text-2xl'>Username</td>
							<td className='w-[70%] text-2xl'>
								: {user !== null ? user.username : ""}
							</td>
						</tr>
						<tr>
							<td className='w-[30%] text-2xl'>Name</td>
							<td className='w-[70%] text-2xl'>
								: {user !== null ? user.employee.employee_name : ""}
							</td>
						</tr>
						<tr>
							<td className='w-[30%] text-2xl'>Email</td>
							<td className='w-[70%] text-2xl'>
								: {user !== null ? user.employee.email : ""}
							</td>
						</tr>
						<tr>
							<td className='w-[30%] text-2xl'>Phone Number</td>
							<td className='w-[70%] text-2xl'>
								: {user !== null ? user.employee.phone_number : ""}
							</td>
						</tr>
						<tr>
							<td className='w-[30%] text-2xl'>ID Card</td>
							<td className='w-[70%] text-2xl'>
								: {user !== null ? user.employee.id_card : ""}
							</td>
						</tr>
						<tr>
							<td className='w-[30%] text-2xl'>Gender</td>
							<td className='w-[70%] text-2xl'>
								: {user !== null ? user.employee.gender : ""}
							</td>
						</tr>
						<tr>
							<td className='w-[30%] text-2xl'>Departement</td>
							<td className='w-[70%] text-2xl'>
								: {user !== null ? user.employee.sub_depart.name : ""}
							</td>
						</tr>
						<tr>
							<td className='w-[30%] text-2xl'>Position</td>
							<td className='w-[70%] text-2xl'>
								: {user !== null ? user.employee.position : ""}
							</td>
						</tr>
						<tr>
							<td className='w-[30%] text-2xl'>Start Join</td>
							<td className='w-[70%] text-2xl'>
								:{" "}
								{user !== null
									? moment(user.employee.start_join).format("DD-MMMM-YYYY")
									: ""}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<Modal
				title='Change Password'
				isModal={isModal}
				content='edit'
				showModal={showModal}
			>
				<FormChangePassword
					showModal={showModal}
					id={user !== null ? user.id : ""}
				/>
			</Modal>
		</div>
	);
};
