"use client";

import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CertificateProps {
  studentName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
  instructorName?: string;
}

export default function Certificate({
  studentName,
  courseName,
  completionDate,
  certificateId,
  instructorName = "System 777",
}: CertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const downloadAsImage = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    });
    const link = document.createElement("a");
    link.download = `Certificado-${courseName.replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const downloadAsPDF = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width / 2, canvas.height / 2],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`Certificado-${courseName.replace(/\s+/g, "-")}.pdf`);
  };

  return (
    <div>
      <div
        ref={certRef}
        style={{
          width: "900px",
          height: "636px",
          background: "linear-gradient(135deg, #0A0A0A 0%, #121212 50%, #0A0A0A 100%)",
          border: "3px solid #00FF88",
          borderRadius: "16px",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {/* Decorative corners */}
        <div style={{ position: "absolute", top: "12px", left: "12px", width: "60px", height: "60px", borderTop: "3px solid #00FF88", borderLeft: "3px solid #00FF88", borderRadius: "8px 0 0 0" }} />
        <div style={{ position: "absolute", top: "12px", right: "12px", width: "60px", height: "60px", borderTop: "3px solid #00FF88", borderRight: "3px solid #00FF88", borderRadius: "0 8px 0 0" }} />
        <div style={{ position: "absolute", bottom: "12px", left: "12px", width: "60px", height: "60px", borderBottom: "3px solid #00FF88", borderLeft: "3px solid #00FF88", borderRadius: "0 0 0 8px" }} />
        <div style={{ position: "absolute", bottom: "12px", right: "12px", width: "60px", height: "60px", borderBottom: "3px solid #00FF88", borderRight: "3px solid #00FF88", borderRadius: "0 0 8px 0" }} />

        {/* Glow effect */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%)" }} />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "8px", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "14px", color: "#00FF88", letterSpacing: "6px", textTransform: "uppercase", fontWeight: "600" }}>SYSTEM 777</div>
          <div style={{ fontSize: "11px", color: "#666", letterSpacing: "3px", textTransform: "uppercase", marginTop: "4px" }}>Academia Tecnológica Profesional</div>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginTop: "16px", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "white", letterSpacing: "2px" }}>CERTIFICADO</div>
          <div style={{ fontSize: "14px", color: "#888", marginTop: "4px" }}>DE COMPLETACIÓN</div>
        </div>

        {/* Divider */}
        <div style={{ width: "200px", height: "2px", background: "linear-gradient(90deg, transparent, #00FF88, transparent)", margin: "20px 0" }} />

        {/* Body */}
        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "13px", color: "#888" }}>Se certifica que</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#00FF88", margin: "8px 0" }}>{studentName}</div>
          <div style={{ fontSize: "13px", color: "#888" }}>ha completado exitosamente el curso</div>
          <div style={{ fontSize: "20px", fontWeight: "600", color: "white", margin: "8px 0" }}>{courseName}</div>
          <div style={{ fontSize: "13px", color: "#888" }}>con una duración de 40+ horas de contenido práctico</div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", marginTop: "28px", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "11px", color: "#666" }}>Fecha de Emisión</div>
            <div style={{ fontSize: "13px", color: "white", marginTop: "4px" }}>{completionDate}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", color: "#00FF88", fontWeight: "bold" }}>⚡</div>
            <div style={{ fontSize: "10px", color: "#666", marginTop: "2px" }}>jrsystem7777.com</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "11px", color: "#666" }}>Instructor</div>
            <div style={{ fontSize: "13px", color: "white", marginTop: "4px" }}>{instructorName}</div>
          </div>
        </div>

        {/* Certificate ID */}
        <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", fontSize: "9px", color: "#444", letterSpacing: "1px" }}>
          ID: {certificateId} | Verificar en jrsystem7777.com/certificates
        </div>
      </div>

      <div className="flex gap-3 mt-4 justify-center">
        <button
          onClick={downloadAsImage}
          className="flex items-center gap-2 rounded-xl bg-[#00FF88] px-6 py-3 text-sm font-semibold text-black hover:bg-[#00CC6A] transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Descargar PNG
        </button>
        <button
          onClick={downloadAsPDF}
          className="flex items-center gap-2 rounded-xl border border-[#00FF88] px-6 py-3 text-sm font-semibold text-[#00FF88] hover:bg-[#00FF88]/10 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          Descargar PDF
        </button>
      </div>
    </div>
  );
}
