import { useEffect, useState } from "react";
import moment from "moment";
import { Section } from "../../../components";
import { ApproveDo } from "../../../services";
import {
  getPosition,
  getDepartement,
  getSubDepartement,
} from "../../../configs/session";
import { Check, X, Printer } from "react-feather";
import { toast } from "react-toastify";
import {
  GetDataPDFDeliveryOrder,
  ResponseGetDeliveryOrder,
} from "@/src/services/document-pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { DocumentPDF } from "./document";

interface props {
  dataSelected: any;
  content: string;
  showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewDo = ({ dataSelected, content, showModal }: props) => {
  const [position, setPosition] = useState<any>([]);
  const [departement, setDepartement] = useState<any>("");
  const [subDepartement, setSubDepartement] = useState<any>("");
  const [isModal, setIsModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataPdf, setDataPdf] = useState<ResponseGetDeliveryOrder | null>();

  useEffect(() => {
    let positionAkun = getPosition();
    let departement = getDepartement();
    let subDepartement = getSubDepartement();
    if (positionAkun !== undefined) {
      setPosition(positionAkun);
    }
    if (departement !== undefined) {
      setDepartement(departement);
    }
    if (subDepartement !== undefined) {
      setSubDepartement(subDepartement);
    }

    fetchDataPdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDataPdf = async () => {
    try {
      const response = await GetDataPDFDeliveryOrder(dataSelected.id);
      setDataPdf(response.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  const approveDo = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await ApproveDo(id);
      if (response.data) {
        toast.success("Approve Delivery Order Success", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        showModal(false, content, true);
      }
    } catch (error) {
      toast.error("Approve Delivery Order Failed", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
    setIsLoading(false);
  };

  const buttonApprove = (id: string) => {
    return (
      <button
        className={`justify-center rounded-full border border-transparent bg-green-500 hover:bg-green-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
        onClick={() => approveDo(dataSelected.id)}
      >
        <div className="flex px-1 py-1">
          <Check size={18} className="mr-1" /> Approve
        </div>
      </button>
    );
  };

  return (
    <div className="px-5 pb-2 mt-4 overflow-auto">
      {dataSelected ? (
        <>
          <div className="grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
            <div>
              <h1 className="font-bold text-xl">Delivery Order</h1>
            </div>
            <div className="text-right mr-6 flex justify-end">
              {dataSelected.approveDo && dataSelected.checkedDo ? (
                <PDFDownloadLink
                  document={<DocumentPDF data={dataPdf} />}
                  fileName={`${dataPdf?.number}-${dataPdf?.dateCreate}`}
                  className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
                  // onClick={() =>
                  //   window.open(
                  //     process.env.BASE_URL + `/doPrint/${dataSelected.id}`,
                  //     "_blank"
                  //   )
                  // }
                >
                  <div className="flex px-1 py-1">
                    <Printer size={16} className="mr-1" /> Print
                  </div>
                </PDFDownloadLink>
              ) : null}
              {(subDepartement === "SECURITY" &&
                dataSelected.checkedDo === null) ||
              (subDepartement === "security" && dataSelected.checkedDo === null)
                ? buttonApprove(dataSelected.id)
                : null}
              {(departement === "Engineering" &&
                dataSelected.approveDo === null) ||
              (departement === "ENGINEERING" && dataSelected.approveDo === null)
                ? buttonApprove(dataSelected.id)
                : null}
            </div>
          </div>
          <Section className="grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2">
            <div className="w-full">
              <table className="w-full">
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    No DO
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {dataSelected.no_do}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    Job no
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {dataSelected.no_job ? dataSelected.no_job : "Internal"}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    Date DO
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {moment(dataSelected.date_do).format("DD-MMMM-YYYY")}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    Ship to
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {dataSelected.ship_to}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    Contact
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {dataSelected.contact}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    Phone
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {dataSelected.phone}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    Address
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {dataSelected.address}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    Reference
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {dataSelected.your_ref}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    Project
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {dataSelected.your_project}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    Created by
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {dataSelected.createDo}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    Approve by
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {dataSelected.approveDo}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    Checked by
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {dataSelected.checkedDo}
                  </td>
                </tr>
              </table>
            </div>
          </Section>
          <h1 className="font-bold text-xl">Description</h1>
          <Section className="grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2">
            <table>
              <thead>
                <tr>
                  <th className="border border-black text-center">
                    Description
                  </th>
                  <th className="border border-black text-center">Quantity</th>
                  <th className="border border-black text-center">Unit</th>
                  <th className="border border-black text-center">Note</th>
                </tr>
              </thead>
              <tbody>
                {dataSelected?.DOdetail?.map((res: any, i: number) => {
                  return (
                    <tr key={i}>
                      <td className="border border-black p-2 whitespace-pre-line">
                        {res.desc}
                      </td>
                      <td className="border border-black text-center">
                        {res.qty}
                      </td>
                      <td className="border border-black text-center">
                        {res.unit}
                      </td>
                      <td className="border border-black p-2">{res.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Section>
        </>
      ) : null}
    </div>
  );
};
