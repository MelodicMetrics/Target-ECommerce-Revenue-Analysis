# Summary of Steps Taken: Resolving Missing order_ids and Ensuring Revenue Consistency in Orders and Order Items Tables

**Objective:** To identify and resolve discrepancies in the total revenue calculations between the Orders and Order Items tables due to missing order_ids, ensuring data integrity for accurate reporting.

## Overview:
During the data cleaning process, I identified **577** `order_ids` *where the calculated revenue* (``price`` + ``freight_value`` in `Order Items`) did not align with the expected `total_payment_value` in the `Payments` table. These discrepancies were minor, with a net difference of **2,726.93**. Additionally, only **276 of these** `order_ids` were present in the `Order Items` table. Earlier, I identified the discrepant `order_ids` between the `Orders` and `Order Items` tables, which was potentially responsible for the difference in counts, as the remaining `order_ids` had discrepancies recorded only in `Orders` or `Payments`. However, given the complexities of the dataset and the limitations of my tools as an independent analyst, I did not have sufficient context or capacity to uncover the source of these discrepancies with any certainty. Therefore, I ultimately decided to remove the `order_id`'s from my analysis.

## Recap of Steps Taken in Identifying Missing order_ids:
- Discovered that there were **775 missing order_ids** in the Order Items table.
- Adjusted the total revenue function to **ignore these missing order_ids** in revenue calculations.

## Analysis of Revenue Discrepancies:
- Noted discrepancies in total revenue calculations: fewer order_ids resulted in a **higher revenue calculation** than expected.
- Created a comparison table, **Order Revenue Comparison**, to evaluate total revenue per order_id by summing the **price** and **freight_value** for each entry.
- Compared the calculated revenue against the actual **expected_payment_value** to identify discrepancies.

## Identification of Discrepant order_ids:
- Implemented a calculated column named **'difference_flag'** to capture discrepancy amounts for each order_id.
- Filtered the dataset to display only **non-zero values**, identifying **577 entries** with discrepancies.

## Calculation of Total Discrepancy:
- Developed functions, **`Total_Discrepant_Revenue_Order_Items`** and **`Total_Discrepant_Revenue_Payments`**, to quantify the total discrepancy across all identified order_ids.
- Noted that the total discrepancy was **$2,726.93**, which was relatively minor, justifying the decision to exclude these problematic `order_ids` from analysis.

## Final Adjustments:
- Created three new functions for revenue analysis focused on:
  - **Customer_ids**
  - **Product Categories**
  - **Sellers**
- Enhanced existing measures to include filter logic that excludes the identified problematic order_ids to ensure accurate revenue calculations moving forward.

## Impact of Findings:
The identification of these discrepancies underscores the importance of rigorous data cleaning and validation processes, directly influencing the reliability of the revenue analysis. Ultimately, the final revenue calculation that matched across all tables was **$2,750,971.13**.

## Future Recommendations:
Considerations for future analyses may include implementing more robust methodologies for data entry verification and continuous monitoring of data integrity to prevent similar discrepancies.
