import * as yup from "yup";

export const kontraBonSchema = yup.object().shape({
	termId: yup.string().required("Term Of Payment not empty"),
    poandsoId: yup.string().required("Job No not empty"),
	id_kontrabon: yup.string().required("ID Kontra Bon not empty"),
	account_name: yup.string().required("Account Bank not empty"),
	tax_prepered: yup.date().required("Tax Prepered not empty"),
	due_date: yup.date().required("Pay Date not empty"),
	invoice: yup.string().nullable(),
	DO: yup.string().nullable(),
	grandtotal: yup.number().required("Grand Total not empty"),
	tax_invoice: yup.boolean().required("Tax not empty"),
});
