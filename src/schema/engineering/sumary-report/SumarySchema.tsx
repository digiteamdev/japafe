import * as yup from "yup";

export const sumarySchema = yup.object().shape({
	date_of_summary: yup.string().nullable(),
	worId: yup.string().required("Job no not empty"),
	quantity: yup.string().nullable(),
	ioem: yup.string().nullable(),
    isr: yup.string().nullable(),
    itn: yup.string().nullable(),
    introduction: yup.string().nullable(),
});
