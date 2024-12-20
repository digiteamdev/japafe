import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
	SectionTitle,
	Content,
	Modal,
	Table,
	Button,
	ModalDelete,
	Pagination,
	InputDate,
	Section,
} from "../../../components";
import { Send, Edit, Eye, Trash2, Printer } from "react-feather";
import { FormCreateMr } from "./formCreate";
import { ViewMR } from "./view";
import { FormEditMr } from "./formEdit";
import { GetMr, SearchMr, DeleteMR } from "../../../services";
import { toast } from "react-toastify";
import { removeToken, getRole } from "../../../configs/session";
import moment from "moment";
import { changeDivisi } from "@/src/utils";

export const Mr = () => {
	const router = useRouter();
	const [isModal, setIsModal] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [countData, setCountData] = useState<number>(0);
	const [dataSelected, setDataSelected] = useState<any>(false);
	const [data, setData] = useState<any>([]);
	const [modalContent, setModalContent] = useState<string>("add");
	const [statusMr, setStatusMr] = useState<string>("all");
	const [page, setPage] = useState<number>(1);
	const [perPage, setperPage] = useState<number>(10);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPage, setTotalPage] = useState<number>(1);
	const [dateStart, setDateStart] = useState<any>(new Date());
	const [dateFinish, setDateFinish] = useState<any>(new Date());
	const [isShowPrint, setIsShowPrint] = useState<any>(false);
	const headerTabel = [
		{ name: "MR No" },
		{ name: "No Job" },
		{ name: "MR Date" },
		{ name: "Request By" },
		{ name: "Action" },
	];

	useEffect(() => {
		let role: any = getRole();
		getMr(page, perPage);
		if (role) {
			JSON.parse(role).map((res: any) => {
				res.role?.role_name === "PURCHASING" ? setIsShowPrint(true) : null;
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [statusMr]);

	const showModal = (val: boolean, content: string, reload: boolean) => {
		setIsModal(val);
		setModalContent(content);
		// if(!val){
		// 	setDataSelected({id: '',name: ''})
		// }
		if (reload) {
			getMr(page, perPage);
		}
	};

	const getMr = async (page: number, perpage: number) => {
		setIsLoading(true);
		try {
			const response = await GetMr(page, perpage, statusMr);
			if (response.data) {
				setData(response.data.result);
				setCountData(response.data.totalData);
				setTotalPage(Math.ceil(response.data.totalData / perpage));
			}
		} catch (error: any) {
			if (error.response.data.login) {
				setData([]);
			} else {
				removeToken();
				router.push("/");
			}
		}
		setIsLoading(false);
	};

	const searchMaterialStock = async (
		page: number,
		limit: number,
		search: string
	) => {
		setIsLoading(true);
		try {
			const response = await SearchMr(page, limit, search, statusMr);
			if (response.data) {
				setData(response.data.result);
			}
		} catch (error) {
			setData([]);
		}
		setIsLoading(false);
	};

	const deleteMR = async (id: string) => {
		try {
			const response = await DeleteMR(id);
			if (response.data) {
				toast.success("Delete Material Request Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				getMr(1, 10);
			}
		} catch (error) {
			toast.error("Delete Material Request Failed", {
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
		setIsModal(false);
	};

	const bgMr = (status: string) => {
		switch (status) {
			case "Request":
				return "hover:bg-gray-200";
			case "Approval":
				return "bg-yellow-500 hover:bg-yellow-200";
			case "Purchase":
				return "bg-orange-500 hover:bg-orange-200";
			case "Receive":
				return "bg-green-500 hover:bg-green-200";
			case "Finish":
				return "bg-green-500 hover:bg-green-200";
			case "Reject":
				return "bg-red-500 hover:bg-red-200";
			default:
				return "hover:bg-gray-200";
		}
	};

	const changeMr = (data: string) => {
		setStatusMr(data);
	};

	return (
		<div className='mt-14 lg:mt-20 md:mt-20 sm:mt-20 xs:mt-24'>
			<SectionTitle
				title='Material Request'
				total={countData}
				icon={<Send className='w-[36px] h-[36px]' />}
				informasi={
					<div className='right-2 mt-3'>
						<div className='grid grid-cols-3 gap-2'>
							<div className='flex'>
								<div className='bg-white border border-black w-4 h-4 mr-2'></div>
								<div className='text-sm'>Request</div>
							</div>
							<div className='flex'>
								<div className='bg-yellow-500 border border-black w-4 h-4 mt-1 mr-2'></div>
								<div className='text-sm'>Approval</div>
							</div>
							<div className='flex'>
								<div className='bg-orange-500 border border-black w-4 h-4 mt-1 mr-2'></div>
								<div className='text-sm'>Purchase</div>
							</div>
							{/* <div className='flex'>
								<div className='bg-blue-500 border border-black w-4 h-4 mt-1 mr-2'></div>
								<div className='text-sm'>Receive</div>
							</div> */}
							<div className='flex'>
								<div className='bg-green-500 border border-black w-4 h-4 mt-1 mr-2'></div>
								<div className='text-sm'>Finish</div>
							</div>
							<div className='flex'>
								<div className='bg-red-500 border border-black w-4 h-4 mt-1 mr-2'></div>
								<div className='text-sm'>Reject</div>
							</div>
						</div>
					</div>
				}
			/>
			<Content
				title='Material Request'
				print={true}
				marketing={false}
				changeDivisi={changeDivisi}
				timeSheet={false}
				changeTimeSheet={changeDivisi}
				mr={true}
				changeMr={changeMr}
				showModal={showModal}
				search={searchMaterialStock}
			>
				{isShowPrint ? (
					<Section className='grid sm:grid-cols-1 md:grid-cols-3 gap-2 my-2'>
						<div className='w-full'>
							<InputDate
								id='date'
								label='date'
								dateFormat='dd/MM/yyyy'
								value={dateStart}
								onChange={(value: any) => setDateStart(value)}
								withLabel={false}
								className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
								classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
							/>
						</div>
						<div className='w-full'>
							<InputDate
								id='date'
								label='date'
								dateFormat='dd/MM/yyyy'
								minDate={dateStart}
								value={dateFinish}
								onChange={(value: any) => setDateFinish(value)}
								withLabel={false}
								className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
								classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
							/>
						</div>
						<div className='flex'>
							<Button
								className='bg-green-500 hover:bg-green-700 text-white p-1 rounded-md w-full mr-2 text-center h-[55%]'
								onClick={async () =>
									(window.location.href =
										process.env.BASE_URL +
										`/MRCsv?dateStar=${dateStart}&dateEnd=${dateFinish}&statusMr=${statusMr}`)
								}
							>
								<Printer color='white' className='mx-auto' />
							</Button>
						</div>
					</Section>
				) : null}
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
									className={`border-b cursor-pointer transition duration-300 ease-in-out  text-sm`}
									key={i}
								>
									<td
										className={`whitespace-nowrap p-1 text-center ${bgMr(
											res.statusMr
										)}`}
									>
										{res.no_mr}
									</td>
									<td className='whitespace-nowrap p-1 text-center'>
										{res.job_no}
									</td>
									<td className='whitespace-nowrap p-1 text-center'>
										{moment(res.date_mr).format("DD-MM-YYYY")}
									</td>
									<td className='whitespace-nowrap p-1 text-center'>
										{res.user.employee.employee_name}
									</td>
									<td className='whitespace-nowrap p-1 w-[10%] text-center'>
										<div>
											<Button
												className='bg-green-500 hover:bg-green-700 text-white p-1 rounded-md'
												onClick={() => {
													setDataSelected(res);
													showModal(true, "view", false);
												}}
											>
												<Eye color='white' />
											</Button>
											{res.status_spv !== "valid" ||
											res.status_manager !== "valid" ? (
												<>
													<Button
														className='mx-1 bg-orange-500 hover:bg-orange-700 text-white p-1 rounded-md'
														onClick={() => {
															setDataSelected(res);
															showModal(true, "edit", false);
														}}
													>
														<Edit color='white' />
													</Button>
													<Button
														className='bg-red-500 hover:bg-red-700 text-white p-1 rounded-md'
														onClick={() => {
															setDataSelected(res);
															showModal(true, "delete", false);
														}}
													>
														<Trash2 color='white' />
													</Button>
												</>
											) : null}
										</div>
									</td>
								</tr>
							);
						})
					)}
				</Table>
				{totalPage > 1 ? (
					<Pagination
						currentPage={currentPage}
						pageSize={perPage}
						siblingCount={1}
						totalCount={countData}
						onChangePage={(value: any) => {
							setCurrentPage(value);
							getMr(value, perPage);
						}}
					/>
				) : null}
			</Content>
			{modalContent === "delete" ? (
				<ModalDelete
					data={dataSelected}
					isModal={isModal}
					content={modalContent}
					showModal={showModal}
					onDelete={deleteMR}
				/>
			) : (
				<Modal
					title='Material Request'
					isModal={isModal}
					content={modalContent}
					showModal={showModal}
				>
					{modalContent === "view" ? (
						<ViewMR
							dataSelected={dataSelected}
							content={modalContent}
							showModal={showModal}
						/>
					) : modalContent === "add" ? (
						<FormCreateMr content={modalContent} showModal={showModal} />
					) : (
						<FormEditMr
							content={modalContent}
							showModal={showModal}
							dataSelected={dataSelected}
						/>
					)}
				</Modal>
			)}
		</div>
	);
};
