import '../styles/InvoiceCreator.css'

const InvoicePreview = ({ invoice, totals }) => {
  return (
    <div className="invoice-preview">

      {/* HEADER */}
      <div className="invoice-header">
        <div>
          <h1>INVOICE</h1>
          <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
          <p><strong>Date:</strong> {invoice.createdDate}</p>
          <p><strong>Due Date:</strong> {invoice.dueDate || '-'}</p>
        </div>
      </div>

      {/* FROM / TO */}
      <div className="invoice-address">
        <div>
          <h4>From</h4>
          <p>{invoice.sender.name}</p>
          <p>{invoice.sender.address1}</p>
          <p>{invoice.sender.address2}</p>
          <p>Tax ID: {invoice.sender.tax}</p>
        </div>

        <div>
          <h4>Bill To</h4>
          <p>{invoice.receiver.name}</p>
          <p>{invoice.receiver.address1}</p>
          <p>{invoice.receiver.address2}</p>
          <p>Tax ID: {invoice.receiver.tax}</p>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th align="right">Price</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{item.description}</td>
              <td align="right">
                {invoice.currency} {parseFloat(item.price || 0).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTALS */}
      <div className="invoice-totals">
        <div>
          <p>Subtotal</p>
          <p>Tax ({invoice.taxRate}%)</p>
          <h3>Total</h3>
        </div>
        <div>
          <p>{invoice.currency} {totals.subTotal}</p>
          <p>{invoice.currency} {totals.taxAmount}</p>
          <h3>{invoice.currency} {totals.total}</h3>
        </div>
      </div>

      {/* FOOTER */}
      <div className="invoice-footer">
        <p>{invoice.footerText}</p>
        <p>{invoice.footerText2}</p>
      </div>

    </div>
  )
}

export default InvoicePreview
