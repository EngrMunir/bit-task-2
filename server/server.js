import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: '',
  database: 'biteTask'
});

// get data for report
app.get('/report-data', (req, res) => {
  const reportQuery = `
    SELECT 
      name, user_phone, product_name, purchase_quantity, product_price, 
      (purchase_history.purchase_quantity * products.product_price) AS 'Total'
    FROM 
      purchase_history
    JOIN 
      users ON purchase_history.user_id = users.user_id
    JOIN 
      products ON purchase_history.product_id = products.product_id
    ORDER BY 
      Total DESC;
  `;

  const grossTotalsQuery = `
    SELECT 
      SUM(purchase_history.purchase_quantity) AS gross_purchase_quantity,
      SUM(products.product_price) AS gross_product_price,
      SUM(purchase_history.purchase_quantity * products.product_price) AS gross_total
    FROM 
      purchase_history
    JOIN 
      products ON purchase_history.product_id = products.product_id;
  `;

  db.query(reportQuery, (err, reportResult) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error generating report');
    }

    db.query(grossTotalsQuery, (err, totalResult) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error calculating gross totals');
      }

      const grossTotals = totalResult[0];
      res.status(200).json({
        reportData: reportResult,
        grossTotals: {
          grossPurchaseQuantity: grossTotals.gross_purchase_quantity || 0,
          grossProductPrice: grossTotals.gross_product_price || 0,
          grossTotal: grossTotals.gross_total || 0
        }
      });
    });
  });
});


// Store data route
app.post('/store-data', async (req, res) => {
  const data = req.body;
  console.log(data);
  
  try {
    for (const item of data) {
      // Insert user into 'users' table
      const sql1 = "INSERT INTO users (`name`, `user_phone`) VALUES(?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)";
      const values1 = [item.name, item.user_phone];

      const userResult = await new Promise((resolve, reject) => {
        db.query(sql1, values1, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

      const userId = userResult.insertId || (await new Promise((resolve, reject) => {
        db.query("SELECT user_id FROM users WHERE user_phone = ?", [item.user_phone], (err, result) => {
          if (err) return reject(err);
          resolve(result[0].user_id);
        });
      }));
    
      // Insert product into 'products' table
      const sql2 = "INSERT INTO products (`product_code`, `product_name`, `product_price`) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE product_name = VALUES(product_name), product_price = VALUES(product_price)";
      const values2 = [item.product_code, item.product_name, item.product_price];

      const productResult = await new Promise((resolve, reject) => {
        db.query(sql2, values2, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

      const productId = productResult.insertId || (await new Promise((resolve, reject) => {
        db.query("SELECT product_id FROM products WHERE product_code = ?", [item.product_code], (err, result) => {
          if (err) return reject(err);
          resolve(result[0].product_id);
        });
      }));

      // Insert purchase history into 'purchase_history' table
      const sql3 = "INSERT INTO purchase_history (`user_id`, `product_id`,`product_code`, `order_no`, `purchase_quantity`, `total`, `purchase_date`) VALUES(?, ?, ?, ?, ?, ?,?)";
      const values3 = [userId, productId,item.product_code, item.order_no, item.purchase_quantity, item.product_price * item.purchase_quantity, item.created_at];

      await new Promise((resolve, reject) => {
        db.query(sql3, values3, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    }

    res.status(200).send('Data stored successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error storing data');
  }
});

// Start the server
app.listen(8081, () => {
  console.log("Server is listening on port 8081");
});
