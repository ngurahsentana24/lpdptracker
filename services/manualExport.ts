
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const exportManualToPDF = () => {
  const doc = new jsPDF() as any;

  // Cover Page
  doc.setFillColor(0, 45, 86); // LPDP Blue
  doc.rect(0, 0, 210, 297, 'F');
  
  doc.setTextColor(255, 251, 235);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('USER MANUAL', 105, 100, { align: 'center' });
  
  doc.setFontSize(22);
  doc.text('LPDP 2N+1 Service Tracker', 105, 115, { align: 'center' });
  
  doc.setFillColor(248, 177, 0); // LPDP Gold
  doc.rect(80, 125, 50, 2, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Impact Documentation & Visualization Platform', 105, 140, { align: 'center' });
  doc.text('Authorized User: Ngurah Sentana', 105, 250, { align: 'center' });

  // Main Guide Page
  doc.addPage();
  doc.setTextColor(0, 45, 86);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Introduction', 15, 30);
  
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('This dashboard is designed to fulfill the LPDP scholarship requirement for', 15, 45);
  doc.text('documenting and reporting community service during the 2N+1 period.', 15, 52);
  
  // Sections Table
  doc.autoTable({
    startY: 65,
    head: [['Section', 'Description', 'Action']],
    body: [
      ['Dashboard', 'Visual summary of all impact metrics and growth.', 'Auto-updates'],
      ['Log Activity', 'Input form for adding new milestones.', 'Manual Entry'],
      ['Waiting List', 'Queue for entries submitted by other contributors.', 'Verification'],
      ['Timeline', 'Chronological journey of service milestones.', 'Visualization'],
      ['Gallery', 'Image repository of all verified documentation.', 'Reference'],
      ['PDF Export', 'Generates official LPDP-formatted reports.', 'Download']
    ],
    headStyles: { fillColor: [0, 45, 86] },
    alternateRowStyles: { fillColor: [245, 247, 250] }
  });

  // Security Section
  const securityY = doc.lastAutoTable?.finalY + 20 || 150;
  doc.setTextColor(0, 45, 86);
  doc.setFontSize(18);
  doc.text('2. Security & Verification', 15, securityY);
  
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);
  doc.text('Integrity is maintained via a secret passkey system:', 15, securityY + 10);
  
  const rules = [
    '• Direct Logging: Requires passkey to publish immediately.',
    '• Contributor Submission: No passkey needed, but items go to Waiting List.',
    '• Verification: Ngurah must enter passkey to verify pending entries.',
    '• Deletion: Any removal of data requires passkey authorization.'
  ];
  rules.forEach((rule, i) => {
    doc.text(rule, 20, securityY + 20 + (i * 8));
  });

  // Export Guide
  const exportY = securityY + 65;
  doc.setTextColor(0, 45, 86);
  doc.setFontSize(18);
  doc.text('3. Official Reporting', 15, exportY);
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);
  doc.text('To generate your official report for LPDP submissions:', 15, exportY + 10);
  doc.text('1. Ensure all milestones are verified (appear on Dashboard).', 20, exportY + 20);
  doc.text('2. Click "Download Report" in the sidebar.', 20, exportY + 28);
  doc.text('3. The system will aggregate impact metrics and timeline automatically.', 20, exportY + 36);

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`LPDP 2N+1 User Manual - Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
  }

  doc.save('LPDP_Tracker_User_Manual.pdf');
};
