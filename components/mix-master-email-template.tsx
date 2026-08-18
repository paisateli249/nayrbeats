import * as React from "react";

interface MixMasterEmailTemplateProps {
  customerName: string;
  songTitle: string;
  amountPaid: string;
}

export function MixMasterEmailTemplate({
  customerName,
  songTitle,
  amountPaid,
}: MixMasterEmailTemplateProps) {
  return (
    <div
      style={{
        backgroundColor: "#090909",
        color: "#ffffff",
        fontFamily: "Arial, Helvetica, sans-serif",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "620px",
          margin: "0 auto",
          backgroundColor: "#111111",
          border: "1px solid #262626",
          borderRadius: "24px",
          padding: "36px",
        }}
      >
        <p
          style={{
            color: "#2563eb",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "3px",
            margin: "0 0 12px",
          }}
        >
          NAYRBEATS
        </p>

        <h1
          style={{
            fontSize: "32px",
            lineHeight: "1.2",
            margin: "0",
          }}
        >
          Mix & Master Booking Confirmed
        </h1>

        <p
          style={{
            color: "#a3a3a3",
            fontSize: "16px",
            lineHeight: "1.7",
            marginTop: "18px",
          }}
        >
          Thank you
          {customerName ? `, ${customerName}` : ""}.
          Your Mix & Master payment was received successfully.
        </p>

        <div
          style={{
            marginTop: "28px",
            backgroundColor: "#090909",
            border: "1px solid #262626",
            borderRadius: "18px",
            padding: "22px",
          }}
        >
          <p
            style={{
              color: "#737373",
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "2px",
              margin: "0 0 8px",
            }}
          >
            PROJECT
          </p>

          <p
            style={{
              fontSize: "22px",
              fontWeight: "700",
              margin: "0 0 18px",
            }}
          >
            {songTitle}
          </p>

          <p
            style={{
              color: "#a3a3a3",
              fontSize: "14px",
              margin: "8px 0",
            }}
          >
            Service:{" "}
            <strong style={{ color: "#ffffff" }}>
              Mix & Master
            </strong>
          </p>

          <p
            style={{
              color: "#a3a3a3",
              fontSize: "14px",
              margin: "8px 0",
            }}
          >
            Amount Paid:{" "}
            <strong style={{ color: "#ffffff" }}>
              {amountPaid}
            </strong>
          </p>
        </div>

        <div
          style={{
            marginTop: "28px",
            border: "1px solid #1d4ed8",
            backgroundColor: "#0b1630",
            borderRadius: "18px",
            padding: "20px",
          }}
        >
          <p
            style={{
              margin: "0",
              fontWeight: "700",
              fontSize: "15px",
            }}
          >
            What happens next?
          </p>

          <p
            style={{
              color: "#a3a3a3",
              fontSize: "14px",
              lineHeight: "1.7",
              margin: "10px 0 0",
            }}
          >
            NAYRBEATS will contact you at this email address with the next
            steps for sending your stems/files and any final project details.
          </p>
        </div>

        <p
          style={{
            color: "#737373",
            fontSize: "12px",
            lineHeight: "1.6",
            marginTop: "28px",
          }}
        >
          Keep this email for your records. If you need to reference your
          booking later, use the same email address you entered at checkout.
        </p>
      </div>
    </div>
  );
}