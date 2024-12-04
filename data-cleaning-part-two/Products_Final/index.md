# Overview of Products Changes

In my initial cleaning and analysis, I identified several issues with the `product_category` column, including:
- **Inconsistent Case**: Categories were in a mix of lowercase, uppercase, and title case (e.g., `babies`, `HEALTH BEAUTY`, `Construction Tools Garden`).
- **Translation Inconsistencies**: Some categories were in Spanish, while others were in English (e.g., `Agro Industria e Comercio`).
- **Confusing Naming**: Certain categories had unclear or ambiguous names, requiring best-guess corrections (e.g., `CITTE AND UPHACK FURNITURE`).
- **Missing Categories**: Some `product_id`s in the `Products` table had no associated `product_category`, resulting in `NULL` values.

To address these issues, I created a standardized mapping file (`Product_Category_Mappings.csv`) and uploaded it to Google BigQuery. Using this mapping table, I applied the following steps:

1. **LEFT JOIN**:  
   - Joined the `Products` table with `Product_Category_Mappings` to standardize category names wherever possible.
   - This ensured all rows from `Products` were included, even if no matching entry existed in the mapping table.  

2. **COALESCE for Missing Categories**:  
   - Replaced `NULL` values in `product_category` (from rows with no category entries) with a default value of `Uncategorized`.  
   - This ensured every product in `Products_Final` had a valid category.

These changes resulted in a clean and consistent `Products_Final` table, with all `product_category` entries standardized or assigned a default value.


[Click here](./steps.md) to read the detailed steps on the creation of `Products_Final`.

