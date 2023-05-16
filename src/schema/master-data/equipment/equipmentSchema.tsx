import * as yup from "yup";

export const equipmentSchema = yup.object().shape({
	nama: yup.string().required("Name Equipment not empty"),
    keterangan_eq: yup.string().required("Keterangan Equipment not empty"),
    eq_image: yup.string().nullable(),
});