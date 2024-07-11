import React, { useMemo } from "react";
import { getRole } from "../configs/session";
import Link from "next/link";
import { Send, Calendar } from "react-feather";
import moment from "moment";

const currentYear = new Date().getFullYear();
const range = (start: number, stop: number, step: number) =>
	Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

export const GetListYear = () => {
	return [
		...range(currentYear, currentYear - 50, -1).map((value) => {
			return {
				id: value,
				name: value,
			};
		}),
	];
};

export const formatRupiah = (angka: any) => {
	// let angka_koma = angka.split(".")
	let number_string = angka.replace(/[^,\d]/g, "").toString(),
		split = number_string.split(","),
		sisa = split[0].length % 3,
		rupiah = split[0].substr(0, sisa),
		ribuan = split[0].substr(sisa).match(/\d{3}/gi);

	if (ribuan) {
		let separator = sisa ? "." : "";
		rupiah += separator + ribuan.join(".");
	}

	rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
	return rupiah;
};

export const rupiahFormat = (angka: any) => {
	let rupiah = new Intl.NumberFormat("id-ID").format(1000000.9);
	return rupiah
};

const rangePage = (start: any, end: any) => {
	let length = end - start + 1;
	return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = (
	currentPage: any,
	pageSize: any,
	siblingCount: any = 1,
	totalCount: any
) => {
	const paginationRange = useMemo(() => {
		const totalPageCount = Math.ceil(totalCount / pageSize);

		const totalPageNumbers = siblingCount + 5;
		if (totalPageNumbers >= totalPageCount) {
			return rangePage(1, totalPageCount);
		}

		const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
		const rightSiblingIndex = Math.min(
			currentPage + siblingCount,
			totalPageCount
		);

		const shouldShowLeftDots = leftSiblingIndex > 2;
		const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

		const firstPageIndex = 1;
		const lastPageIndex = totalPageCount;

		if (!shouldShowLeftDots && shouldShowRightDots) {
			let leftItemCount = 3 + 2 * siblingCount;
			let leftRange = rangePage(1, leftItemCount);

			return [...leftRange, "...", totalPageCount];
		}

		if (shouldShowLeftDots && !shouldShowRightDots) {
			let rightItemCount = 3 + 2 * siblingCount;
			let rightRange = rangePage(
				totalPageCount - rightItemCount + 1,
				totalPageCount
			);
			return [firstPageIndex, "...", ...rightRange];
		}

		if (shouldShowLeftDots && shouldShowRightDots) {
			let middleRange = rangePage(leftSiblingIndex, rightSiblingIndex);
			return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
		}
	}, [totalCount, pageSize, siblingCount, currentPage]);

	return paginationRange;
};

export const pembilang = (nilai: any) => {
	nilai = Math.floor(Math.abs(nilai));

	var simpanNilaiBagi = 0;
	var huruf = [
		"",
		"Satu",
		"Dua",
		"Tiga",
		"Empat",
		"Lima",
		"Enam",
		"Tujuh",
		"Delapan",
		"Sembilan",
		"Sepuluh",
		"Sebelas",
	];
	var temp = "";

	if (nilai < 12) {
		temp = " " + huruf[nilai];
	} else if (nilai < 20) {
		temp = pembilang(Math.floor(nilai - 10)) + " Belas";
	} else if (nilai < 100) {
		simpanNilaiBagi = Math.floor(nilai / 10);
		temp = pembilang(simpanNilaiBagi) + " Puluh" + pembilang(nilai % 10);
	} else if (nilai < 200) {
		temp = " Seratus" + pembilang(nilai - 100);
	} else if (nilai < 1000) {
		simpanNilaiBagi = Math.floor(nilai / 100);
		temp = pembilang(simpanNilaiBagi) + " Ratus" + pembilang(nilai % 100);
	} else if (nilai < 2000) {
		temp = " Seribu" + pembilang(nilai - 1000);
	} else if (nilai < 1000000) {
		simpanNilaiBagi = Math.floor(nilai / 1000);
		temp = pembilang(simpanNilaiBagi) + " Ribu" + pembilang(nilai % 1000);
	} else if (nilai < 1000000000) {
		simpanNilaiBagi = Math.floor(nilai / 1000000);
		temp = pembilang(simpanNilaiBagi) + " Juta" + pembilang(nilai % 1000000);
	} else if (nilai < 1000000000000) {
		simpanNilaiBagi = Math.floor(nilai / 1000000000);
		temp =
			pembilang(simpanNilaiBagi) + " Miliar" + pembilang(nilai % 1000000000);
	} else if (nilai < 1000000000000000) {
		simpanNilaiBagi = Math.floor(nilai / 1000000000000);
		temp =
			pembilang(nilai / 1000000000000) +
			" Triliun" +
			pembilang(nilai % 1000000000000);
	}

	return temp;
};

export const cekDivisiMarketing = () => {
	let roles = getRole();
	let divisi = "";
	if (roles !== undefined) {
		let role = JSON.parse(roles);
		role.map((res: any) => {
			if (res.role.role_name === "MARKETING SWASTA") {
				divisi = "S";
			} else if (res.role.role_name === "MARKETING BUMN") {
				divisi = "B";
			}
		});
	}
	return divisi;
};

export const changeDivisi = (data: string) => {
	return data;
};

export const listNotification = (data: any, type: string) => {
	let text: string = "";
	let width: number = window.innerWidth;
	switch (type) {
		case "approvalMr":
			text = `New material request from ${data.user.employee.employee_name}`;
			return (
				<Link href={`/director/approvalMr/${data.id}`}>
					<div className='border cursor-pointer border-b-rose-500 border-t-0 border-l-0 border-r-0'>
						<span className='flex  text-gray-900 text-sm'>
							<Send size={24} className='pr-2' />
							{width > 768
								? text.length > 45
									? `${text.slice(0, 44)}...`
									: text
								: text.length > 28
								? `${text.slice(0, 27)}...`
								: text}
						</span>
						<span className='flex  text-gray-900 text-xs pl-5'>
							<Calendar size={18} className='pr-2' />
							{moment(data.updatedAt).format("dddd, DD MMMM YYYY")}
						</span>
					</div>
				</Link>
			);
		case "approvalSr":
			text = `New service request from ${data.user.employee.employee_name}`;
			return (
				<Link href={`/director/approvalSr/${data.id}`}>
					<div className='border cursor-pointer border-b-rose-500 border-t-0 border-l-0 border-r-0'>
						<span className='flex  text-gray-900 text-sm'>
							<Send size={24} className='pr-2' />
							{width > 768
								? text.length > 45
									? `${text.slice(0, 44)}...`
									: text
								: text.length > 28
								? `${text.slice(0, 27)}...`
								: text}
						</span>
						<span className='flex  text-gray-900 text-xs pl-5'>
							<Calendar size={18} className='pr-2' />
							{moment(data.updatedAt).format("dddd, DD MMMM YYYY")}
						</span>
					</div>
				</Link>
			);
		case "approvalMrPurchasing":
			text = `New approval mr from ${data.user.employee.employee_name}`;
			return (
				<Link href={`/purchasing-logistic/approval-mr/${data.id}`}>
					<div className='border cursor-pointer border-b-rose-500 border-t-0 border-l-0 border-r-0'>
						<span className='flex  text-gray-900 text-sm'>
							<Send size={24} className='pr-2' />
							{width > 768
								? text.length > 45
									? `${text.slice(0, 44)}...`
									: text
								: text.length > 28
								? `${text.slice(0, 27)}...`
								: text}
						</span>
						<span className='flex  text-gray-900 text-xs pl-5'>
							<Calendar size={18} className='pr-2' />
							{moment(data.updatedAt).format("dddd, DD MMMM YYYY")}
						</span>
					</div>
				</Link>
			);
		case "approvalSrPurchasing":
			text = `New approval sr from ${data.user.employee.employee_name}`;
			return (
				<Link href={`/purchasing-logistic/approval-sr/${data.id}`}>
					<div className='border cursor-pointer border-b-rose-500 border-t-0 border-l-0 border-r-0'>
						<span className='flex  text-gray-900 text-sm'>
							<Send size={24} className='pr-2' />
							{width > 768
								? text.length > 45
									? `${text.slice(0, 44)}...`
									: text
								: text.length > 28
								? `${text.slice(0, 27)}...`
								: text}
						</span>
						<span className='flex  text-gray-900 text-xs pl-5'>
							<Calendar size={18} className='pr-2' />
							{moment(data.updatedAt).format("dddd, DD MMMM YYYY")}
						</span>
					</div>
				</Link>
			);
			break;
		case "purchaseMr":
			text = `New purchase mr`;
			return (
				<Link href={`/purchasing-logistic/purchase-mr`}>
					<div className='border cursor-pointer border-b-rose-500 border-t-0 border-l-0 border-r-0'>
						<span className='flex  text-gray-900 text-sm'>
							<Send size={24} className='pr-2' />
							{width > 768
								? text.length > 45
									? `${text.slice(0, 44)}...`
									: text
								: text.length > 28
								? `${text.slice(0, 27)}...`
								: text}
						</span>
						<span className='flex  text-gray-900 text-xs pl-5'>
							<Calendar size={18} className='pr-2' />
							{moment(data.updatedAt).format("dddd, DD MMMM YYYY")}
						</span>
					</div>
				</Link>
			);
		case "purchaseSr":
			text = `New purchase sr`;
			return (
				<Link href={`/purchasing-logistic/purchase-sr`}>
					<div className='border cursor-pointer border-b-rose-500 border-t-0 border-l-0 border-r-0'>
						<span className='flex  text-gray-900 text-sm'>
							<Send size={24} className='pr-2' />
							{width > 768
								? text.length > 45
									? `${text.slice(0, 44)}...`
									: text
								: text.length > 28
								? `${text.slice(0, 27)}...`
								: text}
						</span>
						<span className='flex  text-gray-900 text-xs pl-5'>
							<Calendar size={18} className='pr-2' />
							{moment(data.updatedAt).format("dddd, DD MMMM YYYY")}
						</span>
					</div>
				</Link>
			);
		case "purchaseDirectMr":
			text = `New direct mr`;
			return (
				<Link href={`/purchasing-logistic/direct-mr`}>
					<div className='border cursor-pointer border-b-rose-500 border-t-0 border-l-0 border-r-0'>
						<span className='flex  text-gray-900 text-sm'>
							<Send size={24} className='pr-2' />
							{width > 768
								? text.length > 45
									? `${text.slice(0, 44)}...`
									: text
								: text.length > 28
								? `${text.slice(0, 27)}...`
								: text}
						</span>
						<span className='flex  text-gray-900 text-xs pl-5'>
							<Calendar size={18} className='pr-2' />
							{moment(data.updatedAt).format("dddd, DD MMMM YYYY")}
						</span>
					</div>
				</Link>
			);
		case "purchaseDirectSr":
			text = `New direct sr`;
			return (
				<Link href={`/purchasing-logistic/direct-sr`}>
					<div className='border cursor-pointer border-b-rose-500 border-t-0 border-l-0 border-r-0'>
						<span className='flex  text-gray-900 text-sm'>
							<Send size={24} className='pr-2' />
							{width > 768
								? text.length > 45
									? `${text.slice(0, 44)}...`
									: text
								: text.length > 28
								? `${text.slice(0, 27)}...`
								: text}
						</span>
						<span className='flex  text-gray-900 text-xs pl-5'>
							<Calendar size={18} className='pr-2' />
							{moment(data.updatedAt).format("dddd, DD MMMM YYYY")}
						</span>
					</div>
				</Link>
			);
	}
};
