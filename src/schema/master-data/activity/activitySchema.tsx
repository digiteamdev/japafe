import * as yup from "yup";

export const activitySchema = yup.object().shape({
	name: yup.string().required("Name not empty")
});
