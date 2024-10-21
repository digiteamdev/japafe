import { Axios } from "@/src/configs/axios";

interface BaseResponse<T>{
  success: boolean
  message: string
  result: T
}

interface DetailDo {
  no: number;
  desc: string;
  qty: number;
  unit: string;
  note: string;
}

export interface ResponseGetDeliveryOrder {
  address: string;
  contact: string;
  date: string;
  dateCreate: string;
  detailDo: DetailDo[];
  note: string;
  number: string;
  ournojob: string;
  phone: string;
  poApro: string;
  poCheck: string;
  poDo: string;
  shipto: string;
  ttdAppove: string;
  ttdApro: string;
  ttdCheck: string;
  ttdDo: string;
  ttdGa: string;
  ttdchecked: string;
  youref: string;
  yourprojec: string;
}

interface DetailMR {
  no: number;
  price: string
  qty: number; 
  name_material: string;
  satuan: string;
  total: string;
  note: string
}

export interface ResponsePurchaseOrder {
  you_ref: string;
  Number: string;
  delivery: string;
  payment: string;
  franco: string;
  note: string;
  note_spesifikation: string | null;
  detailmr: DetailMR[];
  provinces: string;
  cities: string;
  districts: string;
  sub_districts: string;
  ec_postalcode: number;
  addresses_sup: string;
  supname: string;
  ppn: number;
  phoneSup: string;
  contact: string;
  job: string;
  req: string;
  tglpo: string;
  bdg: string;
  nomrsr: string;
  gntotalObj: string;
  totalObj: string;
  ppnObj: string;
  ttdPur: string;
  ttdPoFix: string;
  ttdDirut: string
}

export const GetDataPDFDeliveryOrder = async (id: number | string) => Axios.get<BaseResponse<ResponseGetDeliveryOrder>>(process.env.BASE_URL + `/doPrint/${id}`);
export const GetDataPDFListOrder = async (id: number | string) => Axios.get<BaseResponse<ResponsePurchaseOrder>>(process.env.BASE_URL + `/pdfPo/${id}`);