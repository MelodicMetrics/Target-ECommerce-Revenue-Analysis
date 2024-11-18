# Orders_Final, Order_Items_Final, and Payments_Final Overview

## Overviews of Table Changes

**To see an overview of changes made to each table, click the respective link below:** 

- [Orders_Final](./Orders_Final)
- [Order_Items_Final](./Order_Items_Final)
- [Payments_Final](./Payments_Final)

---


The `Orders_Final`, `Order_Items_Final`, and `Payments_Final` tables are connected through shared `order_id`s. The `Order_Items_Final` table contains `price` and `freight_value` columns, which together should equal the `total_payment_value` in `Payments_Final`. In the initial phase of analysis, I discovered discrepancies in these calculations and removed them to maintain data accuracy.

Since then, the dataset has undergone significant improvements, with an increased number of validated `customer_id`s and verified location data. As a result, I recalculated the discrepancy function to ensure all identified issues were accurately addressed. Additionally, I removed the `payment_type` and `payment_installments` columns from `Payments_Final`, which had been causing duplicate `order_id`s and was likely a primary source of the original discrepancies. This iterative cleaning process not only resolved outstanding issues but also enabled a more precise reconciliation between `Orders_Final` and `Order_Items_Final`.

With these recalculations, the newly created `Recalculated_Missing_Orders` and `Recalculated_Discrepant_Orders` tables now accurately reflect missing and discrepant `order_id`s, strengthening data integrity and providing a solid foundation for revenue analysis. These adjustments will ensure consistent calculations of total revenue and profitability across product categories, seller regions, and customer demographics.


---
## `Recalculated_Discrepant_Orders` Table 
To generate an updated list of `order_id`s with discrepancies between expected total payment values and calculated total order values, I created two temporary tables and joined them. Using `ROUND(SUM(...), 2)` alone would have helped to remove some small discrepancies, but others still would have appeared due to precision limitations. Including `AND ABS(c.calculated_order_value - p.total_payment_value) >= 0.01` ensured that only `order_id`s with discrepancies of at least a penny were flagged accounting for the precision limitations of the `ROUND` function.   

<details>
<summary>
🔍 <b><i>Expand to View Details on the Creation of Recalculated_Discrepant_Orders</i></b>
</summary>
<br>



```sql
/* 
    This query recalculates discrepant orders now that Payments_Final has removed payment types, eliminating duplicate order_ids in the table. 
    Two temporary tables are created and then joined to find discrepancies between total_payment_values in Payments_Final and 
    calculated_order_values based on price and freight_value in Order_Items_Final. In the JOIN, these two values are subtracted, 
    and only order_ids with calculated discrepancies of at least 0.01 (at least a penny) are displayed.
*/

CREATE OR REPlACE TABLE iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Recalculated_Discrepant_Orders AS(
    -- Create a temporary table to calculate the total value per order_id from Order_Items_Final
    WITH Calculated_Order_Values AS (
    SELECT 
        order_id,
        ROUND(SUM(price + freight_value),2) AS calculated_order_value
    FROM 
        iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Order_Items_Final
    GROUP BY 
        order_id
    ),

    -- Create a temporary table to get the total payment value per order_id from Payments_Final
    Payments_Total AS (
        SELECT 
            order_id,
            ROUND(SUM(total_payment_value),3) AS total_payment_value
        FROM 
            iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Payments_Final
        GROUP BY 
            order_id
    )

    -- Join the calculated and actual payment values to identify discrepancies
    SELECT 
        c.order_id,
        c.calculated_order_value,
        p.total_payment_value,
        -- Calculate the difference for easy identification of discrepancies
        c.calculated_order_value - p.total_payment_value AS discrepancy
    FROM 
        Calculated_Order_Values AS c
    INNER JOIN 
        Payments_Total AS p
    ON 
        c.order_id = p.order_id
    WHERE 
        c.calculated_order_value != p.total_payment_value
        AND ABS(c.calculated_order_value - p.total_payment_value) >= 0.01 --Ensures discrepancies are at least a penny
);
```
This query yielded **363** `order_id`s. 

