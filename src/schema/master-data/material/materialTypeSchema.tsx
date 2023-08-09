import * as yup from "yup";

export const materialTypeSchema = yup.object().shape({
    material_name: yup.string().required("Material Type Name not empty")
});
