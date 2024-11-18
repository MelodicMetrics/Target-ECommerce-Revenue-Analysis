# Steps to Create `Order_Items_Final`

To ensure that only `seller_ids` attached to verified customer orders appeared in `Order_Items_Final`, I used a `JOIN` with `Orders_Final` rather than `Sellers_Final`. 

Beyond this, there weren’t many additional steps required. All filter logic applied to `Orders_Final` was automatically inherited by `Order_Items_Final`, since it was created using a `JOIN` with `Orders_Final`.

### SQL Query
The following query outlines the creation process for `Order_Items_Final`:

<details>
<summary>📂<b><i>Query to Create Order_Items_Final</i></b></summary>
  
```sql
/*
  This query creates the Order_Items_Final table with the following considerations:
  
  1. There was no need to include additional filter logic for either missing or discrepant `order_ids`:
     - Missing `order_ids` were inherently excluded, as they were already absent from the Order_Items table.
     - Discrepant `order_ids` were also excluded automatically, since this table is created by joining on `order_id` 
       from Orders_Final, which has already filtered out discrepant orders.
  
  2. Initially, I considered joining this table with the Sellers_Final table. However, doing so 
     would have introduced `order_ids` linked to sellers, regardless of whether the orders were made 
     by customers from valid city-state combinations. 

     By joining on `order_id` instead, I ensured that only orders made by filtered customers were included. 
     While this approach may still include `seller_ids` from unverified city-state combinations, this is 
     acceptable as the analysis does not focus on seller locations.
*/

CREATE OR REPLACE TABLE `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Order_Items_Final` AS 
SELECT 
    order_items.order_id,
    order_items.order_item_id,
    order_items.product_id,
    order_items.seller_id,
    order_items.price,
    order_items.freight_value
FROM 
    `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Order Items` AS order_items
JOIN 
    `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Orders_Final` AS orders
ON 
    order_items.order_id = orders.order_id
```
  
</details>



## Removed Columns from Original Table

| Column Name           | Reason for Removal                      |
------------------------|-----------------------------------------|
| `shipping_limit_date` | 	Not relevant to the analysis goals; delivery timestamps were sufficient. |

