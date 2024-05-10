const MailTemplate = (username, phone, address, cartItems, totalPrice) => {
  function addDotsToPrice(price) {
    // Convert the price to a string 12.345
    let numString;
    if (typeof price === "number") {
      numString = price.toString();
    } else {
      numString = price;
    }

    // Initialize an empty result string
    let result = "";

    // Iterate through the string from right to left
    for (let i = numString.length - 1; i >= 0; i--) {
      // Add the current character to the result
      result = numString[i] + result;

      // Add a dot after every 3 characters (except for the first group)
      // Quy luật để xác định được 3 số từ phải sang trái là length - index = 3
      if ((numString.length - i) % 3 === 0 && i !== 0) {
        result = "." + result;
      }
    }

    return result + " VND";
  }

  const row = cartItems.map((product) => {
    return `<tr>
      <td>${product.name}</td>
      <td><img src="${product.img}" alt="${product.name}" /></td>
      <td>${addDotsToPrice(product.price)}</td>
      <td>${product.quantity}</td>
      <td>${addDotsToPrice(product.totalPriceOfProduct)}</td>
    </tr>`;
  });

  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Bill Check Out</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
          }
          p {
            color: #666;
            margin-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th,
          td {
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          img {
            max-width: 100px;
            height: auto;
          }
          .total {
            font-size: 20px;
            font-weight: bold;
            margin-top: 20px;
          }
          .thanks {
            color: #007bff;
            font-size: 18px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Xin Chào ${username},</h1>
          <p>Phone: ${phone}</p>
          <p>Address: ${address}</p>
          <table border="1">
            <thead>
              <tr>
                <th>Tên Sản Phẩm</th>
                <th>Hình Ảnh</th>
                <th>Giá</th>
                <th>Số Lượng</th>
                <th>Thành Tiền</th>
              </tr>
            </thead>
            <tbody>
             ${row}
            </tbody>
          </table>
          <div class="total"><h1>Tổng thanh toán: ${addDotsToPrice(
            totalPrice
          )}</h1></div>
          <div class="thanks"><h1>Cám ơn bạn!</h1></div>
        </div>
      </body>
    </html>
    `;
};

module.exports = MailTemplate;
