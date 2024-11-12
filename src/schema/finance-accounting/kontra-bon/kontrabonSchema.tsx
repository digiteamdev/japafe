import * as yup from "yup";

export const kontraBonSchema = yup.object().shape({
	termId: yup.string().nullable(),
    poandsoId: yup.string().nullable(),
	id_kontrabon: yup.string().nullable(),
	account_name: yup.string().nullable(),
	tax_prepered: yup.date().nullable(),
	due_date: yup.date().nullable(),
	invoice: yup.string().required("Invoice not empty"),
	DO: yup.string().nullable(),
	grandtotal: yup.number().nullable(),
	tax_invoice: yup.boolean().nullable(),
});
