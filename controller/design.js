  // Assuming 'orderDetailsHTML' is a variable containing your HTML content
  const orderDetailsHTML = `
  <html>
      <head>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  margin: 20px;
                  background-color: #f4f4f4;
                  color: #333;
              }

              h1, h2 {
                  color: #007bff;
              }

              p {
                  margin-bottom: 5px;
              }

              ul {
                  list-style: none;
                  padding: 0;
              }

              li {
                  border: 1px solid #ddd;
                  border-radius: 5px;
                  margin-bottom: 10px;
                  padding: 15px;
                  background-color: #fff;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }

              li:last-child {
                  margin-bottom: 0;
              }


              strong {
                  color: #007bff;
              }

          </style>
          <title>Order Details</title>
      </head>
      <body>
          <h1>Order Details</h1>
          <p>Order ID: ${orderId}</p>
          <p>Client Name: ${req.body.clientName}</p>
          <p>Firm Name: ${req.body.firmName}</p>
          <p>Address: ${req.body.address}</p>
          <p>City: ${req.body.city}</p>
          <p>Phone Number: ${req.body.phone_no}</p>
          <p>Order Status: ${req.body.orderstatus !== undefined ? req.body.orderstatus : 'Pending'}</p>
          <p>Order_mark: ${req.body.order_mark !== undefined ? req.body.order_mark : 'Pending'}</p>
          <p>sales_id: ${req.body.sales_id}</p>


          <h2>Product Details</h2>
          <ul>
              ${req.body.products.map(product => `
                  <li>
                      <strong>Product Name:</strong> ${product.select_product}<br>
                      <strong>Company:</strong> ${product.company}<br>
                      <strong>Grade:</strong> ${product.grade}<br>
                      <strong>Top Color:</strong> ${product.topcolor}<br>
                      <strong>Coating:</strong> ${product.coating}<br>
                      <strong>Temper:</strong> ${product.temper}<br>
                      <strong>Guard Film:</strong> ${product.guardfilm}<br>
                      <strong>Weight:</strong> ${product.weight}<br>
                  </li>
              `).join('')}
          </ul>
      </body>
  </html>
`;

module.exports={orderDetailsHTML}