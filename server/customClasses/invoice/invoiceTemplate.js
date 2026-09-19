const default_invoice_templates = {
  invoice_html: `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice-{{order_id}}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 20px;
      }
      .invoice-container {
        padding: 30px;
        border-radius: 10px;
        max-width: 800px;
        margin: auto;
      }
      h1,
      h2,
      h3 {
        color: #333;
      }
      .w-50 {
        width: 50%;
      }
      .desc {
        margin-left: 20px;
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .info-section {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .table-container {
        width: 100%;
        overflow-x: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th,
      td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: center;
      }

      td:last-child {
        border-right: 1px solid #ddd !important;
      }

      th {
        background: #007bff;
        color: #fff;
      }
      tr:nth-child(even) {
        background: #f9f9f9;
      }
      .total {
        text-align: right;
        font-weight: bold;
        padding: 10px;
      }
    </style>
  </head>
  <body>
    <div className="invoice-container">
      <div className="header">
        <h1>TAX INVOICE</h1>
        <h3>Order ID: {{invoice_order_id}}</h3>
      </div>
      <div className="info-section">
        <div className="w-50">
          <h2>Bill To:</h2>
          <div className="desc">
            <strong>
              <p>{{customer_name}}</p>
              <p>SA ID: {{sa_id}}</p>
              <p>Mobile: {{customer_mobile}}</p>
              <p>Address: {{customer_address}}</p>
            </strong>
          </div>
        </div>
        <div className="w-50">
          <h2>From:</h2>
          <div className="desc">
            <strong>
              <p>{{company_name}}</p>
              <p>{{company_address}}</p>
              <p>Website: <a href="#">www.example.com</a></p>
              <p>GST: {{company_gst}}</p>
            </strong>
          </div>
        </div>
      </div>
      <div className="table-container">
        <table>
          <tr>
            <th>Order ID</th>
            <th>Description of Orders</th>
            <th>Cost</th>
            <th>Sub-Total</th>
          </tr>
          <tr>
            <td>{{invoice_order_id}}</td>
            <td>{{order_items}}</td>
            <td>{{order_amount}}</td>
            <td>{{order_full_amount}}</td>
          </tr>
          <tr>
            <td colspan="3" className="total">Total</td>
            <td>Rs. {{total_amount}}</td>
          </tr>
        </table>
      </div>
      <div className="header">
        <p>Certified that particulars given above are true and correct.</p>
        <p>This is computer generated invoice. Printed on {{invoice_date}}</p>
      </div>
    </div>
  </body>
</html>
`,
};

module.exports = default_invoice_templates;
