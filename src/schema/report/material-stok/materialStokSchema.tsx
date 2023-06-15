import * as yup from "yup";

export const materialSchema = yup.object().shape({
	nama_type: yup.string().required("Material Type not empty"),
	material_name: yup.string().required("Material Name not empty"),
});
