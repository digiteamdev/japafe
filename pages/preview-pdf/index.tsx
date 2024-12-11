import { DocumentPDF } from "@/src/containers/purchasing-logistic/delivery-order/document";
import { DocumentPDFListOrder } from "@/src/containers/purchasing-logistic/list-po/document";
import {
	GetDataPDFDeliveryOrder,
	GetDataPDFListOrder,
	ResponseGetDeliveryOrder,
	ResponsePurchaseOrder,
} from "@/src/services/document-pdf";
import { pdf } from "@react-pdf/renderer";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function PreviewPdf() {
	const router = useRouter();
	const [dataDeliveryOrder, setDataDeliveryOrder] =
		useState<ResponseGetDeliveryOrder | null>();
	const [dataListPo, setDataListPo] = useState<ResponsePurchaseOrder | null>();
	const [dataPdf, setDataPdf] = useState<string>();
	const { type, id } = router.query;

	const fetchDataPdfDeliveryOrder = useCallback(async () => {
		try {
			const response = await GetDataPDFDeliveryOrder(String(id));
            console.log(response)
			setDataDeliveryOrder(response.data.result);
			handlePreviewDeliveryOrder(response.data.result);
		} catch (error) {
			console.error(error);
		}
	}, [id]);

	const fetchDataPdfListOrder = useCallback(async () => {
		try {
			const response = await GetDataPDFListOrder(String(id));
			setDataListPo(response.data.result);
			handlePreviewListOrder(response.data.result);
		} catch (error) {
			console.error(error);
		}
	}, [id]);

	const handlePreviewDeliveryOrder = async (data: ResponseGetDeliveryOrder) => {
		const pdfBlob = await pdf(<DocumentPDF data={data} />).toBlob();
		const url = URL.createObjectURL(pdfBlob);
		setDataPdf(url);
	};

	const handlePreviewListOrder = async (data: ResponsePurchaseOrder) => {
		const pdfBlob = await pdf(<DocumentPDFListOrder data={data} />).toBlob();
		const url = URL.createObjectURL(pdfBlob);
		setDataPdf(url);
	};

	useEffect(() => {
		if (type === "deliveryOrder") {
			fetchDataPdfDeliveryOrder();
		}

		if (type !== "deliveryOrder") {
			fetchDataPdfListOrder();
		}
	}, [fetchDataPdfDeliveryOrder, fetchDataPdfListOrder, type]);

	return dataPdf ? (
		<iframe src={dataPdf} style={{ width: "100%", height: "100vh" }} />
	) : (
		<main>
			<h1>Sedang Memuat PDF...</h1>
		</main>
	);
}
