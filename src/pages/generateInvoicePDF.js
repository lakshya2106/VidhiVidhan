import jsPDF from "jspdf"
import QRCode from "qrcode"

const generateInvoicePDF = async (invoice, totals) => {
  const doc = new jsPDF("p", "mm", "a4")
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()

 const gState = doc.GState({ opacity: 0.25 }) 
  doc.setGState(gState)
  doc.addImage(invoice.bgimage, 0, 0, W, H)

  // ===== BACKGROUND IMAGE =====
if (invoice.bgimage) {
  doc.addImage(
    invoice.bgimage,
    "PNG",    
    0,
    0,
    W,
    H
  )
}
 const gState1 = doc.GState({ opacity: 0.05 }) 
  doc.setGState(gState1)

  doc.addImage(invoice.companyLogo, "PNG", 0,0,W,H)

    doc.setGState(doc.GState({ opacity: 1 }))
  
  /* COLORS */
  const gold = [176, 146, 55]
  const dark = [35, 45, 50]
  const gray = [120, 120, 120]

  const margin = 20
  const rowHeight = 8
  const bottomLimit = H - 90

  /* ================= COMPANY NAME ================= */
  doc.setFont("helvetica", "bold")
  doc.setFontSize(20)
  doc.setTextColor(...dark)


  if (invoice.companyLogo) {
    doc.addImage(invoice.companyLogo, "PNG", W - 195, 7, 25, 20)
  }
  
  doc.setFontSize(12)
  doc.text(`Date: ${invoice.createdDate}`, W - margin, 42, { align: "right" })
  
  doc.setFontSize(20)
  const companyName = "VIDHI VIDHAN"
  doc.text(companyName, W / 2, 18, { align: "center" })

  const textWidth = doc.getTextWidth(companyName)
  doc.setLineWidth(0.7)
  doc.line(W / 2 - textWidth / 2, 20, W / 2 + textWidth / 2, 20)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(...gray)
  doc.text("Wedding & Event Management", W / 2, 26, { align: "center" })


  /* ================= HEADER ================= */
  doc.setFont("helvetica", "bold")
  doc.setFontSize(22)
  doc.setTextColor(...dark)
  doc.text("Payment Invoice", margin, 36)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`No. ${invoice.invoiceNumber}`, margin, 41)

  doc.setDrawColor(220)
  doc.line(margin, 44, W - margin, 44)


  /* ================= BILLING ================= */
  doc.setFont("helvetica", "bold")
  doc.text("Invoice to:", margin, 55)
  doc.text("Event Dates:", W / 2 + 10, 55)

  doc.setFont("helvetica", "normal")

  // LEFT COLUMN (Receiver)
  let leftY = 62
  const leftX = margin
  const leftWidth = W / 2 - margin - 10  // column width

  doc.setFont("helvetica", "normal")

  if (invoice.receiver.name) {
    doc.text(invoice.receiver.name, leftX, leftY)
    leftY += 6
  }

  if (invoice.receiver.address1) {
    const lines = doc.splitTextToSize(invoice.receiver.address1, leftWidth)
    doc.text(lines, leftX, leftY)
    leftY += lines.length * 5
  }

  if (invoice.receiver.address2) {
    const lines = doc.splitTextToSize(invoice.receiver.address2, leftWidth)
    doc.text(lines, leftX, leftY)
    leftY += lines.length * 5
  }

  if (invoice.receiver.phn) {
    doc.text(`Phone: ${invoice.receiver.phn}`, leftX, leftY)
    leftY += 6
  }


  // RIGHT COLUMN (Events)
  let rightY = 62
  const rightX = W / 2 + 10

  if (invoice.receiver.events && invoice.receiver.events.length) {
    const ev = invoice.receiver.events.filter(Boolean)
    ev.forEach((d) => {
      doc.text(`• ${d}`, rightX, rightY)
      rightY += 6
    })
  } else {
    doc.setTextColor(...gray)
    doc.text("—", rightX, rightY)
    doc.setTextColor(...dark)
  }



  /* ================= TABLE HEADER FUNCTION ================= */
  const drawTableHeader = (y) => {
    doc.setFillColor(...gold)
    doc.rect(margin, y, W - margin * 2, 10, "F")

    doc.setFont("helvetica", "bold")
    doc.setTextColor(255, 255, 255)
    doc.text("No", 22, y + 7)
    doc.text("Item Description", 40, y + 7)
    doc.text("Price", 120, y + 7)
    doc.text("Qty", 140, y + 7)
    doc.text("Total", 165, y + 7)
  }

  let y = 90
  drawTableHeader(y)
  y += 20

  /* ================= TABLE ROWS (AUTO PAGE BREAK) ================= */
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...dark)

  invoice.items.forEach((item, i) => {
    if (y > bottomLimit) {
     doc.addPage()

if (invoice.bgimage) {
  doc.addImage(
    invoice.bgimage,
    "PNG",
    0,
    0,
    W,
    H
  )
}

y = 30
drawTableHeader(y)
y += 20

    }

    doc.text(String(i + 1), 22, y)
    doc.text(item.description || "-", 40, y)
    doc.text(String(item.price || "0"), 120, y)
    doc.text(String(item.qty || "1"), 140, y)

    const lineTotal = (Number(item.price || 0) * Number(item.qty || 1)).toFixed(2)
    doc.text(lineTotal, 175, y, { align: "right" })


    doc.setDrawColor(235)
    doc.line(margin, y + 2, W - margin, y + 2)

    y += rowHeight
  })

  /* ================= TOTALS ================= */
  y += 12

  const boxX = W - 85
  const boxY = y - 4
  const boxW = 65
  const boxH = 28

  // Box
  doc.setDrawColor(200)
  doc.setLineWidth(0.6)
  doc.rect(boxX, boxY, boxW, boxH)

  // Text
  doc.setFont("helvetica", "normal")
  doc.text("Sub Total", boxX + 4, y + 2)
  doc.text(String(totals.subTotal), boxX + boxW - 4, y + 2, { align: "right" })

  y += 7
  doc.text(`Tax (${invoice.taxRate}%)`, boxX + 4, y + 2)
  doc.text(String(totals.taxAmount), boxX + boxW - 4, y + 2, { align: "right" })

  y += 8
  doc.setFont("helvetica", "bold")
  doc.text("TOTAL", boxX + 4, y + 2)
  doc.text(String(totals.total), boxX + boxW - 4, y + 2, { align: "right" })

  /* ================= TERMS ================= */
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.text("Terms & Conditions", margin, y + 12)

  doc.setFont("helvetica", "normal")
  doc.text(
    "Payment should be completed within the due date mentioned above.\nThank you for choosing our services.",
    margin,
    y + 18
  )

  /* ================= QR CODE ================= */
