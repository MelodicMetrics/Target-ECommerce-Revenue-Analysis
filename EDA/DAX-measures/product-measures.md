# Overview

This document holds all the various product measures used in my EDA dashboards.

## Product Measures

<details> 

<summary><b> 1. Product Count </b> </summary> 

``` dax
Product Count = 
IF(
    ISBLANK(COUNT('Order_Items_Final'[product_id])),
    0,
    COUNTROWS('Order_Items_Final')
)
```
</details>

## Product Percentages

<details> 

<summary><b> 1. Product Count Percentage </b> </summary> 

``` dax
Product Count (%) = 
DIVIDE(
    [Product Count],
    CALCULATE(
        [Product Count],
        ALL('Order_Items_Final')
    ),
    0
)
```
</details>


<details> 

<summary><b> 2. Product Count Percentage per Category </b> </summary> 

``` dax
Product Count (%) per Category = 
DIVIDE(
    [Product Count],
    CALCULATE(
       [Product Count],
        REMOVEFILTERS('Order_Items_Final'),
        VALUES('Order_Items_Final'[Product Category])
    ),
    0
)
```
</details>


## Calculated Columns

<details> 

<summary><b> 1. Product Quantity </b> </summary> 

- This column is used in the `Weighted Average Revenue` calculation to account for each product's contribution to the total revenue, based on its quantity sold.
- `Product Quantity` ensures that the revenue calculation is weighted correctly by the number of items sold for each product, allowing for a more accurate representation of the data.

``` dax
product_quantity = 
CALCULATE(
    COUNT('Order_Items_Final'[order_id]),  -- Counts the number of order IDs for the current product
    FILTER(
        'Order_Items_Final',  -- Applies a filter to the Order_Items_Final table
        'Order_Items_Final'[product_id] = EARLIER('Order_Items_Final'[product_id])  -- Keeps only rows where the product_id matches the product_id in the current row context
    )
)
```
</details>

## Category Rankings

This calculated table ranks product categories by their total revenue. It serves the following purposes:

- **Easier Sorting**: Provides a default ranking of product categories based on their revenue, making it simpler to sort categories in visualizations.
- **Improved Visualization Logic**: Ensures that visualizations, which might otherwise default to alphabetical sorting by product category, are sorted by revenue instead.
- **Slicer Integration**: Supports slicers such as "Top 21 Categories" by ensuring they are default-sorted according to the revenue-based ranking.
- **Streamlined Reporting**: Allows for consistent sorting logic across all analyses and dashboards, reducing the need for additional sorting measures.

<details> 

<summary><b> 1. Table Dax Query </b> </summary> 

```dax
Category Rankings = 
ADDCOLUMNS(
    DISTINCT('Products_Final'[product_category]), -- Create a table of unique categories
    "Total Revenue", 
        [Total Product Revenue],
    "Revenue Rank", 
        RANKX(
            ALL('Products_Final'[product_category]),
            [Total Product Revenue],
            ,
            DESC
        )
)
```

</details>

