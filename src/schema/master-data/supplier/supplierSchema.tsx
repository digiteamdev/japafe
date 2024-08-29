import * as yup from "yup";

export const supplierSchema = yup.object().shape({
	type_supplier: yup.string().required("Type Supplier not empty"),
	supplier_name: yup.string().required("Name Supplier not empty"),
	addresses_sup: yup.string().required("Address Supplier not empty"),
	provinces: yup.string().nullable(),
	cities: yup.string().required("City not empty"),
	districts: yup.string().nullable(),
	sub_districts: yup.string().nullable(),
	ec_postalcode: yup.string().nullable(),
	office_email: yup.string().nullable(),
	NPWP: yup.string().nullable(),
	ppn: yup.string().required("PPN not empty"),
	pph: yup.string().required("PPH not empty"),
});
