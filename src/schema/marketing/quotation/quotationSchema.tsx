import * as yup from "yup";

export const quotationSchema = yup.object().shape({
	customerId: yup.string().required("Customer not empty"),
	customercontactId: yup.string().required("Contact Customer not empty"),
	deskription: yup.string().required("Deskription not empty"),
	quo_img: yup.string().required("File Deskription not empty"),
});
