import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { removeToken } from "../../configs/session";
import { Modal } from "../../components";
import { User, Edit } from "react-feather";
import { GetAccount } from "../../services";
import { FormChangePassword } from "./formChangePassword";
import moment from "moment";

export const Account = () => {
	const router = useRouter();
	const [isModal, setIsModal] = useState<boolean>(false);
	const [user, setUser] = useState<any>(null);

	useEffect(() => {
		getUser();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getUser = async () => {
		try {
			const response = await GetAccount();
			if (response.data) {
				setUser(response.data.result[0]);
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

	return (
		<div className='mt-14 lg:mt-20 md:mt-20 sm:mt-20 xs:mt-24'>
			<div className='grid grid-cols-2'>
				<div className='flex items-center'>
					<div className='bg-red-200 p-[12px] flex justify-center items-center rounded-[23px]'>
						<User className='w-[36px] h-[36px]' />
					</div>

					<div className='ml-[13px]'>
						<h1 className='text-3xl font-bold'>Account</h1>
						<p className='text-small'>{ user !== null ? user.username : "" }</p>
					</div>
				</div>
				<div className='mt-4 flex justify-end w-full'>
					<button className='bg-primary-100 hover:bg-primary-50 text-black py-2 px-4 rounded-lg inline-flex justify-center border border-primary-300 w-[50%] right-0' onClick={ () => showModal(true, "",false)}>
						<Edit size={18} className='mt-[5px]' />
						<span className='ml-2'>Change Password</span>
					</button>
				</div>
			</div>
			<div className="mt-8">
				<table className="w-full">
					<thead></thead>
					<tbody>
						<tr>
							<td className="w-[30%] text-2xl">Username</td>
							<td className="w-[70%] text-2xl">: { user !== null ? user.username : "" }</td>
						</tr>
						<tr>
							<td className="w-[30%] text-2xl">Name</td>
							<td className="w-[70%] text-2xl">: { user !== null ? user.employee.employee_name : "" }</td>
						</tr>
						<tr>
							<td className="w-[30%] text-2xl">Email</td>
							<td className="w-[70%] text-2xl">: { user !== null ? user.employee.email : "" }</td>
						</tr>
						<tr>
							<td className="w-[30%] text-2xl">Phone Number</td>
							<td className="w-[70%] text-2xl">: { user !== null ? user.employee.phone_number : "" }</td>
						</tr>
						<tr>
							<td className="w-[30%] text-2xl">ID Card</td>
							<td className="w-[70%] text-2xl">: { user !== null ? user.employee.id_card : "" }</td>
						</tr>
						<tr>
							<td className="w-[30%] text-2xl">Gender</td>
							<td className="w-[70%] text-2xl">: { user !== null ? user.employee.gender : "" }</td>
						</tr>
						<tr>
							<td className="w-[30%] text-2xl">Departement</td>
							<td className="w-[70%] text-2xl">: { user !== null ? user.employee.sub_depart.name : "" }</td>
						</tr>
						<tr>
							<td className="w-[30%] text-2xl">Start Join</td>
							<td className="w-[70%] text-2xl">: { user !== null ? moment(user.employee.start_join).format("DD-MMMM-YYYY") : "" }</td>
						</tr>
					</tbody>
				</table>
			</div>
			<Modal
				title='Change Password'
				isModal={isModal}
				content="edit"
				showModal={showModal}
			>
				<FormChangePassword showModal={showModal} id={user !== null ? user.id : ""} />
			</Modal>
		</div>
	);
};
