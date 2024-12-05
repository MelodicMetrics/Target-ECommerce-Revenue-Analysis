# Steps to Create Products_Final

### Step 1: Identify Issues with `product_category`

Realizing the numerous issues with category naming conventions in the `Products` table, I wrote a SQL query to extract all distinct `product_category` names for review:

<details>
<summary>📂<b><i>Query to Select all Distinct Product Category Names</i></b></summary>

```sql
SELECT DISTINCT
  product_category
FROM
  iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Products
ORDER BY
  product_category
```  

- This gave me 74 different `product_category` names.

</details>

### Step 2: Generate and Review Cleaned Names

- I imported the extracted list into Excel and used ChatGPT to generate an initial list of cleaned category names based on the original values.
- The cleaned names were reviewed and adjusted manually to ensure accuracy and relevance to the dataset.
  - **Example Adjustments**:
      - `"CITTE AND UPHACK FURNITURE"` → `"Miscellaneous Furniture"`
      - `"Electrices 2"` →  `"Electrical Products"`
- The finalized list of original and standardized names were saved as a `.csv` file and uploaded to Google BigQuery as `Product_Category_Mappings`. The `.csv` file can be [downloaded here](https://github.com/user-attachments/files/17782746/Product_Category_mappings.csv)


### Step 3: Create `Products_Final`

With the `Product_Category_Mappings` table in place, I created the `Products_Final` table by joining `Products` with `Product_Category_Mappings` using a `LEFT JOIN` and handling any missing product_category values with `COALESCE`.

<details>
<summary>📂<b><i>Query to Create Products_Final</i></b></summary>

```sql
/* This query was to clean the Products table. The category names had numerous issues such as 
    inconsistent case, translation inconsistency, as well as confusing category naming. I did the following steps
        1. I created a .csv file with standardized category names. NOTE: In the case of "Miscellaneous Furniture"
        and "Electrical Products" the original names were unusual and are corrected as best guesses. Their original names were "Citte and Uphack Furniture"
        and "Electrices 2" respectively. 
        2. I uploaded the table to BigQuery and joined it with the Products table. The COALESCE function is there to handle any "null" values in product_category
        Where there are any nulls, they are referred to as "Uncategorizd".
*/
CREATE OR REPLACE TABLE `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Products_Final` AS
SELECT 
    p.product_id,
    COALESCE(m.product_category_cleaned, 'Uncategorized') AS product_category,   
FROM 
    `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Products` AS p
LEFT JOIN 
    `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Product_Category_Mappings` AS m
ON 
    p.product_category = m.product_category
```  

#### Importance of `LEFT JOIN` and `COALESCE`
- **`LEFT JOIN`**:
  - Ensures that all `product_ids` from `Products` appear in `Products_Final`, even if no matching `product_category` exists in the mapping table.
  - This accounts for `product_ids` in the `Products` table with `NULL` values for `product_category`.
- **`COALESCE`**:
  - Replaces any `NULL` values in product_category with `"Uncategorized"`.
  - Ensures that every `product_id` in `Products_Final` has an associated `product_category`.

</details>
 
### Final Outcome
The resulting `Products_Final` table:
- Standardizes all product_category names based on the `Product_Category_Mappings` table.
- Accounts for missing categories by assigning them the default value `"Uncategorized"`.
- Maintains all product_ids from the original `Products` table, ensuring data completeness.
