/* eslint-disable @next/next/no-img-element */
import { ResponseGetDeliveryOrder } from "@/src/services/document-pdf";
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
  data: ResponseGetDeliveryOrder | null | undefined;
}

Font.register({
  family: "Calibri",
  src: "/fonts/calibri.ttf",
});

const styles = StyleSheet.create({
  page: {
    paddingRight: "48px",
    paddingLeft: "96px",
    paddingVertical: "48px",
  },
  header: {
    fontFamily: "Calibri",
    fontSize: 10,
    textAlign: "center",
    padding: 8,
    border: "1px solid black",
  },
  content: {
    fontFamily: "Calibri",
    fontSize: 9,
    marginTop: 20,
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
    width: 32,
    height: 32,
    alignSelf: "flex-start",
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
          backgroundColor: "#D9D9D9",
          width: "55%",
          padding: 8,
        }}
      >
        <Text
          style={{ fontSize: 14, fontFamily: "Calibri", fontWeight: "bold" }}
        >
          Delivery Order
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
              DMP/GA/FRM-14/00
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

export const DocumentPDF = (_props: Props) => {
  const { data } = _props;
  const itemsPerpage = 10;
  const lengthData = data?.detailDo.length ? data.detailDo.length : 0;
  const totalPages = Math.ceil(lengthData / itemsPerpage);
  const [preparedBy, setPreparedBy] = useState<string>("");
  const [approvedBy, setApprovedBy] = useState<string>("");
  const [checkedBy, setCheckedBy] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(data?.ttdGa ?? "")
      .then((url) => setPreparedBy(url))
      .catch((err) => console.error(err));

    QRCode.toDataURL(data?.ttdAppove ?? "")
      .then((url) => setApprovedBy(url))
      .catch((err) => console.error(err));

    QRCode.toDataURL(data?.ttdchecked ?? "")
      .then((url) => setCheckedBy(url))
      .catch((err) => console.error(err));
  }, [data?.detailDo, data?.ttdAppove, data?.ttdGa, data?.ttdchecked]);
  return (
    <Document>
      {Array.from({ length: totalPages }).map((_, pageIndex) => {
        const start = pageIndex * itemsPerpage;
        const end = start + itemsPerpage;
        const pageData = data?.detailDo.slice(start, end);

        return (
          <Page size="A4" style={styles.page} key={pageIndex}>
            <Header />
            <View style={styles.content}>
              {pageIndex === 0 && (
                <View
                  style={{
                    border: "1px solid black",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      width: "50%",
                      display: "flex",
                      flexDirection: "row",
                      gap: 4,
                      padding: 8,
                    }}
                  >
                    <View>
                      <Text style={{ marginBottom: 4, fontWeight: "bold" }}>
                        Number
                      </Text>
                      <Text style={{ marginBottom: 4 }}>Date</Text>
                      <Text style={{ marginBottom: 4 }}>Ship To</Text>
                      <Text style={{ marginBottom: 4 }}>Address</Text>
                      <Text>Contact</Text>
                    </View>
                    <View>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text>:</Text>
                    </View>

                    <View>
                      <Text style={{ marginBottom: 4 }}>
                        {data?.number ?? "-"}
                      </Text>
                      <Text style={{ marginBottom: 4 }}>
                        {data?.date ?? "-"}
                      </Text>
                      <Text style={{ marginBottom: 4 }}>
                        {data?.shipto ?? "-"}
                      </Text>
                      <Text style={{ marginBottom: 4 }}>
                        {data?.address ?? "-"}
                      </Text>
                      <Text>{data?.contact ?? "-"}</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      width: "50%",
                      display: "flex",
                      flexDirection: "row",
                      gap: 4,
                      padding: 8,
                    }}
                  >
                    <View>
                      <Text style={{ marginBottom: 4 }}>Phone</Text>
                      <Text style={{ marginBottom: 4 }}>Facsimile</Text>
                      <Text style={{ marginBottom: 4 }}>Your Ref.</Text>
                      <Text style={{ marginBottom: 4 }}>Your Project</Text>
                      <Text style={{ marginBottom: 4 }}>E-mail</Text>
                      <Text>Our Job No</Text>
                    </View>
                    <View>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text style={{ marginBottom: 4 }}>:</Text>
                      <Text>:</Text>
                    </View>

                    <View>
                      <Text style={{ marginBottom: 4 }}>
                        {data?.phone ?? "-"}
                      </Text>

                      <Text style={{ marginBottom: 4 }}>-</Text>
                      <Text style={{ marginBottom: 4 }}>
                        {data?.youref === "" && "-"}
                      </Text>
                      <Text style={{ marginBottom: 4 }}>
                        {data?.yourprojec === "" && "-"}
                      </Text>
                      <Text style={{ marginBottom: 4 }}>-</Text>
                      <Text>{data?.ournojob}</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Table */}
              {pageIndex === 0 && (
                <View style={styles.table}>
                  <View
                    style={{
                      width: "4%",
                      textAlign: "center",
                      padding: 2,
                      backgroundColor: "#D9D9D9",
                    }}
                  >
                    <Text>No</Text>
                  </View>
                  <View
                    style={{
                      width: "80%",
                      textAlign: "center",
                      padding: 2,
                      borderRight: "1px solid black",
                      borderLeft: "1px solid black",
                      backgroundColor: "#D9D9D9",
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
                      backgroundColor: "#D9D9D9",
                    }}
                  >
                    <Text>Qty</Text>
                  </View>
                  <View
                    style={{
                      width: "8%",
                      textAlign: "center",
                      padding: 2,
                      backgroundColor: "#D9D9D9",
                    }}
                  >
                    <Text>Unit</Text>
                  </View>
                </View>
              )}

              {/* Looping Content */}
              {pageIndex === 0 && (
                <View>
                  <View style={[styles.table]}>
                    <View
                      style={{
                        width: "4%",
                        textAlign: "center",
                        padding: 2,
                      }}
                    >
                      <Text style={{ opacity: 0 }}>1</Text>
                    </View>
                    <View
                      style={{
                        width: "80%",
                        padding: 2,
                        borderRight: "1px solid black",
                        borderLeft: "1px solid black",
                      }}
                    ></View>

                    <View
                      style={{
                        width: "8%",
                        textAlign: "center",
                        padding: 2,
                        borderRight: "1px solid black",
                      }}
                    ></View>
                    <View
                      style={{
                        width: "8%",
                        textAlign: "center",
                        padding: 2,
                      }}
                    ></View>
                  </View>
                  <View style={[styles.table]}>
                    <View
                      style={{
                        width: "4%",
                        textAlign: "center",
                        padding: 2,
                      }}
                    >
                      <Text style={{ opacity: 0 }}>1</Text>
                    </View>
                    <View
                      style={{
                        width: "80%",
                        padding: 2,
                        borderRight: "1px solid black",
                        borderLeft: "1px solid black",
                      }}
                    >
                      <Text>{data?.note}</Text>
                    </View>

                    <View
                      style={{
                        width: "8%",
                        textAlign: "center",
                        padding: 2,
                        borderRight: "1px solid black",
                      }}
                    ></View>
                    <View
                      style={{
                        width: "8%",
                        textAlign: "center",
                        padding: 2,
                      }}
                    ></View>
                  </View>
                </View>
              )}

              {pageData.map((value, index) => (
                <View
                  key={index}
                  style={[
                    styles.table,
                    {
                      borderTop:
                        pageIndex !== 0 && index === 0 ? "1px solid black" : 0,
                    },
                  ]}
                >
                  <View
                    style={{
                      width: "4%",
                      textAlign: "center",
                      padding: 2,
                    }}
                  >
                    <Text>{value.no}</Text>
                  </View>
                  <View
                    style={{
                      width: "80%",
                      padding: 2,
                      borderRight: "1px solid black",
                      borderLeft: "1px solid black",
                    }}
                  >
                    <Text>{value.desc}</Text>
                    {value.note !== "" && (
                      <Text style={{ paddingLeft: 10 }}>{value.note}</Text>
                    )}
                  </View>

                  <View
                    style={{
                      width: "8%",
                      textAlign: "center",
                      padding: 2,
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text>{value.qty}</Text>
                  </View>
                  <View
                    style={{
                      width: "8%",
                      textAlign: "center",
                      padding: 2,
                    }}
                  >
                    <Text>{value.unit}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View
              style={[
                {
                  position: "absolute",
                  bottom: 30,
                  left: 0,
                  right: 0,
                  marginRight: "48px",
                  marginLeft: "96px",
                  textAlign: "center",
                  paddingTop: 10,
                  fontFamily: "Calibri",
                  fontSize: 10,
                  marginTop: 20,
                },
              ]}
            >
              <View>
                <View style={[styles.table, { borderTop: "1px solid black" }]}>
                  <View
                    style={{
                      width: "30%",
                      textAlign: "center",
                      padding: 2,
                      backgroundColor: "#D9D9D9",
                    }}
                  >
                    <Text>Prepared By</Text>
                  </View>
                  <View
                    style={{
                      width: "30%",
                      textAlign: "center",
                      padding: 2,
                      borderRight: "1px solid black",
                      borderLeft: "1px solid black",
                      backgroundColor: "#D9D9D9",
                    }}
                  >
                    <Text>Position</Text>
                  </View>

                  <View
                    style={{
                      width: "40%",
                      textAlign: "center",
                      padding: 2,
                      backgroundColor: "#D9D9D9",
                    }}
                  >
                    <Text>Date, signature & stamp</Text>
                  </View>
                </View>
                <View style={styles.table}>
                  <View
                    style={{
                      width: "30%",
                      textAlign: "center",
                      paddingVertical: 10,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Text>{data?.ttdDo}</Text>
                  </View>
                  <View
                    style={{
                      width: "30%",
                      textAlign: "center",
                      paddingVertical: 10,
                      borderRight: "1px solid black",
                      borderLeft: "1px solid black",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Text>{data?.poDo}</Text>
                  </View>

                  <View
                    style={{
                      width: "40%",
                      paddingVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ width: "40%" }}>
                        <Text style={{ paddingLeft: 4 }}>
                          {data?.dateCreate}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: "70%",
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        {preparedBy && (
                          <Image src={preparedBy} style={styles.qrCode} />
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View>
                <View style={styles.table}>
                  <View
                    style={{
                      width: "30%",
                      textAlign: "center",
                      padding: 2,
                      backgroundColor: "#D9D9D9",
                    }}
                  >
                    <Text>Approved By</Text>
                  </View>
                  <View
                    style={{
                      width: "30%",
                      textAlign: "center",
                      padding: 2,
                      borderRight: "1px solid black",
                      borderLeft: "1px solid black",
                      backgroundColor: "#D9D9D9",
                    }}
                  >
                    <Text>Position</Text>
                  </View>

                  <View
                    style={{
                      width: "40%",
                      textAlign: "center",
                      padding: 2,
                      backgroundColor: "#D9D9D9",
                    }}
                  >
                    <Text>Date, signature & stamp</Text>
                  </View>
                </View>
                <View style={styles.table}>
                  <View
                    style={{
                      width: "30%",
                      textAlign: "center",
                      paddingVertical: 10,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Text>{data?.ttdApro}</Text>
                  </View>
                  <View
                    style={{
                      width: "30%",
                      textAlign: "center",
                      paddingVertical: 10,
                      borderRight: "1px solid black",
                      borderLeft: "1px solid black",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Text>{data?.poApro}</Text>
                  </View>

                  <View
                    style={{
                      width: "40%",
                      paddingVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ width: "40%" }}>
                        <Text style={{ paddingLeft: 4 }}>
                          {data?.dateCreate}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: "70%",
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        {approvedBy && (
                          <Image src={approvedBy} style={styles.qrCode} />
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View>
                <View style={styles.table}>
                  <View
                    style={{
                      width: "30%",
                      textAlign: "center",
                      padding: 2,
                      backgroundColor: "#D9D9D9",
                    }}
                  >
                    <Text>Checked by</Text>
                  </View>
                  <View
                    style={{
                      width: "30%",
                      textAlign: "center",
                      padding: 2,
                      borderRight: "1px solid black",
                      borderLeft: "1px solid black",
                      backgroundColor: "#D9D9D9",
                    }}
                  >
                    <Text>Position</Text>
                  </View>

                  <View
                    style={{
                      width: "40%",
                      textAlign: "center",
                      padding: 2,
                      backgroundColor: "#D9D9D9",
                    }}
                  >
                    <Text>Date, signature & stamp</Text>
                  </View>
                </View>
                <View style={styles.table}>
                  <View
                    style={{
                      width: "30%",
                      textAlign: "center",
                      paddingVertical: 10,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Text>{data?.ttdCheck}</Text>
                  </View>
                  <View
                    style={{
                      width: "30%",
                      textAlign: "center",
                      paddingVertical: 10,
                      borderRight: "1px solid black",
                      borderLeft: "1px solid black",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Text>{data?.poCheck}</Text>
                  </View>

                  <View
                    style={{
                      width: "40%",
                      paddingVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ width: "40%" }}>
                        <Text style={{ paddingLeft: 4 }}>
                          {data?.dateCreate}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: "70%",
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        {checkedBy && (
                          <Image src={checkedBy} style={styles.qrCode} />
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View>
                <View style={styles.table}>
                  <View
                    style={{
                      width: "30%",
                      textAlign: "center",
                      padding: 2,
                      backgroundColor: "#D9D9D9",
                    }}
                  >
                    <Text>Received by</Text>
                  </View>
                  <View
                    style={{
                      width: "30%",
                      textAlign: "center",
                      padding: 2,
                      borderRight: "1px solid black",
                      borderLeft: "1px solid black",
                      backgroundColor: "#D9D9D9",
                    }}
                  >
                    <Text>Position</Text>
                  </View>

                  <View
                    style={{
                      width: "40%",
                      textAlign: "center",
                      padding: 2,
                      backgroundColor: "#D9D9D9",
                    }}
                  >
                    <Text>Date, signature & stamp</Text>
                  </View>
                </View>
                <View style={styles.table}>
                  <View
                    style={{
                      width: "30%",
                      textAlign: "center",
                      paddingVertical: 10,
                    }}
                  ></View>
                  <View
                    style={{
                      width: "30%",
                      textAlign: "center",
                      paddingVertical: 10,
                      borderRight: "1px solid black",
                      borderLeft: "1px solid black",
                    }}
                  ></View>

                  <View
                    style={{
                      width: "40%",
                      paddingVertical: 10,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      opacity: 0,
                    }}
                  >
                    <View style={{ width: "40%" }}>
                      <Text style={{ paddingLeft: 4 }}>{data?.dateCreate}</Text>
                    </View>
                    <View
                      style={{
                        width: "70%",
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      {approvedBy && (
                        <Image src={approvedBy} style={styles.qrCode} />
                      )}
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
