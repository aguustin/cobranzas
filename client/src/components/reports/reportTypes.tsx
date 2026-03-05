import * as XLSX from "xlsx";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const transformOrdersToRows = (orders: any[]) => {

  const rows: any[] = [];
  
  orders.forEach(order => {

    order.products.forEach((product: any) => {

      rows.push({
        date: new Date(order.paidAt).toLocaleDateString(),
        productName: product.productName,
        quantity: product.productQuantity,
        price: product.productPrice,
        subtotal: product.subTotalEarned,
        total: product.totalEarned,
        discount: product.totalDiscount,
        paymentType: order.paymentType,
        store: order.storeName
      });

    });

  });

  return rows;
};

export const downloadCSV = (data: any[], reportName: string) => {

  const headers = Object.keys(data[0]);

  const csvRows = [];

  csvRows.push(headers.join(","));

  for (const row of data) {
    const values = headers.map(header => row[header]);
    csvRows.push(values.join(","));
  }

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = `report_${Date.now()}.csv`;

  a.click();
};

export const downloadExcel = (data: any[], reportName: string) => {

  if (!data || data.length === 0) return;

  // convertir JSON a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // crear workbook
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

  // auto width columnas
  const columnWidths = Object.keys(data[0]).map(key => ({
    wch: Math.max(
      key.length,
      ...data.map(row => row[key]?.toString().length || 10)
    )
  }));

  worksheet["!cols"] = columnWidths;

  // descargar archivo
  XLSX.writeFile(workbook, `${reportName}_${Date.now()}.xlsx`);
};

export const downloadPDF = (data: any[], reportName: string) => {

  if (!data || data.length === 0) return;

  const doc = new jsPDF();

  const headers = Object.keys(data[0]);

  const rows = data.map(obj =>
    headers.map(header => obj[header])
  );

  // título
  doc.setFontSize(18);
  doc.text(`Reporte: ${reportName}`, 14, 20);

  doc.setFontSize(10);
  doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 28);

  autoTable(doc, {
    startY: 35,
    head: [headers],
    body: rows,
    theme: "striped",
    styles: {
      fontSize: 9
    },
    headStyles: {
      fillColor: [40, 40, 40]
    }
  });

  doc.save(`${reportName}_${Date.now()}.pdf`);
};