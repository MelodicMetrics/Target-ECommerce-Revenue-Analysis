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
---
