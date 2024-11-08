# Overview of Steps to Clean Discrepancies Between Orders and Order Items Tables

**Overview:**  
This document summarizes the steps taken to identify and resolve discrepancies between the `Orders` and `Order Items` tables, focusing on missing `order_ids` and ensuring accurate revenue calculations. After cleaning the geolocation table to concentrate on the four most populated states, the next step was to create revenue calculations for the `Customers` and `Products` tables. Upon their creation, I noticed that the measures were not returning the same values, prompting an investigation into the `order_ids` in my `Orders` and `Order Items` tables. In doing so, I discovered that there were fewer `order_ids` in the `Order Items` table, indicating missing entries. I created a separate table to identify all `order_ids` that were not present in my `Order Items` table and found **775 missing IDs**. Further investigation revealed that orders with statuses like **"canceled"** or **"unavailable"** were occasionally absent from the `Order Items` table. I created tables named **`Canceled Orders Final`** and **`Unavailable Orders Final`** and summed the rows for each, resulting in **767** out of the **775 rows** accounted for. To discover the status of the remaining **8 `order_ids`**, I created a table to display all **missing `order_ids`** from the `Order Items` table with statuses that were neither **"canceled"** nor **"unavailable,"** naming it **`Orders with Unknown Status`**. I then related that table to my `Orders` table to pull the actual statuses of each `order_id` into a secondary table named **`Orders with Unknown Status Details`**. Finally, I merged the **`Canceled Orders Final`**, **`Unavailable Orders Final`**, and **`Unknown Status Details`** tables into one comprehensive table called **`Compiled Order Status Summary`**. This final table contained all **755 missing `order_ids`**. After this, I edited the **Total Revenue for ALL Orders** and **Total Revenue per Category** measures to exclude the `order_ids` from the **`Compiled Order Status Summary`** table. This adjustment resulted in new revenue measures that matched across product categories and overall customer order filter logic.

- **Geolocation Table Cleaning**:
  - Focused on the four most populated states, resulting in **150 cities**.
  - Acknowledged that this yield may not fully represent the overall geography due to constraints of a free GeoNames membership and data entry errors.

- **Total Revenue Calculation**:
  - Created a measure for **Total Revenue of All Orders**.

- **Revenue by Product Categories**:
  - Developed a measure to calculate total revenue while applying filter logic specifically for product categories.
  - Discovered that the total revenue by category was lower than the overall total revenue of all orders.

- **Identifying Order ID Discrepancies**:
  - Investigated discrepancies between the unique and distinct `order_ids` in the `Orders` and `Order Items` tables.
  - Found that the `Orders` table had more unique and distinct entries than the `Order Items` table.

- **Missing Order IDs Analysis**:
  - Created a table to identify all `order_ids` not present in the `Order Items` table, resulting in **775 missing IDs**.
  - Identified certain `order_ids` with statuses **"canceled"** and **"unavailable"** that were not present in the `Order Items` table.
  - Analyzed missing IDs and found that **767 rows** were missing entries with **"canceled"** or **"unavailable"** statuses, leaving **8 `order_ids`** unaccounted for.

- **Finalizing the Missing Order IDs**:
  - Created a function to display all `order_ids` with statuses that were neither **"Canceled"** nor **"Unavailable."**
  - Related the **Orders with Unknown Status** table to the `Orders` table on `order_id`, resulting in a new table that included the `order_ids` and their statuses.
  - Merged the **Canceled Orders**, **Unavailable Orders**, and **Orders with Unknown Status** into one comprehensive table containing all **755 missing `order_ids`**.

- **Adjusting the Total Revenue Measure**:
  - Edited the **Total Revenue for All Orders** measure to exclude the `order_ids` from the **`Compiled Order Status Summary`** table.
  - This adjustment resulted in a total revenue figure that now matched across both the "by category" and "overall orders" measures.

- **Additional Considerations**:
  - Emphasized the importance of maintaining data quality by ensuring all relevant `order_ids` were accounted for and accurately reflected in the analyses.
  - Suggested future improvements to develop a more robust methodology for addressing data entry errors and enhancing data validation processes.

