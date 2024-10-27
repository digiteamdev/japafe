import moment from "moment";
import { Section } from "../../../components";
import { formatRupiah } from "@/src/utils";
import { Printer } from "react-feather";

interface props {
  dataSelected: any;
  content: string;
  showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewPurchase = ({ dataSelected, content, showModal }: props) => {
  const Total = (detail: any) => {
    let jumlahTotal: any = 0;
    detail.map((res: any) => {
      jumlahTotal = jumlahTotal + res.price * res.qtyAppr - res.disc;
    });
    return jumlahTotal.toString();
  };

  const Ppn = (detail: any) => {
    let totalBayar: any = Total(detail);
    let totalPPN: any = (totalBayar * dataSelected.supplier.ppn) / 100;
    return totalPPN.toString();
  };

  const GrandTotal = (detail: any) => {
    let totalBayar: any = Total(detail);
    if (dataSelected.taxPsrDmr === "ppn") {
      let totalPPN: any = Ppn(detail);
      let total: any = parseInt(totalBayar) + parseInt(totalPPN);
      return total;
    } else {
      let total: any = parseInt(totalBayar);
      return total;
    }
  };

  const onPreviewPdf = () => {
    window.open(`/preview-pdf?type=listOrder&id=${dataSelected?.id}`);
  };

  return (
    <div className="px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]">
      {dataSelected ? (
        <>
          <div className="grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
            <div>
              <h1 className="font-bold text-xl">Purchase Order</h1>
            </div>
            <div className="text-right mr-6">
              <button
                onClick={() => onPreviewPdf()}
                className="justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3"
              >
                <div className="flex px-1 py-1">
                  <Printer size={16} className="mr-1" /> Print
                </div>
              </button>
            </div>
          </div>
          <Section className="grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2">
            <div className="w-full">
              <table className="w-full">
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    ID PO
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {dataSelected.id_so}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    Date PO
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {moment(dataSelected.date_prepared).format("DD-MMMM-YYYY")}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    Supplier
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {dataSelected.supplier.supplier_name}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    Supplier Contact
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {dataSelected.supplier.SupplierContact.length === 0
                      ? ""
                      : dataSelected.supplier.SupplierContact[0]
                          .contact_person}{" "}
                    /{" "}
                    {`+62${
                      dataSelected.supplier.SupplierContact.length === 0
                        ? ""
                        : dataSelected.supplier.SupplierContact[0].phone
                    }`}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    Supplier Address
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {dataSelected.supplier.addresses_sup}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    Note
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {dataSelected.note}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    Delivery Time
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {dataSelected.delivery_time}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    Payment Method
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {dataSelected.payment_method}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200">
                    Franco
                  </td>
                  <td className="sm:w-[50%] md:w-[75%] pl-2 border border-gray-200">
                    {dataSelected.franco}
                  </td>
                </tr>
              </table>
            </div>
          </Section>
          <h1 className="font-bold text-lg mt-2">Term Of Payment</h1>
          <Section className="w-full mt-2">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-center border border-black">Method</th>
                  <th className="text-center border border-black">Percent</th>
                  <th className="text-center border border-black">Price</th>
                  <th className="text-center border border-black">Reff</th>
                </tr>
              </thead>
              <tbody>
                {dataSelected.term_of_pay_po_so.map((res: any, i: number) => {
                  return (
                    <tr key={i}>
                      <td className="text-center border border-black">
                        {res.limitpay}
                      </td>
                      <td className="text-center border border-black">
                        {res.percent}%
                      </td>
                      <td className="text-center border border-black">
                        {formatRupiah(res.price.toString())}
                      </td>
                      <td className="text-center border border-black">
                        {res.invoice}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Section>
          <h1 className="font-bold text-lg mt-2">Detail Purchase</h1>
          <Section className="w-full mt-2">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-center border border-black">Material</th>
                  <th className="text-center border border-black">Qty</th>
                  <th className="text-center border border-black">Unit</th>
                  <th className="text-center border border-black">Price</th>
                  <th className="text-center border border-black">Discount</th>
                  <th className="text-center border border-black">Total</th>
                </tr>
              </thead>
              <tbody>
                {dataSelected.detailMr.map((res: any, i: number) => {
                  return (
                    <tr key={i}>
                      <td className="text-center border border-black">
                        {res.name_material}
                      </td>
                      <td className="text-center border border-black">
                        {res.qtyAppr}
                      </td>
                      <td className="text-center border border-black">
                        {res.Material_Master.satuan}
                      </td>
                      <td className="text-center border border-black">
                        {formatRupiah(res.price.toString())}
                      </td>
                      <td className="text-center border border-black">
                        {formatRupiah(res.disc.toString())}
                      </td>
                      <td className="text-center border border-black">
                        {formatRupiah(res.total.toString())}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td
                    className="border border-black text-right pr-2 text-lg font-semibold"
                    colSpan={5}
                  >
                    Total
                  </td>
                  <td className="text-center border border-black" colSpan={5}>
                    {formatRupiah(Total(dataSelected.detailMr))}
                  </td>
                </tr>
                {dataSelected.taxPsrDmr === "ppn" ? (
                  <tr>
                    <td
                      className="border border-black text-right pr-2 text-lg font-semibold"
                      colSpan={5}
                    >
                      PPN
                    </td>
                    <td className="text-center border border-black" colSpan={5}>
                      {formatRupiah(Ppn(dataSelected.detailMr))}
                    </td>
                  </tr>
                ) : null}
                <tr>
                  <td
                    className="border border-black text-right pr-2 text-lg font-semibold"
                    colSpan={5}
                  >
                    Grand Total
                  </td>
                  <td className="text-center border border-black" colSpan={5}>
                    {formatRupiah(GrandTotal(dataSelected.detailMr).toString())}
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>
        </>
      ) : null}
    </div>
  );
};
