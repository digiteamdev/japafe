import * as yup from "yup";

export const customerSchema = yup.object().shape({
	name: yup.string().required("Name Customer not empty"),
    email: yup.string().required("Email Customer not empty"),
    ppn: yup.string().required("PPN Customer not empty"),
    pph: yup.string().required("PPH Customer not empty")
});