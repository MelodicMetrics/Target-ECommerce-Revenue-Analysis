# Overview

This document holds all the dax revenue measures used in the creation of the dashboards in my EDA. 

- **Note:** I renamed recalculate_total_order_value to product_value. But it still created by adding `price` and `freight_value` together.

## Revenue Measures

<details> 

<summary><b> 1. Total Product Revenue</b> </summary> 

``` dax
Total ProductRevenue = 
IF(
    ISBLANK(SUM(Order_Items_Final[product_value])),
    0,
    SUM(Order_Items_Final[product_value])
)

```
</details>

<details>
<summary><b> 2. Average Product Revenue </b></summary>

``` dax
Average Product Revenue = 
DIVIDE(
    SUM('Order_Items_Final'[product_value]),
    COUNTROWS('Order_Items_Final'),
    0
)
```

</details>

<details>
<summary><b> 3. Median Revenue </b></summary>

``` dax
Median Revenue = 
MEDIANX(
    'Order_Items_Final',
    'Order_Items_Final'[product_value]
)
```

</details>

<details>
<summary><b> 4. Weighted Average Revenue </b></summary>

``` dax
Weighted Average Revenue = 
DIVIDE(
    SUMX(
        'Order_Items_Final',  -- Iterates over each row in the Order_Items_Final table
        'Order_Items_Final'[product_value] * 'Order_Items_Final'[product_quantity]  -- Calculates the revenue for each product by multiplying its value with the quantity sold
    ),
    SUM('Order_Items_Final'[product_quantity]),  -- Sums up the total quantity across all rows to serve as the weight for the weighted average
    0  -- Handles division by zero to avoid errors, returning 0 if the denominator is zero
)

```

</details>

## Revenue Percentages

<details>
<summary><b> 1. Revenue Percentage </b></summary>

``` dax
Revenue Percentage = 
DIVIDE(
    [Total Product Revenue],
    CALCULATE(
        [Total Product Revenue],
        ALL(Order_Items_Final)
    ),
    0
)
```

</details>

<details>
<summary><b> 2. Revenue Percentage by Category </b></summary>

``` dax
Revenue Percentage by Category = 
DIVIDE(
    [Total Product Revenue],
    CALCULATE(
        [Total Product Revenue],
        REMOVEFILTERS('Order_Items_Final'),
        VALUES('Order_Items_Final'[Product Category])
    ),
    0
)
```

</details>


<details>
<summary><b> 3. Percentage of Revenue per Product Category </b></summary>

``` dax
Percentage of Revenue per Product Category = 
DIVIDE(
    [Total Product Revenue],
    CALCULATE(
        [Total Product Revenue],
        REMOVEFILTERS('Order_Items_Final'),  -- Removes all filters on the table
        VALUES('Category Rankings'[product_category])  -- Retains the filter for the current Product Category
    ),
    0
)
```

</details>


<details>
<summary><b> 4. Percentage of Revenue per Bin Range </b></summary>

``` dax
Percentage of Revenue per Bin Range = 
DIVIDE(
    [Total Product Revenue],
    CALCULATE(
        [Total Product Revenue],
        REMOVEFILTERS('Order_Items_Final'),  -- Removes all filters on the table
        VALUES('Order_Items_Final'[Product Value Bins])  -- Retains the filter for the current Bin Range
    ),
    0
)
```

</details>
