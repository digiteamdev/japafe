import * as yup from "yup";

export const customerSchema = yup.object().shape({
	name: yup.string().required("Name Customer not empty"),
    email: yup.string().required("Email Customer not empty")
});