</details>

---

## `Recalculated_Missing_Orders` Table

In addition to these discrepant `order_id`s, there are also several `order_id`s that appear in `Orders` but do not appear in `Order Items`. If left unaddressed, this would create discrepancies in analysis between `Orders_Final` and `Order_Items_Final`. During my initial data cleaning and analysis, I identified a list of these missing `order_id`s, primarily due to certain `order_id`s having a status of "unavailable" or "canceled," with a few others under different statuses.

I downloaded this list as a .CSV file and imported it into Google BigQuery to filter `Orders_Final` and `Order_Items_Final` and ensure no missing `order_id`s remained. However, after an increase in verified `customer_id`s, I realized I needed to recalculate the missing orders to maintain data consistency.


<details>
<summary>🔍 <b><i>Expand to View Details on the Creation of Recalculated_Missing_Orders</i></b></summary>

### Step 1: Calculate Missing `order_id`s by Status

First, I needed to find out how many missing `order_id`s there were along with a breakdown per status.

<details>
<summary>📂<b><i>Query to Find Missing order_ids by their status</b></i></summary>

```sql
  /*
    This query creates a temporary table (MissingOrderIDs) to calculate the count of missing order_ids for each order_status.
    It then selects the order_status and total_missing_order_ids from the temp table and adds a "Total" row,
    which sums up total_missing_order_ids across all statuses using a UNION ALL statement.
  */
  
  
  WITH MissingOrderIDs AS (
      SELECT 
          o.order_status,
          COUNT(o.order_id) AS total_missing_order_ids
      FROM iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Orders_Final o
      LEFT JOIN iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Order_Items_Final oi ON o.order_id = oi.order_id
      WHERE oi.order_id IS NULL
      GROUP BY o.order_status
  )
  
  SELECT 
    order_status, 
    total_missing_order_ids
  FROM 
    MissingOrderIDs
  
  UNION ALL
  
  SELECT 
    'Total' AS order_status, SUM(total_missing_order_ids) AS total_missing_order_ids
  FROM 
    MissingOrderIDs;
  ```
    
</details>

**Supporting Table:**

