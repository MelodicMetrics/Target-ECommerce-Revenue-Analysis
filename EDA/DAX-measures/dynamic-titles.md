# Dynamic Titles Overview

This file contains the DAX measures used to create dynamic titles for various visualizations. These titles dynamically update based on user interactions, such as metric selection (`Selected Metric`) or category filters (`product_category`). This functionality enhances the dashboards by providing clear, context-specific titles for each visualization.


## Dax Queries

<details> 
<summary><b> 1. Drillthrough Product ID Table </b> </summary> 
<br>

**Purpose**: Updates the table title to reflect the filtered `Product Value Bin`. Defaults to "All Ranges" if no bin range is selected.

```dax
Drillthrough Product ID Table = 
"Details for Products in " & 
SELECTEDVALUE('Order_Items_Final'[Product Value Bins], "All Ranges")

```
</details>

<details> 
<summary><b> 2. Dynamic KPI Card Title 1 </b> </summary> 
<br>

**Purpose**: Updates the KPI card title based on the filtered `product_category`. Defaults to "All Categories" if no category is selected.

```dax
Dynamic KPI Card Title 1 = 
"Top Product ID in (" & 
IF(
    ISFILTERED('Category Rankings'[product_category]),
    CONCATENATEX(VALUES('Category Rankings'[product_category]), 'Category Rankings'[product_category], ", "),
    "All Categories"
) & ")"

```
</details>

<details> 
<summary><b> 3. Dynamic Metric Title </b> </summary> 
<br>

**Purpose**: Updates the title based on the selected metric and category filters. Defaults to "No Metric Selected" for metrics and "All Categories" for categories if no filters are applied.

```dax
Dynamic Metric Title = 
"Displaying: " & 
SELECTEDVALUE('Toggle Table'[Metric], "No Metric Selected") & 
" for " & 
IF(
    ISFILTERED('Category Rankings'[product_category]), 
    CONCATENATEX(VALUES('Category Rankings'[product_category]), 'Category Rankings'[product_category], ", "), 
    "All Categories"
)

```
</details>

<details> 
<summary><b> 4. Dynamic Metric Title by State </b> </summary> 
<br>

**Purpose**: Similar to `Dynamic Metric Title`, but specifies "by State for" in the title for state-level analysis.

```dax
Dynamic Metric Title by State = 
"Displaying: " & 
SELECTEDVALUE('Toggle Table'[Metric], "No Metric Selected") & 
" by State for " & 
IF(
    ISFILTERED('Category Rankings'[product_category]), 
    CONCATENATEX(VALUES('Category Rankings'[product_category]), 'Category Rankings'[product_category], ", "), 
    "All Categories"
)

```
</details>

<details> 
<summary><b> 5. Product Value by Category </b> </summary> 
<br>

**Purpose**: Updates the title based on the filtered `product_category`. Defaults to "All Categories" when no category is selected.

```dax
Product Value by Category = 
"Distribution of Product Values and Their Revenue Contribution (" &
IF(
    ISFILTERED('Category Rankings'[product_category]),
    CONCATENATEX(VALUES('Category Rankings'[product_category]), 'Category Rankings'[product_category], ", "),
    "All Categories"
) & ")"

```
</details>

<details> 
<summary><b> 6. Scatter Chart Title </b> </summary> 
<br>

**Purpose**: Dynamically updates the scatter chart title based on the metric selected in the slicer. Switches between totals and percentages for specific visualizations.

```dax
Scatter Chart Title = 
SWITCH(
    SELECTEDVALUE('Toggle Table'[Metric]),
    "Percentage of Revenue", "Total Revenue by Sellers",
    "Percentage of Total Products", "Total Products by Sellers"
)

```
</details>

<details> 
<summary><b> 7. Seller Ranking Table </b> </summary> 
<br>

**Purpose**: Updates the title based on the displayed rankings for `seller_ids`. Dynamically adjusts to changes in `Selected Metric` and `product_category`.

```dax
Seller Ranking Table = 
VAR SelectedMetric = 
    SWITCH(
        SELECTEDVALUE('Toggle Table'[Metric]),
        "Percentage of Revenue", "Revenue",
        "Percentage of Total Products", "Products Sold",
        "Metric"
    )

VAR SelectedCategories = 
    IF(
        ISFILTERED('Category Rankings'[product_category]),
        CONCATENATEX(
            VALUES('Category Rankings'[product_category]),
            'Category Rankings'[product_category],
            ", "
        ),
        "All Categories"
    )

RETURN 
    "Seller Rankings by " & SelectedMetric & " in " & SelectedCategories

```
</details>
