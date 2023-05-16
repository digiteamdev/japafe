import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from 'react';
import { FilePlus, X, Edit, FileText } from 'react-feather';
import { ReactNode } from "react";

interface props {
	title?: string;
	isModal?: boolean;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
	children: ReactNode;
}

export const Modal = ({ title, isModal, content, showModal,children  }: props) => {
	return (
		<Transition appear show={isModal} as={Fragment}>
			<Dialog as='div' className='relative w-full' 
                onClose={() => showModal(false,content, false)}
            >
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-black z-20 bg-opacity-25 w-full h-screen' />
				</Transition.Child>

				<div className='fixed inset-0 z-40 overflow-y-auto w-full'>
					<div className='flex min-h-full items-center justify-center p-4 text-center'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							<Dialog.Panel className='w-full max-w-6xl transform overflow-x-auto rounded-lg bg-white text-left align-middle shadow-xl transition-all'>
								<div
									className={`flex items-center justify-between px-5 py-[10px] ${ content === 'add' ? 'bg-primary-400' : content === 'view' ? 'bg-green-700' : 'bg-orange-400'}`}
								>
									<div className='flex items-center gap-2'>
										<div className='w-10 h-10 rounded-full bg-white flex justify-center items-center'>
											{ content === 'add' ? ( <FilePlus /> ) : content === 'edit' ? ( <Edit />) : (<FileText />) }
										</div>
										<Dialog.Title
											as='h4'
											className='text-base font-bold leading-6 text-white'
										>
											{ content === 'add' ? `Add new ${title}` : content === 'edit' ? `Edit ${title}` : `View ${title}`  }
										</Dialog.Title>
									</div>

									<button
										onClick={() => showModal(false,content, false)}
										className='text-white text-sm font-semibold'
									>
										<X />
									</button>
								</div>
								{children}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};
