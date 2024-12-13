import * as yup from "yup";

export const warehouseSchema = yup.object().shape({
    name: yup.string().required("Material Name not empty"),
    satuan: yup.string().required("Satuan not empty"),
});
