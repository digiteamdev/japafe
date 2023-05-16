import { useEffect, useState } from "react";
import { SectionTitle, Content, Modal, Table, Button } from "../../../components";
import { User, Edit, Trash2, Eye } from "react-feather";
import { FormCreateUser } from "./formCreate";
import { GetUser } from "../../../services";

export const Register = () => {
	const [isModal, setIsModal] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [data, setData] = useState<any>([]);
	const [countData, setCountData] = useState<number>(0);
	const [modalContent, setModalContent] = useState<string>("add");
	const headerTabel = [
		{ name: "No" },
		{ name: "NIK" },
		{ name: "Name" },
		{ name: "Username" },
		{ name: "Action" },
	];

	useEffect(() => {
		getUser(1, 10);
	}, []);

	const showModal = (val: boolean, content: string) => {
		setIsModal(val);
		setModalContent(content);
	};

	const getUser = async (page: number, perpage: number) => {
		setIsLoading(true);
		try {
			const response = await GetUser(page, perpage);
			if (response.data) {
				setData(response.data.result);
				setCountData(response.data.totalData);
			}
		} catch (error) {
			setData([]);
		}
		setIsLoading(false);
	};

	const searcUser = () => {
		return false;
	};

	return (
		<div className='mt-14 lg:mt-20 md:mt-20 sm:mt-20 xs:mt-24'>
			<SectionTitle
				title='User'
				total={countData}
				icon={<User className='w-[36px] h-[36px]' />}
			/>
			<Content
				title='User'
				print={true}
				showModal={showModal}
				search={searcUser}
			>
				<Table header={headerTabel}>
					{isLoading ? (
						<tr className='border-b transition duration-300 ease-in-out hover:bg-gray-200'>
							<td
								colSpan={headerTabel?.length}
								className='whitespace-nowrap px-6 py-4 text-center text-lg'
							>
								<svg
									role='status'
									className='inline mr-3 w-4 h-4 text-gray-500 animate-spin'
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
							</td>
						</tr>
					) : data.length === 0 ? (
						<tr className='border-b transition duration-300 ease-in-out hover:bg-gray-200'>
							<td
								colSpan={headerTabel?.length}
								className='whitespace-nowrap px-6 py-4 text-center text-lg'
							>
								No Data
							</td>
						</tr>
					) : (
						data.map((res: any, i: number) => {
							return (
								<tr
									className='border-b transition duration-300 ease-in-out hover:bg-gray-200 text-md'
									key={i}
								>
									<td className='whitespace-nowrap px-6 py-4 w-[5%] text-center'>
										{i + 1}
									</td>
									<td className='whitespace-nowrap px-6 py-4 text-center'>
										{res.employee.NIK}
									</td>
									<td className='whitespace-nowrap px-6 py-4 text-center'>
										{res.employee.employee_name}
									</td>
									<td className='whitespace-nowrap px-6 py-4 text-center'>
										{res.username}
									</td>
									<td className='whitespace-nowrap px-6 py-4 w-[10%]'>
										<div>
											<Button
												className='bg-green-500 hover:bg-green-700 text-white py-2 px-2 rounded-md'
												onClick={() => {
													// setDataSelected(res);
													// showModal(true, "view", false);
												}}
											>
												<Eye color='white' />
											</Button>
											<Button
												className='mx-1 bg-orange-500 hover:bg-orange-700 text-white py-2 px-2 rounded-md'
												onClick={() => {
													// selectedData(res);
													// showModal(true,'edit', false);
												}}
											>
												<Edit color='white' />
											</Button>
											<Button
												className='bg-red-500 hover:bg-red-700 text-white py-2 px-2 rounded-md'
												onClick={() => {
													// setDataSelected(res);
													// showModal(true, "delete", false);
												}}
											>
												<Trash2 color='white' />
											</Button>
										</div>
									</td>
								</tr>
							);
						})
					)}
				</Table>
			</Content>
			<Modal
				title='User'
				isModal={isModal}
				content={modalContent}
				showModal={showModal}
			>
				<FormCreateUser content={modalContent} showModal={showModal} />
			</Modal>
		</div>
	);
};
