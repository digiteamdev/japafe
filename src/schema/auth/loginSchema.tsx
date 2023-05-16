import * as yup from "yup";

export const loginSchema = yup.object().shape({
	username: yup.string().required("username tidak boleh kosong"),
	hashed_password: yup.string().required("password tidak boleh kosong"),
});
