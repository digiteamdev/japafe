import * as yup from "yup";

export const employeSchema = yup.object().shape({
    NIP: yup.string().required("NIP not empty"),
    NIK: yup.string().required("NIK not empty"),
    NPWP:  yup.string().required("NPWP not empty"),
    id_card:  yup.string().required("Id Card not empty"),
    employee_name:  yup.string().required("Name not empty"),
    nick_name:  yup.string().required("Nick Name not empty"),
    birth_place:  yup.string().required("Birth Place not empty"),
    birth_date:  yup.string().required("Birth Date not empty"),
    address:  yup.string().required("Address not empty"),
    province:  yup.string().required("Province not empty"),
    city:  yup.string().required("City not empty"),
    districts:  yup.string().required("Districts not empty"),
    sub_districts:  yup.string().required("Sub Districts not empty"),
    ec_postalcode:  yup.string().required("Postal Code not empty"),
    phone_number:  yup.string().required("Phone not empty"),
    start_join:  yup.string().required("Start Join not empty"),
    remaining_days_of:  yup.string().required("Remaining day off not empty"),
    gender: yup.string().required("Gender not empty"),
    marital_status: yup.string().required("Marital Status not empty"),
    departId: yup.string().required("Departement not empty"),
    employee_status: yup.string().required("Employe Status not empty"),
    email: yup.string().required("Email Status not empty"),
    spouse_name: yup.string().nullable(),
    gender_spouse: yup.string().nullable(),
    spouse_birth_place: yup.string().nullable(),
    spouse_birth_date: yup.string().nullable(),
});

export const eduSchema = yup.object().shape({
    Educational_Employee: yup.string().nullable(),
    // school_name: yup.string().required("School Name not empty"),
    // last_edu:  yup.string().required("Last Education Name not empty"),
    // graduation:  yup.string().required("Graduation not empty"),
    // ijazah:  yup.string().required("Degree Name not empty")
});
