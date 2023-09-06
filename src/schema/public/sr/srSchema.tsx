import * as yup from "yup";

export const srSchema = yup.object().shape({
	dispacthIDS: yup.string().required("Job no not empty"),
	userId: yup.string().required("User not empty"),
	date_sr: yup.string().required("Date Service Request not empty"),
});
