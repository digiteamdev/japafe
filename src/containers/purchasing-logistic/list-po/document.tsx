import { ResponsePurchaseOrder } from "@/src/services/document-pdf";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface Props {
  data: ResponsePurchaseOrder | null | undefined;
}

Font.register({
  family: "Calibri",
  src: "/fonts/calibri.ttf", // Pastikan kamu menyimpan font ini di folder public
});

const styles = StyleSheet.create({
  page: {
    paddingRight: "48px",
    paddingLeft: "96px",
    paddingVertical: "48px",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  header: {
    fontFamily: "Calibri",
    fontSize: 14,
    textAlign: "center",
    padding: 8,
    border: "1px solid black",
  },
  content: {
    fontFamily: "Calibri",
    fontSize: 10,
    marginTop: 20,
    flexGrow: 1,
  },
  banner_header: {
    width: "100%",
    height: 72,
  },
  subheader: {
    borderBottom: "1px solid black",
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    display: "flex",
    flexDirection: "row",
  },

  table: {
    width: "100%",
    borderBottom: "1px solid black",
    borderRight: "1px solid black",
    borderLeft: "1px solid black",
    display: "flex",
    flexDirection: "row",
  },
  qrCode: {
    width: 42,
    height: 44,
    alignSelf: "center",
    marginBottom: "18px",
    marginTop: "10px",
  },
});

const Header = () => (
  <View>
    <View style={styles.header}>
      <Image
        style={{ width: "100%", height: "46px" }}
        src="/images/banner.jpg"
        alt="banner"
      />
    </View>
    <View style={styles.subheader}>
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFB7",
          width: "55%",
          padding: 8,
        }}
      >
        <Text
          style={{ fontSize: 14, fontFamily: "Calibri", fontWeight: "bold" }}
        >
          Purchase Order
        </Text>
      </View>

      <View
        style={{
          display: "flex",
          width: "45%",
          flexDirection: "row",
        }}
      >
        <View style={{ width: "85%" }}>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderLeft: "1px solid black",
              borderBottom: "1px solid black",
              padding: 2,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Calibri",
                fontWeight: "bold",
              }}
            >
              No. Dokumen / Revisi
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 2,
              borderLeft: "1px solid black",
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Calibri",
                fontWeight: "bold",
              }}
            >
              DMP/PCA/FRM-03/00
            </Text>
          </View>
        </View>

        <View style={{ width: "15%" }}>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderLeft: "1px solid black",
              borderBottom: "1px solid black",
              padding: 2,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Calibri",
                fontWeight: "bold",
              }}
            >
              Level
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 2,
              borderLeft: "1px solid black",
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Calibri",
                fontWeight: "bold",
              }}
            >
              3
            </Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

