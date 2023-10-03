import * as yup from "yup";

export const chartOfAccountSchema = yup.object().shape({
    coa_code: yup.string().required("COA Code not empty"),
	coa_name: yup.string().required("COA Name not empty")
});
