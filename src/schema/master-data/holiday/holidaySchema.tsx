import * as yup from "yup";

export const holidaySchema = yup.object().shape({
	date_holiday: yup.string().nullable(),
	description: yup.string().nullable()
});
