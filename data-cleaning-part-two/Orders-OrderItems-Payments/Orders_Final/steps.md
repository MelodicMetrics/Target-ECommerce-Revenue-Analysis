# Steps to Create `Orders_Final`

## Step 1: Initial `Orders_Final` Table Creation

To accurately identify which orders were missing or discrepant, I needed tables that displayed `order_id`s based on the `Customers_Final` table created earlier.

<details>
<summary>📂<b><i>Query to Create Initial Orders_Final</b></i></summary>
    
<pre><code class="language-sql">
CREATE OR REPLACE TABLE `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Orders_Final` AS 
SELECT 
    orders.order_id,
    orders.customer_id,
    orders.order_status,
    orders.order_purchase_timestamp,
FROM 
    `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Orders` AS orders
JOIN 
    `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Customers_Final` AS cust
ON 
    orders.customer_id = cust.customer_id
</code></pre>
    
</details>

- *This table just created is the one referenced in [Overview README.md](../README.md) for creating `Recalculated_Missing_Orders` and `Recalculated_Discrepant_Orders`. After creating those two tables, I referenced them in the following query in Step 2.*

## Step 2: Filtered Orders_Final Table with Missing and Discrepant Order IDs Removed

After identifying the discrepant and missing order_ids, I applied the necessary filter logic to create a complete, consistent Orders_Final table:

<details>
<summary>📂<b><i>Query to Create Filtered Orders_Final</b></i></summary>

<pre><code class="language-sql">
/* 
  This query was to create a new Orders_Final born of two issues found during initial cleaning and analysis.
    1. There are order_ids in the orders table that do not appear in the Order Items table. Those order_ids
  are marked in the Missing_Orders table.
    2. There are order_ids where the calculated revenue from price and freight do not match the total payment value
    These id's are marked in the Discrepant_Orders and Recalculated_Discrepant_orders tables. The first holds the order_ids 
    based on the initial analysis of 4 states rather than the current. The recalculated considers these new ids. 
*/

CREATE OR REPLACE TABLE `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Orders_Final` AS 
SELECT 
    orders.order_id,
    orders.customer_id,
    orders.order_status,
    orders.order_purchase_timestamp,
FROM 
    `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Orders` AS orders
JOIN 
    `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Customers_Final` AS cust
ON 
    orders.customer_id = cust.customer_id
WHERE 
 
  orders.order_id NOT IN (
        SELECT 
          order_id 
        FROM 
          iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Recalculated_Missing_Orders
  )
  AND
  orders.order_id NOT IN (
        SELECT 
          order_id 
        FROM 
          iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Recalculated_Discrepant_Orders
  )
</code></pre>
    
</details>

This approach ensured that `Orders_Final` was clean and aligned with both `Order_Items_Final` and `Payments_Final`, eliminating any `order_id`s that were missing or had revenue discrepancies.
