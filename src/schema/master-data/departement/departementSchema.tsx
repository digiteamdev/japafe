import * as yup from "yup";

export const departemenSchema = yup.object().shape({
	name: yup.string().required("Name Departement not empty"),
});