const upiId = "nikhilnpurbia@okhdfcbank"        
const payeeName = "Vidhi Vidhan"
const amount = totals.total
const note = `Invoice ${invoice.invoiceNumber}`

const qrData = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
  payeeName
)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`

const qr = await QRCode.toDataURL(qrData)

doc.addImage(qr, "PNG", margin, H - 70, 30, 30)
doc.text("Scan to pay via GPay / PhonePe / Paytm", margin + 35, H - 52)


  /* ================= SIGNATURE ================= */
  doc.setFont("helvetica", "italic")
  doc.setFontSize(18)
  doc.text("Nikhil Purbia", W - 85, H - 55)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text("Owner", W - 85, H - 48)


  doc.setDrawColor(220)
  doc.line(20, H - 35, W - 20, H - 35)

  /* ================= FOOTER ================= */
  doc.setFontSize(9)
  doc.setTextColor(...gray)
  doc.text(`Address1:${invoice.sender.address1 || ""}`, W / 2, H - 22, { align: "center" })
  doc.text(`Address2${invoice.sender.address2 || ""}`, W / 2, H - 16, { align: "center" })
  doc.text(`Mobile No. :${invoice.sender.acc || ""}`, W / 2, H - 10, { align: "center" })
  doc.text(`Email: `, W / 2, H - 4, { align: "center" })


  // Instagram (right aligned + clickable)
const instagramHandle = "@vidhividhan"
const instagramUrl = "https://www.instagram.com/v.v_eventplanners?igsh=N3JveHFyMHU0a20z"

doc.setFont("helvetica", "bold")
doc.setTextColor(193, 53, 132)
doc.text(instagramHandle, W - margin, H - 15, { align: "right" })

// Make it clickable
doc.link(
  W - margin - doc.getTextWidth(instagramHandle),
  H - 14,
  doc.getTextWidth(instagramHandle),
  6,
  { url: instagramUrl }
)

  doc.save(`${invoice.invoiceNumber}.pdf`)
}

export default generateInvoicePDF
