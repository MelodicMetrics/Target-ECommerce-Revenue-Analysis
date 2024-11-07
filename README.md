# Target-ECommerce-Revenue-Analysis
A repository that contains documentation of my various analysis steps for this portfolio project.

## Project Overview
- **Objective**: The goal of this project is to explore Revenue trends in E-commerce sales data from Target in Brazil.
- **Guiding Questions**: There are three questions guiding my analysis
  - **1.** Which product categories contribute the most to overall revenue, and how does profitability vary across categories?
  - **2.** How does the average order value and profitability vary by product category, seller, and region over time?
  - **3.** How does average sales revenue vary across the four most populated states, and are there any notable regional patterns or correlations?
- **Dataset Information**: The dataset was pulled from Kaggle and includes a time range from 2016-2018. There are seven related tables in the dataset with key attributes including the following
    - **customer_id**: ID of the consumer who made the purchase
    - **customer_unique_id**: Unique ID of the consumer
    - **order_id**: A Unique ID of order made by the consumers
    - **order_item_id**: A Unique ID given to each item ordered in the order
    - **product_id**: A Unique ID given to each product available on the site
    - **seller_id**: Unique ID of the seller registered in Target
## Data Preparation and Cleaning
 - **Steps**: Imported seven CSV files into Google BigQuery and connected via DirectQuery and Import to Power BI.
 - **Cleaning**: Conducted quality checks, removed irrelevant columns, and ensured data consistency
 - **Standardization**: Renamed columns to follow consistent naming conventions (e.g., changed `product category` to `product_category`) for easier querying and readability
