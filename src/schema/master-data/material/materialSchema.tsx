import * as yup from "yup";

export const materialSchema = yup.object().shape({
    material_name: yup.string().required("Material Name not empty"),
    kd_group: yup.string().required("Material Type not empty"),
    satuan: yup.string().required("Satuan not empty"),
    detail: yup.string().nullable()
});
