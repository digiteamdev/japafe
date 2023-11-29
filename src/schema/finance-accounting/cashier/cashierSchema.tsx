import * as yup from "yup";

export const cashierSchema = yup.object().shape({
	id_cashier: yup.string().required("Id Cashier not empty"),
	status_payment: yup.string().required("Payment not empty"),
	kontrabonId: yup.string().required("Reference not empty"),
	date_cashier: yup.date().required("date not empty"),
	note: yup.string().nullable(),
	total: yup.number().required("total not empty"),
});
