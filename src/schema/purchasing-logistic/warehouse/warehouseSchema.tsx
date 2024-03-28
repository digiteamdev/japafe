import * as yup from "yup";

export const warehouseSchema = yup.object().shape({
    name: yup.string().required("Material Name not empty"),
    spesifikasi: yup.string().nullable(),
    satuan: yup.string().required("Satuan not empty"),
    jumlah_stock: yup.number().required("Stock not empty"),
    harga: yup.string().required("Price not empty"),
    note: yup.string().nullable()
});
