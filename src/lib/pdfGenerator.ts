import jsPDF from "jspdf";
import type { Tables } from "@/integrations/supabase/types";

export function generateConstanciaResidencia(residente: Tables<"residentes">) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("REPÚBLICA BOLIVARIANA DE VENEZUELA", pageWidth / 2, 25, { align: "center" });

  doc.setFontSize(13);
  doc.text("COMUNIDAD SAN PABLO DE CARINAGUA", pageWidth / 2, 35, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Consejo Comunal", pageWidth / 2, 43, { align: "center" });

  // Line
  doc.setLineWidth(0.5);
  doc.line(20, 50, pageWidth - 20, 50);

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("CONSTANCIA DE RESIDENCIA", pageWidth / 2, 70, { align: "center" });

  // Body
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  const today = new Date();
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  const bodyText = `Quien suscribe, en mi carácter de representante del Consejo Comunal de la Comunidad San Pablo de Carinagua, hago constar que el/la ciudadano(a):`;
  const lines = doc.splitTextToSize(bodyText, pageWidth - 50);
  doc.text(lines, 25, 90);

  // Resident info
  doc.setFont("helvetica", "bold");
  doc.text(`Nombre y Apellido: ${residente.nombre} ${residente.apellido}`, 25, 115);
  doc.text(`Cédula de Identidad: ${residente.cedula}`, 25, 125);
  doc.text(`Edad: ${residente.edad} años`, 25, 135);
  doc.text(`Sexo: ${residente.sexo}`, 25, 145);

  doc.setFont("helvetica", "normal");
  const residenceText = `Es residente de la Comunidad San Pablo de Carinagua, según consta en los registros de este Consejo Comunal.`;
  const resLines = doc.splitTextToSize(residenceText, pageWidth - 50);
  doc.text(resLines, 25, 165);

  const dateText = `Constancia que se expide a petición de la parte interesada, en la Comunidad San Pablo de Carinagua, a los ${today.getDate()} días del mes de ${months[today.getMonth()]} de ${today.getFullYear()}.`;
  const dateLines = doc.splitTextToSize(dateText, pageWidth - 50);
  doc.text(dateLines, 25, 185);

  // Signature
  doc.line(55, 230, 155, 230);
  doc.setFontSize(11);
  doc.text("Firma y Sello", pageWidth / 2, 238, { align: "center" });
  doc.text("Consejo Comunal San Pablo de Carinagua", pageWidth / 2, 246, { align: "center" });

  doc.save(`Constancia_Residencia_${residente.cedula}.pdf`);
}
