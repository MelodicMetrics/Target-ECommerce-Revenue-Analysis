# Overview of Steps to Clean Discrepancies Between Orders and Order Items Tables

## Geolocation Table Cleaning
After attempting to clean the geolocation data, I concluded that it would be most effective to focus on the four most populated states. This resulted in a total of **150 cities** across these states. While this yield may not fully represent the overall geography due to constraints of a free GeoNames membership and data entry errors, it was the best approach given the circumstances.

## Total Revenue Calculation
I created a measure for **Total Revenue of All Orders**, which returned approximately **$2,734,768.61**. This measure provided a baseline for evaluating overall revenue contributions.

## Revenue by Product Categories
Next, I developed a measure to calculate total revenue while applying filter logic specifically for product categories. However, after analyzing the totals per category, I discovered that the total revenue by category was lower than the overall total revenue of all orders.

## Identifying Order ID Discrepancies
I investigated the discrepancies between the unique and distinct `order_ids` in the Orders and Order Items tables. While both tables showed the same number of unique and distinct `order_ids`, the Order Items table had fewer entries. This indicated that some `order_ids` in the Orders table were missing corresponding entries in the Order Items table.

## Missing Order IDs Analysis
Upon rechecking the Kaggle dataset, I found that certain `order_ids` with the statuses **"canceled"** and **"unavailable"** were not appearing in the Order Items table. First, I created a table to identify all `order_ids` not present in the Order Items table, resulting in **775 missing IDs**. I then analyzed the missing IDs based on their statuses and found that **767 rows** were missing entries with **"Canceled"** or **"Unavailable"** statuses. This left me with **8 order_ids** unaccounted for.

## Finalizing the Missing Order IDs
To identify the status of the last 8 `order_ids`, I created a function to display all `order_ids` with statuses that were neither **"Canceled"** nor **"Unavailable"**. After relating my Orders with Unknown Status table to the Orders table on `order_id`, I created a new table that included the `order_ids` and their respective statuses. I merged all three tables (**Canceled Orders**, **Unavailable Orders**, and **Orders with Unknown Status**) into one comprehensive table containing all **755 missing order_ids**.

## Adjusting the Total Revenue Measure
Finally, I edited my **Total Revenue for All Orders** measure to exclude the `order_ids` from the compiled missing orders status table. This adjustment resulted in a total revenue figure that now matches across both the by category and overall orders measures.

## Additional Considerations
- **Data Quality**: Throughout the process, I emphasized maintaining data integrity by ensuring all relevant `order_ids` were accounted for and accurately reflected in the analyses.
- **Future Improvements**: Considerations for future data cleaning efforts may include developing a more robust methodology for addressing data entry errors and enhancing data validation processes.
