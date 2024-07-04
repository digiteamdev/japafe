import { useEffect, useState } from "react";
import { Menu, Bell } from 'react-feather';
import { Dropdown } from '../menu';
import { Notification } from '../notification';
import { getUsername, getImage, getPosition, getRole } from '../../../configs/session';
import { GetAllApprovalMr, GetAllApprovalSr, GetAllMRForApproval, GetAllDetailSr, GetAllMRPo, GetPurchaseSR } from "@/src/services";

interface props {
	isSidebar?: boolean;
	showSidebar?: () => void;
}

export const Header = ({ isSidebar, showSidebar }: props) => {

	const [username, setUsername] = useState<any>();
	const [image, setImage] = useState<any>(null);
	const [data, setData] = useState<any>([]);
	const [countData, setCountData] = useState<number>(0);

	useEffect( () => {
		let photo = getImage();
		let user = getUsername();
		let position = getPosition();
		let role = getRole()

		if (user === undefined) {
			setUsername("")
		}else{
			setUsername(user)
		}

		if( position === 'Director' && role ){
			getApproval()
		}else if(position !== 'Director' && role ){
			JSON.parse(role).map( (res: any) => {
				if(res.role.role_name === 'PURCHASING'){
					getAllApprovalMr()
				}
			})
		}else{
			setData([])
		}

		if (image !== undefined) {
			setImage(photo)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const getApproval = async () => {
		try {
			let datas: any = []
			let countDatas: number = 0
			const responseMr = await GetAllApprovalMr();
			const responseSr = await GetAllApprovalSr();
			if (responseMr.data) {
				responseMr.data.result.map((res: any) => {
					datas.push({...res, 'type': 'approvalMr'})
				})
				countDatas = countDatas + responseMr.data.totalData;
			}
			if (responseSr.data) {
				responseSr.data.result.map((res: any) => {
					datas.push({...res, 'type': 'approvalSr'})
				})
				countDatas = countDatas + responseSr.data.totalData;
			}
			setData(datas)
			setCountData(countDatas)
		} catch (error: any) {
			if (error.response.data.login) {
				setData([]);
			}
		}
	};

	const getAllApprovalMr = async () => {
		try {
			let datas: any = []
			let countDatas: number = 0
			const response = await GetAllMRForApproval();
			const responseSr = await GetAllDetailSr();
			const responsePr = await GetAllMRPo(1, 10, 'PO');
			const responseDmr = await GetAllMRPo(1, 10, 'DP');
			const responsePsr = await GetPurchaseSR(1, 10, 'SO');
			const responseDsr = await GetPurchaseSR(1, 10, 'DSO');
			if (response.data) {
				response.data.result.map((res: any) => {
					datas.push({...res, 'type': 'approvalMrPurchasing'})
				})
				countDatas = countDatas + response.data.totalData;
			}
			if (responseSr.data) {
				responseSr.data.result.map((res: any) => {
					datas.push({...res, 'type': 'approvalSrPurchasing'})
				})
				countDatas = countDatas + responseSr.data.totalData;
			}
			if (responsePr.data) {
				responsePr.data.result.map((res: any) => {
					datas.push({...res, 'type': 'purchaseMr'})
				})
				countDatas = countDatas + responsePr.data.totalData;
			}
			if (responseDmr.data) {
				responseDmr.data.result.map((res: any) => {
					datas.push({...res, 'type': 'purchaseDirectMr'})
				})
				countDatas = countDatas + responseDmr.data.totalData;
			}
			if (responsePsr.data) {
				responsePsr.data.result.map((res: any) => {
					datas.push({...res, 'type': 'purchaseSr'})
				})
				countDatas = countDatas + responsePsr.data.totalData;
			}
			if (responseDsr.data) {
				responseDsr.data.result.map((res: any) => {
					datas.push({...res, 'type': 'purchaseDirectSr'})
				})
				countDatas = countDatas + responseDsr.data.totalData;
			}
			setData(datas)
			setCountData(countDatas)
		} catch (error: any) {
			setData([]);
		}

	};

	return (
		<nav className={`${ isSidebar ? 'md:pl-80' : 'md:pl-3' } fixed z-10 w-full bg-blue-100 transition-all duration-500 ease-in-out`}>
			<div className='py-3 px-3 lg:px-5 lg:pl-3'>
				<div className='flex justify-between items-center'>
					<div className='flex justify-start items-center w-full'>
						<button
							type='button'
							onClick={showSidebar}
							className='hidden p-2 mr-4 rounded-full text-red-500 cursor-pointer lg:inline hover:text-white hover:bg-red-500'
						>
                            <Menu size={28}/>
						</button>
						<button
							onClick={showSidebar}
							className='p-2 mr-2 text-red-500 rounded-full cursor-pointer lg:hidden hover:text-white hover:bg-red-500 focus:bg-red-500 focus:ring-2 focus:ring-red-100 focus:text-white'
						>
                            <Menu size={28}/>
						</button>
						{/* <div className='relative mt-1 w-full'>
							<div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none text-primary-500'>
								<Search size={28}/>
							</div>
							<input
								type='text'
								name='search'
								className='bg-white text-lg border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-[90%] outline-primary-600 pl-11 p-2.5'
								placeholder='Search'
							/>
						</div> */}
					</div>
					<div className='flex items-center pr-3'>
						<Notification data={data} count={countData}/>
					</div>
					<div className='flex items-center'>
						<p className='mr-2'>{ username }</p>
						<Dropdown />
					</div>
				</div>
			</div>
		</nav>
	);
};
