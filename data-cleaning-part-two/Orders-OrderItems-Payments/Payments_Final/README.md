# Overview of Payment Changes

In my initial cleaning and analysis, I introduced the step of summing all `payment_value` entries as `total_payment_value`. This decision was driven by the removal of the `payment_sequential` column, which denoted instances where customers paid for their order at one time through multiple payments. 

### Initial Cleaning
The `payment_sequential` column created duplicates in `order_id` based on the number of sequential payments a customer made, each with varying `payment_value`s.
By removing `payment_sequential`, I grouped `order_id`s together based on a sum of all `payment_value`s, resulting in the creation of the `Payments_Cleaned` table.

### Iterative Cleaning
Upon further analysis, I identified additional issues in the `Payments_Cleaned` table:

1. **`payment_type` Duplicates**:
   - The `payment_type` column denoted the payment method used per `order_id`.
   - Although removing `payment_sequential` reduced duplicates, it did not address cases where the same `order_id` appeared with two distinct `payment_type`s (e.g., `voucher` and `credit card`).
   - Specifically, **2,246 `order_id`s** with two `payment_type`s caused **1,123 duplicate entries**.

2. **`payment_installments` Duplicates**:
   - The `payment_installments` column represented the number of installments used to pay for an order.
   - `order_id`s with multiple installments appeared multiple times, contributing **866 duplicate entries**.

### Entry Counts After Each Cleaning Step

1. **Original `Payments` Table**:  
   - **103,866** entries.
2. **After Removing `payment_sequential`**:  
   - Reduced to **101,836** entries.
3. **After Removing `payment_type` and `payment_installments`**:  
   - Removed **1,123** and **866** duplicates respectively (a total of **1,989**), bringing the count to **99,847** entries.

### Creation of `Payments_Final`

When creating the `Payments_Final` table, I applied a `JOIN` between `Payments_Cleaned` and `Orders_Final` to filter out invalid `order_id`s:
1. **Removed `order_id`s in `Recalculated_Missing_Orders`**:  
   - **769 entries**.
2. **Removed `order_id`s in `Recalculated_Discrepant_Orders`**:  
   - **363 entries**.
3. Mathematically, the total entry count for `Payments_Final` should have been:

   \[
   101,836 - (1,123 + 866 + 769 + 363) = 98,715
   \]

   However, the actual count in `Payments_Final` was **98,714**, indicating an unresolved discrepancy.

### Resolving a Missing `order_id`
After discovering this mismatch:
- I identified the `order_id` missing from `Payments_Final` by comparing it to `Orders_Final`.
- This `order_id` was present in both `Orders_Final` and `Order_Items_Final`, with valid `price` and `freight_value` data.
- Upon reinserting the missing `order_id` into `Payments_Final`, the table returned the correct total of **98,715 entries**, matching `Orders_Final`.

### Assumptions Made in Inserting Missing `order_id`

I made the decision to insert this `order_id` into the `Payments_Final` table so that my analysis would be consistent based the following assumptions:

**1. All `order_ids` in `Payments_Final` Should Correspond to `Order_Items_Final`**

- Every `order_id` in `Order_Items_Final` should have a matching entry in `Payments_Final` because `Payments` represents the payment data for all orders, and payments logically follow order creation.

**2. Discrepancies Indicate Missing Data, Not Invalid Data**

- The abscence of this `order_id` in `Payments_Final` was interpreted as an issue of missing data rather than invalid or canceled orders. This assumption was based on:
  - The `order_id` being present in `Order_Items_Final`, which confirmed that it was a valid order.
  - The `order_id` being present in `Orders_Final`, with accompanying status `delivered` confirming it was a completed order.

**3. Calculation Validates Inclusion**

- By calculating the expected payment value (`price` + `freight_value`) for the missing `order_id` based on data in `Order_Items_Final`, the assumption that this `order_id` should exist in `Payments_Final` was reinforced.

**4. The Missing `order_id` is an Anomaly**

- I assumed that the missing `order_id` was an outlier or anomaly in the data, rather than part of a broader pattern of missing/invalid `order_ids`. This justifies addressing it individually by inserting the calculated data.

---

### Summary
The iterative cleaning process significantly reduced duplicates and ensured full consistency between `Payments_Final` and `Orders_Final`. By addressing overlooked columns, applying proper filtering logic, and reinserting the missing `order_id`, the final table contains **98,715 entries**, aligning perfectly with `Orders_Final`.
