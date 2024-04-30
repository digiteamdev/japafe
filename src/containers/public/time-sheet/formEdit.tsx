import { useEffect, useState } from "react";
import {
	Section,
	Input,
	InputDate,
	InputSelect,
	InputTime,
	InputArea,
} from "../../../components";
import { Formik, Form } from "formik";
import { activitySchema } from "../../../schema/master-data/activity/activitySchema";
import { AddTimeSheet, GetEmployeById } from "../../../services";
import { toast } from "react-toastify";
import { getIdUser } from "@/src/configs/session";
import moment from "moment";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	date: any;
	job: string;
	part_name: string;
	job_description: string;
	userId: string;
	actual_start: any;
	actual_finish: any;
	total_hours: string;
	type_timesheet: string;
}

export const FormEditTimeSheet = ({
	dataSelected,
	content,
	showModal,
}: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [userID, setUserId] = useState<string>("");
	const [employe, setEmploye] = useState<string>("");
	const [depart, setDepart] = useState<string>("");
	const [minDate, setMinDate] = useState<any>(new Date());
	const [maxDate, setMaxDate] = useState<any>(new Date());
	const [data, setData] = useState<data>({
		date: new Date(),
		job: "",
		part_name: "",
		job_description: "",
		userId: "",
		actual_start: new Date(),
		actual_finish: new Date(),
		total_hours: "",
		type_timesheet: "worktime",
	});

	useEffect(() => {
		settingData();
		dateInput();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
        setData({
			date: new Date(dataSelected.date),
			job: dataSelected.job,
			part_name: dataSelected.part_name,
			job_description: dataSelected.job_description,
			userId: dataSelected.userId,
			actual_start: new Date(dataSelected.actual_start),
			actual_finish: new Date(dataSelected.actual_finish),
			total_hours: dataSelected.total_hours,
			type_timesheet: dataSelected.type_timesheet,
		})
        setEmploye(dataSelected.user.employee.employee_name)
        setDepart(dataSelected.user.employee.sub_depart.name)
	};

	const dateInput = () => {
		let minDate: any = moment(dataSelected.date).subtract(3, "days");
		let maxDate: any = moment(dataSelected.date).add(1, "days");
		setMinDate(minDate);
		setMaxDate(maxDate);
	};

	const editTimeSheet = async (data: any) => {
		setIsLoading(true);
        try {
			const response = await AddTimeSheet(data);
			if (response) {
				toast.success("Add Time Sheet Success", {
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
			toast.error("Add Time Sheet Failed", {
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
				initialValues={data}
				// validationSchema={activitySchema}
				onSubmit={(values) => {
					editTimeSheet(values);
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
						<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<InputDate
									id='date'
									label='date'
									minDate={minDate}
									maxDate={maxDate}
									value={values.date}
									onChange={(value: any) => setFieldValue("date", value)}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='employe'
									name='employe'
									placeholder='Employe'
									label='Employe'
									type='text'
									value={employe}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='departement'
									name='departement'
									placeholder='Departement'
									label='Departement'
									type='text'
									value={depart}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputSelect
									id='type_timesheet'
									name='type_timesheet'
									placeholder='Type'
									label='Type'
									onChange={(event: any) => {
										setFieldValue("type_timesheet", event.target.value);
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option value='worktime' selected={ values.type_timesheet === 'worktime' ? true : false }>
										Work Time
									</option>
									<option value='overtime' selected={ values.type_timesheet === 'overtime' ? true : false } >Over Time</option>
								</InputSelect>
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2'>
							<div className='w-full'>
								<Input
									id='job'
									name='job'
									placeholder='Job No'
									label='Job No'
									type='text'
									value={values.job}
									onChange={handleChange}
									disabled={false}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='part_name'
									name='part_name'
									placeholder='Part Name'
									label='Part Name'
									type='text'
									value={values.part_name}
									onChange={handleChange}
									disabled={false}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputArea
									id='job_description'
									name='job_description'
									placeholder='Process / Job Description'
									label='Process / Job Description'
									type='text'
									value={values.job_description}
									onChange={handleChange}
									disabled={false}
									row={3}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='flex'></div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2'>
							<div className='w-full'>
								<InputDate
									id='actual_start'
									label='Start'
									showTimeSelect={true}
									value={values.actual_start}
									dateFormat='dd/MM/yyyy h:mm aa'
									onChange={(value: any) => {
										let start = moment(new Date(value));
										let finish = moment(new Date(values.actual_finish));
										let calculate = Math.ceil(
											moment.duration(finish.diff(start)).asHours()
										);
										setFieldValue("actual_start", value);
										setFieldValue("total_hours", `${calculate} jam`);
									}}
									withLabel={true}
									className='z-50 bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
							<div className='w-full'>
								<InputDate
									id='actual_finish'
									label='Finish'
									showTimeSelect={true}
									dateFormat='dd/MM/yyyy h:mm aa'
									value={values.actual_finish}
									onChange={(value: any) => {
										let start = moment(new Date(values.actual_start));
										let finish = moment(new Date(value));
										let calculate = Math.ceil(
											moment.duration(finish.diff(start)).asHours()
										);
										setFieldValue("actual_finish", value);
										setFieldValue("total_hours", `${calculate} jam`);
									}}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='total'
									name='total'
									placeholder='Total'
									label='Total'
									type='text'
									value={values.total_hours}
									disabled={true}
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
									) : content === "add" ? (
										"Save"
									) : (
										"Edit"
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
