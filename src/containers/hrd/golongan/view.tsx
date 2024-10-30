import { rupiahFormat } from "@/src/utils";
import { Section } from "../../../components";

interface props {
	dataSelected: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewGolongan = ({ dataSelected, showModal }: props) => {
    
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Golongan</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Golongan
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected?.golongan}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Huruf
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected?.huruf}
									</td>
								</tr>
                                <tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Jabatan
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected?.jabatan}
									</td>
								</tr>
                                <tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Tunjangan keluarga
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{rupiahFormat(dataSelected?.t_keluarga)}
									</td>
								</tr>
                                <tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Tunjangan jabatan
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{rupiahFormat(dataSelected?.t_jabatan)}
									</td>
								</tr>
                                <tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Tunjangan komunikasi
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{rupiahFormat(dataSelected?.t_komunikasi)}
									</td>
								</tr>
                                <tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Tunjangan susu
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{rupiahFormat(dataSelected?.t_susu)}
									</td>
								</tr>
                                <tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Tunjangan kehadiran
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{rupiahFormat(dataSelected?.t_kehadiran)}
									</td>
								</tr>
                                <tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Tunjangan kedisiplinan
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{rupiahFormat(dataSelected?.p_kedisiplinan)}
									</td>
								</tr>
                                <tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Uang makan
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{rupiahFormat(dataSelected?.uang_makan)}
									</td>
								</tr>
                                <tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Uang transport
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{rupiahFormat(dataSelected?.uang_transport)}
									</td>
								</tr>
							</table>
						</div>
					</Section>
				</>
			) : null}
		</div>
	);
};
