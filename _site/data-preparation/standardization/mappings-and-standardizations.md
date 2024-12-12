# Mappings and Standardizations Documentation
---
## 1. Geolocation Table Standardization
  - **City-State Mapping**: Created a reference list of valid city-state combination, restricted to the four most populated states (São Paulo, Rio de Janeiro, Minas Gerais, and Bahia).
  - **Invalid Entries**: Identified and excluded invalid city-state combinations to improve data accuracy.

## 2. City-State Combination for Customers and Sellers
  - **Filtered City-State Combinations**: Merged `customer_ids` and `seller_ids` with valid city-state combinations to ensure only entries from the four selected states and cities are included.

## 3. Product Category Standardization
  - **Capitalization**: Standardized all product category names to "Title Case" to ensure consistency.
  - **Rephrased Names**: Updated specific category names for clarity, e.g., "Watches Present" to a more user-friendly alternative.

## 4. Product Category Mappings Table
  - **Mapping Table Creation**: Created a `category mappings` table to standardize `product_category` names in the products table.
  - **Merge Issue Fix**: Resolved merge issues by mapping directly on the `product_category` column.

## 5. Order and Order Items Tables - Missing Order IDs 
  - **Missing Order Documentation**: Documented 775 missing `order_id`s by creating tables of statuses ("Canceled","Unavailable", and "Unknown") to accurately adjust revenue calculations.

## 6. Discrepancy Identification and Resolution
  - **Discrepancy Analysis**: Identified discrepancies between `order_id`s in the Orders and Order Items tables, finding 577 rows with revenue discrepancies.
  - **Exclusion Criteria**: Excluded 276 `order_id`s present in the Order Items table from revenue calculations to maintain data integrity.
  - **Impact on Revenue Calculations**: Adjustments resulted in a final total revenue figure of 2,750,971.13, reflecting accurate data processing.

## 7. Final Revenue Calculation
  - **Total Revenue Overview**: The final total revenue figure of 2,750,971.13 is now accurately calculated after resolving discrepancies.
  - **Measure Adjustments**: Revenue calculation measures were updated to exclude problematic `order_id`s, ensuring accurate financial insights.

## 8. Lessons Learned
  - **Importance of Data Validation**: Recognized the critical role of data validation in ensuring accurate analysis and insights.
  - **Documenting Methodologies**: Emphasized the need for thorough documentation of cleaning and standardization processes for clarity in future projects.
  - **Anticipating Issues**: Learned to anticipate potential discrepancies in data and develop strategies to address them proactively.
  - **Iterative Process of Data Cleaning**: Understood that data cleaning is an iterative process, often requiring multiple reviews of the original Kaggle dataset and Google BigQuery tables to identify and resolve new data issues that could impact analysis.

---
