
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Activity } from '../types';

export const exportToPDF = (activities: Activity[]) => {
  const doc = new jsPDF() as any;
  const acceptedOnly = activities.filter(a => a.status === 'accepted');
  const sorted = [...acceptedOnly].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Header
  doc.setFillColor(0, 45, 86); // LPDP Blue
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('LPDP 2N+1 IMPACT REPORT', 15, 20);
  doc.setFontSize(10);
  doc.text(`Scholar: Ngurah Sentana | Date: ${new Date().toLocaleDateString()}`, 15, 30);

  // Section 1: Summary Stats
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.text('Overall Summary', 15, 55);
  
  const impactMap: Record<string, { total: number, unit: string }> = {};

  acceptedOnly.forEach(act => {
    act.metrics.forEach(m => {
      const key = m.label.toLowerCase();
      if (impactMap[key]) {
        impactMap[key].total += Number(m.value);
      } else {
        impactMap[key] = { total: Number(m.value), unit: m.unit };
      }
    });
  });

  // Section 2: Activity Table
  doc.setFontSize(14);
  doc.text('Accepted Activity Records', 15, 75);
  
  const activityRows = sorted.map((a, i) => [
    i + 1,
    new Date(a.date).toLocaleDateString(),
    a.title,
    a.location,
    a.category
  ]);

  doc.autoTable({
    startY: 82,
    head: [['#', 'Date', 'Activity Title', 'Location', 'Category']],
    body: activityRows,
    headStyles: { fillColor: [0, 45, 86] },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });

  // Section 3: Impact Table
  const finalY = doc.lastAutoTable?.finalY || 120;
  doc.setFontSize(14);
  doc.text('Cumulative Impact Metrics', 15, finalY + 15);
  
  const impactRows = Object.entries(impactMap).map(([label, data]) => [
    label.toUpperCase(),
    data.total.toLocaleString(),
    data.unit.toUpperCase()
  ]);

  doc.autoTable({
    startY: finalY + 22,
    head: [['Metric Type', 'Value', 'Unit']],
    body: impactRows,
    headStyles: { fillColor: [248, 177, 0] }, // LPDP Gold
    alternateRowStyles: { fillColor: [255, 251, 235] }
  });

  // Section 4: Timeline Summary
  const timelineY = doc.lastAutoTable?.finalY || 200;
  if (timelineY > 230) doc.addPage();
  const nextY = timelineY > 230 ? 20 : timelineY + 15;
  
  doc.setFontSize(14);
  doc.text('Service Timeline', 15, nextY);
  
  const timelineRows = sorted.map(a => [
    new Date(a.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    a.title,
    a.shortDescription || (a.detailedNarrative ? a.detailedNarrative.substring(0, 60) + '...' : 'N/A')
  ]);

  doc.autoTable({
    startY: nextY + 7,
    head: [['Period', 'Milestone', 'Focus']],
    body: timelineRows,
    headStyles: { fillColor: [0, 45, 86] }
  });

  // Section 5: Impact Vision (From Essay)
  doc.addPage();
  doc.setFillColor(0, 45, 86);
  doc.rect(15, 15, 180, 2, 'F');
  
  doc.setTextColor(0, 45, 86);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Personal Contribution Vision: Indonesia Emas 2045', 15, 25);
  
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('"Data is the new oil." - Clive Humby', 15, 32);

  doc.setFont('helvetica', 'normal');
  const essaySummary = [
    "Visi strategis Ngurah Sentana berfokus pada pemanfaatan data sebagai pilar fundamental pembangunan negara.",
    "Berdasarkan pengalaman di Kecamatan Sidemen, ditemukan kesenjangan data yang signifikan yang menghambat",
    "efisiensi penyaluran bantuan sosial. Melalui studi Magister Statistika dan Sains Data di IPB, kontribusi",
    "akan difokuskan pada tiga pilar utama:",
    "",
    "1. Pendidikan Literasi Data: Menjadi akademisi yang mencetak lulusan dengan keterampilan digital yang relevan.",
    "2. Pemberdayaan Desa: Membantu perangkat desa mengelola data secara obyektif untuk kebijakan inklusif.",
    "3. Pengembangan Infrastruktur Data: Membangun portal data lokal melalui inisiatif Lembaga Swadaya Masyarakat.",
    "",
    "Target akhir adalah mengurangi disparitas digital antara wilayah urban dan rural di Bali Timur serta mendukung",
    "terwujudnya tata kelola data nasional yang akurat, komprehensif, dan terpercaya menuju Indonesia Emas 2045."
  ];

  doc.text(essaySummary, 15, 45);

  // Footer Signature
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(9);
  doc.text('Digitally Signed by LPDP Scholar: Ngurah Sentana', 105, 280, { align: 'center' });

  doc.save(`LPDP_2N1_NgurahSentana_FinalReport.pdf`);
};
