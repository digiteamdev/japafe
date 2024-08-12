import { useEffect, useState } from "react";
import {useRouter} from "next/router";
import { removeToken } from "../../../configs/session";
import {
	SectionTitle,
	Content,
	Modal,
	Table,
	Button,
	ModalDelete,
	Pagination
} from "../../../components";
import { Box, Eye, Edit, Trash2 } from "react-feather";
import { FormCreateWarehouse } from "./formCreate";
import { ViewWarehouse } from "./view";
import { FormEditWarehouse } from './formEdit';
import { GetMaterialNew, SearchMaterialNew, DeleteMaterialNew } from "../../../services";
import { toast } from "react-toastify";
import { changeDivisi, formatRupiah } from "@/src/utils";

export const Warehouse = () => {

	const router = useRouter();
	const [isModal, setIsModal] = useState<boolean>(false);
	const [modalContent, setModalContent] = useState<string>("add");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [dataSelected, setDataSelected] = useState<any>(false);
	const [countData, setCountData] = useState<number>(0);
	const [data, setData] = useState<any>([]);
	const [page, setPage] = useState<number>(1);
	const [perPage, setperPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPage, setTotalPage] = useState<number>(1);
	const headerTabel = [
		{ name: "Material Name" },
		{ name: "Satuan" },
		{ name: "Stock" },
		{ name: "Price" },
		{ name: "Action" },
	];

	useEffect(() => {
		getMaterial(page, perPage);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const showModal = (val: boolean, content: string, reload: boolean) => {
		setIsModal(val);
		setModalContent(content);
		// if(!val){
		// 	setDataSelected({id: '',name: ''})
		// }
		if (reload) {
			getMaterial(page, perPage);
		}
	};

	const getMaterial = async (page: number, perpage: number) => {
		setIsLoading(true);
		try {
			const response = await GetMaterialNew(page, perpage);
			if (response.data) {
				setData(response.data.result);
				setCountData(response.data.totalData);
				setTotalPage(Math.ceil( response.data.totalData / perpage));
			}
		} catch (error: any) {
			if(error.response.data.login){
				setData([]);
			}else{
				removeToken();
				router.push('/');
			}
		}
		setIsLoading(false);
	};

	const searchMaterial = async (
		page: number,
		limit: number,
		search: string
	) => {
		setIsLoading(true);
		try {
			const response = await SearchMaterialNew(page, limit, search);
			if (response.data) {
				setData(response.data.result);
				setCountData(response.data.totalData);
				setTotalPage(Math.ceil( response.data.totalData / perPage));
			}
		} catch (error) {
			setData([]);
		}
		setIsLoading(false);
	};

	const deleteMaterial = async (id: string) => {
		try {
			const response = await DeleteMaterialNew(id);
			if(response.data){
				toast.success("Delete Material Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				getMaterial(1, 10);
			}
		} catch (error) {
			toast.error("Delete Material Failed", {
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

	return (
		<div className='mt-14 lg:mt-20 md:mt-20 sm:mt-20 xs:mt-24'>
			<SectionTitle
				title='Warehouse'
				total={countData}
				icon={<Box className='w-[36px] h-[36px]' />}
			/>
			<Content
				title='Warehouse'
				print={true}
				marketing={false}
				changeDivisi={changeDivisi}
				timeSheet={false}
				changeTimeSheet={changeDivisi}
				mr={false}
				changeMr={changeDivisi}
				showModal={showModal}
				search={searchMaterial}
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
									className='border-b transition duration-300 ease-in-out hover:bg-gray-200 text-sm'
									key={i}
								>
									<td className='whitespace-nowrap p-1 w-[5%]'>
										{ res.name } { res.spesifikasi }
									</td>
									<td className='whitespace-nowrap p-1 text-center'>
										{ res.satuan }
									</td>
									<td className='whitespace-nowrap p-1 text-center'>
										{ res.jumlah_Stock }
									</td>
									<td className='whitespace-nowrap p-1 text-center'>
										{ formatRupiah(res.harga.toString()) }
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
											<Button
												className='mx-1 bg-orange-500 hover:bg-orange-700 text-white p-1 rounded-md'
												onClick={() => {
													setDataSelected(res);
													showModal(true,'edit', false);
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
										</div>
									</td>
								</tr>
							);
						})
					)}
				</Table>
				{
					totalPage > 1 ? (
						<Pagination 
							currentPage={currentPage} 
							pageSize={perPage} 
							siblingCount={1} 
							totalCount={countData} 
							onChangePage={(value: any) => {
								setCurrentPage(value);
								getMaterial(value, perPage);
							}}
						/>
					) : null
				}
			</Content>
			{modalContent === "delete" ? (
				<ModalDelete
					data={dataSelected}
					isModal={isModal}
					content={modalContent}
					showModal={showModal}
					onDelete={deleteMaterial}
				/>
			) : (
				<Modal
				title='Warehouse'
				isModal={isModal}
				content={modalContent}
				showModal={showModal}
			>
				{modalContent === "view" ? (
					<ViewWarehouse dataSelected={dataSelected} content={modalContent} showModal={showModal}/>
					) : modalContent === "add" ? (
                        <FormCreateWarehouse content={modalContent} showModal={showModal} />
				) : (
					<FormEditWarehouse content={modalContent} showModal={showModal} dataSelected={dataSelected}/>
				)}
				</Modal>
			)}
		</div>
	);
};
