import * as yup from "yup";

export const quotationSchema = yup.object().shape({
	customerId: yup.string().required("Customer not empty"),
	customercontactId: yup.string().required("Contact Customer not empty"),
	subject: yup.string().required("Subject not empty"),
	quo_img: yup.string().nullable(),
});
