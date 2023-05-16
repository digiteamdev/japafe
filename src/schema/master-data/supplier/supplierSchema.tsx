import * as yup from "yup";

export const supplierSchema = yup.object().shape({
	type_supplier: yup.string().required("Type Supplier not empty"),
	supplier_name: yup.string().required("Name Supplier not empty"),
	addresses_sup: yup.string().required("Address Supplier not empty"),
	provinces: yup.string().required("Province not empty"),
	cities: yup.string().required("City not empty"),
	districts: yup.string().required("districts not empty"),
	sub_districts: yup.string().required("Sub Districts not empty"),
	ec_postalcode: yup.string().required("Postal Code not empty"),
	office_email: yup.string().required("Office Email not empty"),
	NPWP: yup.string().required("NPWP not empty"),
	ppn: yup.string().required("PPN not empty"),
	pph: yup.string().required("PPH not empty"),
});
