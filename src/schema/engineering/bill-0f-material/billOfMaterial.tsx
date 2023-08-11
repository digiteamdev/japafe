import * as yup from "yup";

export const billOfMaterialSchema = yup.object().shape({
	srId: yup.string().required("Summary not empty")
});
