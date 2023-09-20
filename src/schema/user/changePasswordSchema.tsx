import * as yup from "yup";

export const changePasswordSchema = yup.object().shape({
	hashed_password: yup.string().required("Old Password not empty"),
	passwordnew: yup.string().required("New Password not empty"),
});
