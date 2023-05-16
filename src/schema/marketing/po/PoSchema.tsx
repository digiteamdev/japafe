import * as yup from "yup";

export const poSchema = yup.object().shape({
	quo_id: yup.string().required("Quotation not empty"),
	tax: yup.string().required("Tax not empty"),
	noted: yup.string().nullable(),
	date_of_po: yup.string().required("Date of Po not empty"),
});
