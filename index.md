---
layout: default
title: Home
---


A repository that contains documentation of my various analysis steps for this portfolio project.

## Important Note
Please note that this project is a W.I.P. With that in mind, sections may not be fully filled out or are subject to change. Currently I am in the EDA phase working within Power BI. I am analyzing frequency distributions and employing toggle tables for easy customization of metrics in my visuals. This cuts down on the amount of report pages that are necessary. Thank you for your patience and feel free to email me any questions!

## Project Overview
- **Objective**: The goal of this project is to explore Revenue trends in E-commerce sales data from Target in Brazil.
- **Guiding Questions**: There are three questions guiding my analysis
  - **1.** Which product categories contribute the most to overall revenue, and how does profitability vary across standardized categories?
  - **2.** How does the average order value and profitability vary by standardized product category and seller over time?
  - **3.** How does average sales revenue vary across states, and are there any notable regional patterns or correlations?
- **Dataset Information**: The dataset was pulled from Kaggle and includes a time range from 2016-2018. There are seven related tables in the dataset with key attributes including the following
    - **customer_id**: ID of the consumer who made the purchase
    - **customer_unique_id**: Unique ID of the consumer
    - **order_id**: A Unique ID of order made by the consumers
    - **order_item_id**: A Unique ID given to each item ordered in the order
    - **product_id**: A Unique ID given to each product available on the site
    - **seller_id**: Unique ID of the seller registered in Target
## Data Preparation and Cleaning
To ensure accuracy and consistency, detailed cleaning processes were conducted for each dataset. These processes are documented in two separate folders to reflect the iterative nature of the cleaning efforts:
1. [Data Cleaning (Part One)](./data-cleaning): This folder documents the initial cleaning steps taken to prepare the dataset for analysis. While this stage identified and addressed many key issues, it also revealed additional complexities in the dataset during subsequent analysis. The insights and challenges from this stage informed the next round of cleaning.
2. [Data Cleaning (Part Two)](./data-cleaning-part-two): This folder builds on the foundation of Part One and documents the extensive iterative cleaning required to address the newly identified issues. With the inclusion of more cities and states, all prior steps had to be revisited and updated to reflect the expanded scope and refined accuracy of the dataset.

While the first folder provides valuable context for the iterative cleaning process, the second folder contains the finalized, comprehensive cleaning steps that formed the basis for the final analysis.


~### Cleaning Processes~
~- **Geolocation Cleaning**~
  ~- Folder: `data-cleaning/geolocation-cleaning`~
 ~ - **Objective**: Resolve ambiguous city-state entries and filter down to the four most populated states~
  ~- **Steps**:~
      ~- Removed duplicate zip codes, normalized state names, and filtered city entries to only those in the four most populated states.~
      ~- Employed GeoNames API to validate city-state combinations.~
      ~- Finalized a clean city-state table with only verified entries.~
  ~- **Documentation**: See [`geolocation-cleaning`](./data-cleaning/geolocation-cleaning) for more details.~
~- **Orders and Order Items Cleaning**~
  ~- Folder: `data-cleaning/order-item-cleaning`~
  ~- **Objective**: Ensure data consistency between Orders and Order Items tables for accurate revenue analysis.~
  ~- **Steps**:~
     ~- Identified and resolved missing `order_ids` by analyzing ‘canceled’ and ‘unavailable’ statuses.~
     ~- Merged `Canceled Orders Missing Items`, `Unavailable Orders Missing Items`, and `Orders with Unknown Status Details` tables to create a unified dataset.~
     ~- Validated total revenue calculations by excluding orders from the compiled table.~
  ~- **Documentation**: See [`order-item-cleaning`](./data-cleaning/order-item-cleaning) for more details~
  ### Standardization
  - **Folder**: `data-preparation/standardization`
  - **Objective**: Standize column names and data formats for consistent querying
  - **Steps**:
    - Renamed columns to follow consistent naming conventions (e.g., changed `product category` to `product_category`) for easier querying and readability.
    - Removed filters for validated city-state combinations in the `Sellers` table to include all sellers with orders from customers in the target states, regardless of the seller’s own location.
    - Documented mappings and name changes for reference in [`standardization`](./data-preparation/standardization).

 ~- **Steps**: Imported seven CSV files into Google BigQuery and connected via DirectQuery and Import to Power BI.~
 ~- **Cleaning**: Conducted quality checks, removed irrelevant columns, and ensured data consistency~

 
