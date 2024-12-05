# Product Value Bins

## Purpose
The Product Value Bins were added as calculated columns in `Order_Items_Final` and served the following purpose:
- **Segmentation**: Categorizes products into predefined ranges (bins) based on their value.
- **Sorting**: Adds a numeric sort order to ensure that bins are displayed in the intended sequence.

## DAX Codes
<details> 

<summary><b> 1. Product Value Bins </b> </summary> 

<br>

- **Purpose**: Categorizes products into value ranges (`$7.28–$100`, `$100–$250`, `$250–$500`, `$500–$700`, and `$700+`) for easier analysis and visualization.
- **Application:** Supports trend analysis and comparisons across predefined value brackets.
- **Logic:** Uses `SWITCH` to assign products to bins dynamically based on their `product_value`. 

``` dax
Product Value Bins = 
SWITCH(
    TRUE(),
    'Order_Items_Final'[product_value] <= 100, "$7.28–$100",
    'Order_Items_Final'[product_value] <= 250, "$100–$250",
    'Order_Items_Final'[product_value] <= 500, "$250–$500",
    'Order_Items_Final'[product_value] <= 700, "$500–$700",
    "$700+"
)
```
</details>

<details> 

<summary><b> 2. Bin Sort Order </b> </summary> 

<br>

- **Purpose**: Assigns a numeric sort order to product value bins for consistent ordering in visualizations. 
- **Application**: `Product Value Bins` is intended to specifically be sorted by this column. This ensures bins appear sequentially (`$7.28–$100` as 1, `$100–$250` as 2, etc.) rather than alphabetically.
- **Logic**: Uses `SWITCH` to assign integers (1 to 5) based on product value ranges.

``` dax
Bin Sort Order = 
SWITCH(
    TRUE(),
    'Order_Items_Final'[product_value] <= 100, 1,
    'Order_Items_Final'[product_value] <= 250, 2,
    'Order_Items_Final'[product_value] <= 500, 3,
    'Order_Items_Final'[product_value] <= 700, 4,
    5 -- For values greater than 700
)
```
</details>

