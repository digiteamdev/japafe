import * as yup from "yup";

export const permitSchema = yup.object().shape({
    type_permitId: yup.string().required("Permit not empty"),
	desc: yup.string().nullable(),
	date: yup.string().nullable(),
});