<details>
<summary>📋 <b>Table 1: Missing `order_id`s by Status</b></summary>
    

    
  ![Table of `order_status` and accompanying `total_missing_order_ids`](https://github.com/user-attachments/assets/0b60c65c-0087-45a2-85ef-ddd7babb03d4)

  - As you can see, there are 769 total missing `order_id`s now, the majority of which contain the status `unavailable`.
    
</details>


### Step 2: Verify Total Missing `order_id`s

To confirm that this total was accurate, I compared the distinct order_id counts between `Orders_Final` and `Order_Items_Final`:

<details>
<summary>📂<b><i>Query to Verify Number of Missing ids</i></b></summary>
    
```sql
/* 
  This query finds the distinct number of order_ids from Orders_Final and Order_Items_Final to confirm the number of 
  missing order_ids is indeed 769.
*/

SELECT 
    (SELECT COUNT(DISTINCT order_id) FROM iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Orders_Final) AS distinct_order_ids_orders,
    (SELECT COUNT(DISTINCT order_id) FROM iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Order_Items_Final) AS distinct_order_ids_order_items;

```
    
</details>


<details>
<summary>📋<b><i>Table 2: Distinct order_id Counts in Orders_Final and Order_Items_Final</i></b></summary>    

![Table of distinct `order_id` counts for each table](https://github.com/user-attachments/assets/9ba44665-2e96-48b8-b58a-aac4d3cef882)

  - Subtracting the two totals confirms the 769 number that was calculated before.
 

</details>

- *Note: The [`Orders_Final`](Orders_Final/steps.md) and [`Order_Items_Final`](Order_Items_Final/steps.md) creation steps can be found in their respective steps.md files.*



### Step 3: Created `Recalculated_Missing_Orders` Table

To isolate the actual missing order_ids, I created a table called `Recalculated_Missing_Orders`:

<details>
<summary>📂<b><i>Query to create Recalculated_Missing_Orders</i></b></summary>

```sql
/*
  This query creates a new table, Recalculated_Missing_Orders, containing order_ids that appear in Orders_Final
  but are missing in Order_Items_Final. The LEFT JOIN includes all order_ids from Orders_Final, and the WHERE clause
  filters specifically for those missing in Order_Items_Final (where oi.order_id is NULL).
*/

CREATE TABLE 
  iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Recalculated_Missing_Orders AS
SELECT 
  o.order_id, o.order_status
FROM 
  iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Orders_Final o
LEFT JOIN 
  iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Order_Items_Final oi 
ON 
  o.order_id = oi.order_id
WHERE 
  oi.order_id IS NULL;
```
    
</details>



### Step 4: Verify Equal Distinct `order_id`s

After creating the final versions of `Orders_Final` and `Order_Items_Final`, I wanted to ensure that all missing or discrepant `order_id`s were properly excluded and that the number of distinct `order_id`s matched between the `Orders_Final` and `Order_Items_Final` tables.

<details>
<summary>📂<b><i>Query to Verify Successful Removal of Missing ids</b></i></summary>
    
```sql
SELECT 
    (SELECT COUNT(DISTINCT order_id) FROM iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Orders_Final) AS distinct_order_ids_orders,
    (SELECT COUNT(DISTINCT order_id) FROM iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Order_Items_Final) AS distinct_order_ids_order_items;
```
    
</details>

<details>
<summary>📋<b><i>Table 3: Equal Distinct order_id Counts between Orders_Final and Order_Items_Final</i></b></summary>

![Table of distinct `order_id` counts for each table](https://github.com/user-attachments/assets/f52e6e7f-264d-406a-9323-aadfb31fd66e)

- When the query confirmed equal counts for both tables, I knew the cleaning steps had been effective.    

</details>




*Note: One `order_id` was also missing in the `Payments_Final` table. The steps taken to identify and resolve this discrepancy are detailed in [Payments_Final steps.md](./Payments_Final/steps.md).*

</details>

---

## Conclusion

By recalculating missing and discrepant `order_id`s, I refined the consistency between `Orders_Final`, `Order_Items_Final`, and `Payments_Final`, ensuring that all relevant `order_id`s were accounted for. Initially, missing `order_id`s posed a risk of revenue discrepancies, particularly for orders with "unavailable" or "canceled" statuses. After identifying and excluding these, I verified the updated total of **769 missing `order_id`s**.

In addition to addressing missing `order_id`s, I resolved discrepancies in payment values between `Order_Items_Final` and `Payments_Final`. These discrepancies arose from mismatches between calculated payment values (`price` + `freight_value`) in `Order_Items_Final` and the entered values in `Payments_Final`. 

To ensure accurate revenue analysis:
1. I excluded `order_id`s with discrepancies of at least a penny.
2. I removed the `payment_type` and `payment_installments` columns from `Payments_Final`, eliminating unnecessary duplicates caused by these fields.
3. I reinserted a missing `order_id`, as detailed in the steps documented in [Payments_Final steps.md](./Payments_Final/steps.md).

These changes resulted in a cleaner and more consistent `Payments_Final` table that aligns with `Order_Items_Final` and `Orders_Final`.

This recalculation process—addressing both missing and discrepant `order_id`s—strengthened data integrity and minimized revenue discrepancies. The removal of these `order_id`s, as documented in the `Recalculated_Missing_Orders` and `Recalculated_Discrepant_Orders` tables, provides a solid foundation for downstream analysis. Key metrics, such as total revenue and profitability across product categories and customer regions, are now more reliable, ensuring meaningful and accurate insights.




---
