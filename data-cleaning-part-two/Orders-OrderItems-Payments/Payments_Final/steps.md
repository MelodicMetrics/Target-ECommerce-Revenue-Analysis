# Steps to Create `Payments_Final`

### Step 1: Initial Cleaning
- I started by removing the `payment_sequential` column, which indicated instances where customers paid for their orders in multiple payments.
- To group `order_id`s and eliminate duplicates, I summed all `payment_value` entries into a new column called `total_payment_value`.
- This initial cleaning resulted in the `Payments_Cleaned` table, which contained **101,836 entries**.

### Step 2: Iterative Cleaning
1. **Removed Duplicates from `payment_type`**:
   - I noticed that the `payment_type` column caused **1,123 duplicate entries** because some `order_id`s were associated with multiple payment methods (e.g., `voucher` and `credit card`).
   - To resolve this, I removed the `payment_type` column, eliminating these duplicates.
   
2. **Removed Duplicates from `payment_installments`**:
   - I also identified that the `payment_installments` column created **866 duplicate entries** due to `order_id`s split across multiple installments.
   - Removing this column further reduced the duplicates in the table.

   After these changes, the `Payments_Cleaned` table was reduced to **99,847 entries**.

### Step 3: Filter Invalid `order_id`s

- To ensure only valid `order_id`s remained, I created `Payments_Final` by applying a `JOIN` between `Payments_Cleaned` and `Orders_Final`. This ensured that only `order_id`s present in `Orders_Final` appeared in `Payments_Final`.
- Additionally, I added the `GROUP BY` function to account for the removed columns `payment_installments` and `payment_type`, preventing duplicate `order_id`s that could impact future analysis.


```sql
/*
  In order to make sure the Payments table is in line with the new Orders_Final table
  I joined the two. This ensures only order_ids present in the Orders_Final table will
  appear in the Payments_Final.
  I also added the GROUP BY function to account for the removed columns payment_installments and payment_type. 
  Without using the function, I would have duplicate order_ids which could impact my analysis in 
  the future.
*/

CREATE OR REPLACE TABLE `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Payments_Final` AS 
SELECT
    payments.order_id,
    SUM(payments.total_payment_value) AS total_payment_value
FROM 
    `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Payments_Cleaned` AS payments
JOIN 
    `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Orders_Final` AS orders
ON 
    payments.order_id = orders.order_id
GROUP BY
    payments.order_id
```
- After applying these filters, the resulting `Payments_Final` table had **98,714 entries**, which was one fewer than expected.

### Step 4: Resolve Missing `order_id`
- I discovered that a single `order_id` was missing from `Payments_Final` despite being present in `Orders_Final` and `Order_Items_Final` with valid `price` and `freight_value` data.

#### **Queries to Identify and Verify the Missing `order_id`:**
```sql
SELECT 
    o.order_id 
FROM 
    iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Orders_Final AS o
LEFT JOIN 
    iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Payments_Final AS p
ON 
    o.order_id = p.order_id
WHERE 
    p.order_id IS NULL;
```
```sql
SELECT
  order_id,
  price,
  freight_value
FROM
  iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Order_Items_Final
WHERE
  order_id = "bfbd0f9bdef84302105ad712db648a6c"
```
**Supporting Tables**:

**Table 1: Missing `order_id` in `Payments_Final`**

![Table of missing `order_id` from `Payments_Final`](https://github.com/user-attachments/assets/ab457029-5bd2-40b1-a91d-26be8766c6d5)

**Table 2: Missing `order_id` Found in `Order_Items_Final`**

![Table of missing `order_id` found in `Order_Items_Final`](https://github.com/user-attachments/assets/6b3912a8-4fff-43f8-a54b-ef22e0e10efe)

**Reinserting the Missing `order_id`**

- To address this, I calculated the `total_payment_value` by summing the `price` and `freight_value` of the products associated with the missing `order_id` and inserted it into `Payments_Final`.

```sql
-- Insert the calculated total_payment_value for the missing order_id directly into Payments_Final
INSERT INTO iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Payments_Final (order_id, total_payment_value)
SELECT 
    order_id,
    ROUND(SUM(price + freight_value), 3) AS total_payment_value
FROM 
    iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Order_Items_Final
WHERE 
    order_id = 'bfbd0f9bdef84302105ad712db648a6c'
GROUP BY 
    order_id;
```



- After reinserting this `order_id`, the table returned correct total of **98,715 entries**, perfectly matching `Orders_Final`.

---

