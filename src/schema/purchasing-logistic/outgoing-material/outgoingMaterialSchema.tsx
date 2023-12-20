import * as yup from "yup";

export const outgoingMaterialSchema = yup.object().shape({
	id_outgoing_material: yup.string().required("Id Outgoing Material not empty"),
	date_outgoing_material: yup.string().required("Date Outgoing Material not empty"),
});
