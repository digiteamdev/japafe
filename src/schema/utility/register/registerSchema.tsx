import * as yup from "yup";

export const registerSchema = yup.object().shape({
    employeeId: yup.string().required("Employe not empty"),
	username: yup.string().required("Username not empty"),
    hashed_password: yup.string().required("Password not empty"),
    confirm_password: yup.string().required("Confirm Password not empty")
});
