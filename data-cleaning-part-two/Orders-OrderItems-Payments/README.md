# Orders_Final, Order_Items_Final, and Payments_Final Overview

These three tables are connected via `order_id`s. The `Order_Items_Final` table contains two columns, `price` and `freight_value`, which should combine to equal the `total_payment_value` in `Payments_Final`. However, during the initial phase of my analysis, I identified discrepancies in these calculations and decided to remove them.

With the increased number of verified `customer_id`s and validated locations since that initial phase, I decided to recalculate the discrepancy function. Additionally, I removed the `payment_type` column from `Payments_Final`, which had been creating duplicate `order_id`s.
  - *Note: This was likely the cause of discrepancies in my initial calculations, leading to this iterative cleaning process.*

## `Recalculated_Discrepant_Orders` Table

To generate an updated list of `order_id`s with discrepancies between expected total payment values and calculated total order values, I created two temporary tables and joined them. The query I used included `AND ABS(c.calculated_order_value - p.total_payment_value) >= 0.01` to ensure that only `order_id`s with discrepancies of at least a penny were flagged. Using `ROUND(SUM(...), 3)` helped remove some small discrepancies, but minor discrepancies still appeared due to precision limitations.


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
        ROUND(SUM(price + freight_value),3) AS calculated_order_value
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
