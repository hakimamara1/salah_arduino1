import { ImageResponse } from "next/og";
import { PRODUCT } from "@/lib/content";
import { formatDZD } from "@/lib/utils";

export const runtime = "edge";
export const alt = "عدة الأردوينو التعليمية — تعلّم وابنِ ٢٢ مشروعاً";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg,#0e8f8f 0%,#0a6d6d 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 34, opacity: 0.85 }}>Arduino Shop</div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.15,
            marginTop: 24,
            maxWidth: 980,
          }}
        >
          تعلّم الأردوينو وابنِ ٢٢ مشروعاً حقيقياً
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginTop: 40,
          }}
        >
          <div
            style={{
              background: "white",
              color: "#0e8f8f",
              fontSize: 44,
              fontWeight: 800,
              padding: "12px 32px",
              borderRadius: 18,
            }}
          >
            {formatDZD(PRODUCT.price)}
          </div>
          <div style={{ fontSize: 32, opacity: 0.9 }}>
            الدفع عند الاستلام · توصيل لكل الولايات
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
