# Overview of Payment Changes

In my initial cleaning, I removed the `payment_sequential` column and summed all `payment_value` entries into `total_payment_value`. This reduced duplicates in the `Payments` table and resulted in the creation of the `Payments_Cleaned` table.

Upon further analysis, I identified additional issues:
- **Duplicates**: The `payment_type` and `payment_installments` columns added **1,123** and **866** duplicate entries respectively.
- **Missing `order_id`**: One `order_id` present in `Orders_Final` and `Order_Items_Final` was absent from `Payments_Final`.

To resolve these, I:
1. Removed `payment_type` and `payment_installments`, further reducing duplicates.
2. Applied filter logic to remove invalid `order_id`s identified in `Recalculated_Missing_Orders` and `Recalculated_Discrepant_Orders`.
3. Reinserted the missing `order_id`, bringing `Payments_Final` to the correct total of **98,715 entries**, fully aligning with `Orders_Final`.

The iterative cleaning process ensured `Payments_Final` is consistent with `Orders_Final` and free of duplicate or invalid entries.

---

### Assumptions for Inserting Missing `order_id`

1. **All `order_id`s Should Have Payments**  
   - I assumed every `order_id` in `Order_Items_Final` should have a matching entry in `Payments_Final`, as payments logically follow valid orders.

2. **Missing Data Over Invalid Data**  
   - The absence of this `order_id` in `Payments_Final` was treated as missing data, not an invalid or canceled order, because it appeared in both `Orders_Final` (with a `delivered` status) and `Order_Items_Final`.

3. **Validated by Calculation**  
   - I calculated the expected payment value (`price` + `freight_value`) for the missing `order_id`, reinforcing its validity.

4. **Isolated Anomaly**  
   - I treated this as an isolated issue requiring individual correction, rather than a systemic problem with missing or invalid `order_id`s.

---


[Click here](./steps.md) to read the detailed steps on the creation of `Payments_Final`.




