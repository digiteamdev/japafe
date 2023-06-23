import * as yup from "yup";

export const workerCenterSchema = yup.object().shape({
	name: yup.string().required("Name not empty")
});