export const DocumentPDFListOrder = (_props: Props) => {
  const { data } = _props;
  const itemsPerpage = 5;
  const lengthData = data?.detailmr.length ? data.detailmr.length : 0;
  const totalPages = Math.ceil(lengthData / itemsPerpage);
  const [approvedBy, setApprovedBy] = useState<string>("");
  const [purchasing, setPurchasing] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(data?.ttdPoFix ?? "")
      .then((url) => setPurchasing(url))
      .catch((err) => console.error(err));

    QRCode.toDataURL(data?.ttdDirut ?? "")
      .then((url) => setApprovedBy(url))
      .catch((err) => console.error(err));
  }, [data?.ttdDirut, data?.ttdPoFix]);
  return (
    <Document>
      {Array.from({ length: totalPages }).map((_, pageIndex) => {
        const start = pageIndex * itemsPerpage;
        const end = start + itemsPerpage;
        const pageData = data?.detailmr.slice(start, end);

        return (
          <Page key={pageIndex} size="A4" style={styles.page}>
            <Header />
            <View style={styles.content}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      width: "50%",
                      display: "flex",
                      flexDirection: "row",
                      gap: 12,
                      paddingRight: 62,
                    }}
                  >
                    <View>
                      <Text style={{ marginBottom: 4, fontWeight: "bold" }}>
                        Number
                      </Text>
                      <Text style={{ marginBottom: 4 }}>Date</Text>
                      <Text style={{ marginBottom: 4 }}>Vendor</Text>
                      <Text style={{ marginBottom: 4 }}>Address</Text>
                      <Text style={{ marginBottom: 4 }}>Phone</Text>
                      <Text style={{ marginBottom: 4 }}>Facsimile</Text>
                      <Text>Contact</Text>
                    </View>
                    <View>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text>:</Text>
                    </View>

                    <View>
                      <Text style={{ marginBottom: 4 }}>{data?.Number}</Text>
                      <Text style={{ marginBottom: 4 }}>{data?.tglpo}</Text>
                      <Text style={{ marginBottom: 4 }}>{data?.supname}</Text>
                      <Text style={{ marginBottom: 4 }}>
                        {data?.addresses_sup}
                      </Text>
                      <Text style={{ marginBottom: 4 }}>{data?.phoneSup}</Text>
                      <Text style={{ marginBottom: 4 }}>{data?.phoneSup}</Text>
                      <Text>{data?.contact}</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      width: "50%",
                      display: "flex",
                      flexDirection: "row",
                      gap: 12,
                      paddingRight: 62,
                    }}
                  >
                    <View>
                      <Text style={{ marginBottom: 4, fontWeight: "bold" }}>
                        Ship To
                      </Text>
                      <Text style={{ marginBottom: 4 }}>Address</Text>
                      <Text style={{ marginBottom: 4 }}>Phone</Text>
                      <Text style={{ marginBottom: 4 }}>Facsimile</Text>
                      <Text style={{ marginBottom: 4 }}>Requestor</Text>
                      <Text style={{ marginBottom: 4 }}>Job#</Text>
                      <Text style={{ marginBottom: 4 }}>Mr/SR No</Text>
                      <Text>Your Ref</Text>
                    </View>
                    <View>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text>:</Text>
                    </View>

                    <View>
                      <Text style={{ marginBottom: 4 }}>
                        PT. Dwitama Mulya Persada
                      </Text>
                      <Text style={{ marginBottom: 4 }}>
                        Kawasan Industri De Prima Terra Jl. Raya Sapan Blok
                        D1-07 Bandung
                      </Text>
                      <Text style={{ marginBottom: 4 }}>022-8888810</Text>
                      <Text style={{ marginBottom: 4 }}>022-8888810</Text>
                      <Text style={{ marginBottom: 4 }}>{data?.req}</Text>
                      <Text style={{ marginBottom: 4 }}>{data?.job}</Text>
                      <Text style={{ marginBottom: 4 }}>{data?.you_ref}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Table */}
              <View
                style={[
                  styles.table,
                  { marginTop: 20, borderTop: "1px solid black" },
                ]}
              >
                <View
                  style={{
                    width: "4%",
                    textAlign: "center",
                    padding: 2,
                    backgroundColor: "#FFFFB7",
                  }}
                >
                  <Text>No</Text>
                </View>
                <View
                  style={{
                    width: "60%",
                    textAlign: "center",
                    padding: 2,
                    borderRight: "1px solid black",
                    borderLeft: "1px solid black",
                    backgroundColor: "#FFFFB7",
                  }}
                >
                  <Text>Description</Text>
                </View>

                <View
                  style={{
                    width: "8%",
                    textAlign: "center",
                    padding: 2,
                    borderRight: "1px solid black",
                    backgroundColor: "#FFFFB7",
                  }}
                >
                  <Text>Qty</Text>
                </View>
                <View
                  style={{
                    width: "8%",
                    textAlign: "center",
                    padding: 2,
                    backgroundColor: "#FFFFB7",
                    borderRight: "1px solid black",
                  }}
                >
                  <Text>Unit</Text>
                </View>
                <View
                  style={{
                    width: "20%",
                    textAlign: "center",
                    padding: 2,
                    backgroundColor: "#FFFFB7",
                    borderRight: "1px solid black",
                  }}
                >
                  <Text>Price</Text>
                </View>

                <View
                  style={{
                    width: "20%",
                    textAlign: "center",
                    padding: 2,
                    backgroundColor: "#FFFFB7",
                  }}
                >
                  <Text>Total Price</Text>
                </View>
              </View>

              {/* <View style={[styles.table]}>
                <View
                  style={{
                    width: "4%",
                    padding: 2,
                  }}
                >
                  <Text style={{ opacity: 0 }}>1</Text>
                </View>
                <View
                  style={{
                    width: "60%",
                    padding: 2,
                    borderRight: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></View>

                <View
                  style={{
                    width: "8%",
                    padding: 2,
                    borderRight: "1px solid black",
                  }}
                ></View>
                <View
                  style={{
                    width: "8%",
                    padding: 2,
                    borderRight: "1px solid black",
                  }}
                ></View>

                <View
                  style={{
                    width: "20%",
                    textAlign: "center",
                    padding: 2,
                    borderRight: "1px solid black",
                  }}
                ></View>

                <View
                  style={{
                    width: "20%",
                    textAlign: "center",
                    padding: 2,
                  }}
                ></View>
              </View> */}

              {data?.note_spesifikation && (
                <View style={[styles.table]}>
                  <View
                    style={{
                      width: "4%",
                      padding: 2,
                    }}
                  >
                    <Text style={{ opacity: 0 }}>1</Text>
                  </View>
                  <View
                    style={{
                      width: "60%",
                      padding: 2,
                      borderRight: "1px solid black",
                      borderLeft: "1px solid black",
                    }}
                  >
                    <Text>{data?.note_spesifikation}</Text>
                  </View>

                  <View
                    style={{
                      width: "8%",
                      padding: 2,
                      borderRight: "1px solid black",
                    }}
                  ></View>
                  <View
                    style={{
                      width: "8%",
                      padding: 2,
                      borderRight: "1px solid black",
                    }}
                  ></View>
                  <View
                    style={{
                      width: "20%",
                      textAlign: "center",
                      padding: 2,
                      borderRight: "1px solid black",
                    }}
                  ></View>

                  <View
                    style={{
                      width: "20%",
                      textAlign: "center",
                      padding: 2,
                    }}
                  ></View>
                </View>
              )}

              {pageData.map((item, index) => (
                <View key={index} style={[styles.table]}>
                  <View
                    style={{
                      width: "4%",
                      padding: 2,
                    }}
                  >
                    <Text>{item.no}</Text>
                  </View>
                  <View
                    style={{
                      width: "60%",
                      padding: 2,
                      borderRight: "1px solid black",
                      borderLeft: "1px solid black",
                    }}
                  >
                    <Text>{item.name_material}</Text>
                    {item.note && <Text>{item.note}</Text>}
                  </View>

                  <View
                    style={{
                      width: "8%",
                      padding: 2,
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text>{item.qty}</Text>
                  </View>
                  <View
                    style={{
                      width: "8%",
                      padding: 2,
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text>{item.satuan}</Text>
                  </View>

                  <View
                    style={{
                      width: "20%",
                      textAlign: "center",
                      padding: 2,
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text>{item.price}</Text>
                  </View>

                  <View
                    style={{
                      width: "20%",
                      textAlign: "center",
                      padding: 2,
                    }}
                  >
                    <Text>{item.total}</Text>
                  </View>
                </View>
              ))}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginLeft: "auto",
                  width: "33.6%",
                  borderBottom: "1px solid black",
                }}
              >
                <View
                  style={{
                    padding: 2,
                    width: "100%",
                    borderRight: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                >
                  <Text>SubTotal</Text>
                </View>

                <View
                  style={{
                    padding: 2,
                    width: "100%",
                    borderRight: "1px solid black",
                  }}
                >
                  <Text>{data?.totalObj}</Text>
                </View>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginLeft: "auto",
                  width: "33.6%",
                  borderBottom: "1px solid black",
                }}
              >
                <View
                  style={{
                    padding: 2,
                    width: "100%",
                    borderRight: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                >
                  <Text>PPn 11%</Text>
                </View>

                <View
                  style={{
                    padding: 2,
                    width: "100%",
                    borderRight: "1px solid black",
                  }}
                >
                  <Text>{data?.ppnObj}</Text>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginLeft: "auto",
                  width: "33.6%",
                  borderBottom: "1px solid black",
                }}
              >
                <View
                  style={{
                    padding: 2,
                    width: "100%",
                    borderRight: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                >
                  <Text>Grand Total</Text>
                </View>

                <View
                  style={{
                    padding: 2,
                    width: "100%",
                    borderRight: "1px solid black",
                  }}
                >
                  <Text>{data?.gntotalObj}</Text>
                </View>
              </View>
            </View>
            <View style={styles.content}>
              <View style={{ marginTop: 10 }}>
                <Text>Note:</Text>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  {/* <View style={{ paddingLeft: 12 }}>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text style={{ marginTop: 12 }}>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                  </View> */}
                  <View style={{ paddingLeft: 12 }}>
                    <Text>{data?.note}</Text>
                    {/* <Text>
                      Apabila material tidak sesuai permintaan dalam PO,
                      supplier wajib mengganti material dan membayar biaya
                      pengetesan XRF
                    </Text> */}
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <View>
                        <Text>Delivery Time</Text>
                        <Text>Payment Method</Text>
                        <Text>Franco</Text>
                      </View>
                      <View style={{ paddingLeft: 10 }}>
                        <Text>:</Text>
                        <Text>:</Text>
                        <Text>:</Text>
                      </View>
                      <View style={{ paddingLeft: 10 }}>
                        <Text>{data?.delivery}</Text>
                        <Text>{data?.payment}</Text>
                        <Text>{data?.franco}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={{ marginTop: 20 }}>
                  <Text style={{ paddingLeft: 100, marginTop: 26 }}>
                    {data?.tglpo}
                  </Text>

                  <View
                    style={{
                      marginTop: 8,
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        width: "33%",
                        height: "112px",
                        padding: 2,
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 12 }}>Approved</Text>
                      {approvedBy && (
                        <Image src={approvedBy} style={styles.qrCode} />
                      )}

                      <View
                        style={{
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text>(Joko Hedi Saputro)</Text>
                        <Text>Presiden Direktur</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        width: "33%",
                        height: "112px",
                        padding: 2,
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 12 }}>
                        PT. Dwitama Mulya Persada
                      </Text>
                      {purchasing && (
                        <Image src={purchasing} style={styles.qrCode} />
                      )}
                      <View
                        style={{
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text>({data?.ttdPur})</Text>
                        <Text>Purchasing</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        width: "33%",
                        height: "112px",
                        padding: 2,
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 12 }}>Confirmed By,</Text>
                      <Image
                        src={data?.ttdPoFix}
                        style={{
                          marginBottom: "18px",
                          marginTop: "10px",
                          width: 42,
                          height: 42,
                          opacity: 0,
                        }}
                      />
                      <View
                        style={{
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text>{data?.supname}</Text>
                        <Text style={{ opacity: 0 }}>({data?.supname})</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};
