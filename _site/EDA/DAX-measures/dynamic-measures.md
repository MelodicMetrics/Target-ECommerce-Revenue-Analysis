# Dynamic Measures Overview

This file contains measures that enhance dashboard interactivity by allowing users to dynamically switch metrics and update visualizations in real time. These measures leverage the `Toggle Table` to streamline calculations and improve the user experience.


## Selected Metric

<details> 

<summary><b> 1. Toggle Table </b> </summary> 
<br>

- This table contains a number of columns with names of various percentage measures that can be found in `revenue-measures-md.` and `product-measures.md`
- These columns are then referenced in `Selected Metric` to create dynamic switching of the displayed metric in the particular visualization.

The columns named in the toggle table are the following: 
- Percentage of Revenue
- Percentage of Revenue per Bin Range
- Percentage of Revenue per Category
- Percentage of Total Products
- Percentage of Total Products by Category and State
- Total Revenue
- Product Count

![Table Columns in Toggle Table](https://github.com/user-attachments/assets/e2126a3b-1fb7-4bcb-bd5c-fb40ef2ac6e6)

</details>


<details> 

<summary><b> 2. Selected Metric </b> </summary> 

<br>

- **Purpose**: In certain dashboards there is a slicer used with this measure. The slicer will dynamically calculate a metric based on the user's selection from the `Toggle Table`.

``` dax
Selected Metric = 
VAR Metrics =
    SWITCH(
        SELECTEDVALUE('Toggle Table'[Metric]),
        "Percentage of Revenue", [Revenue (%)],
        "Percentage of Revenue per Bin Range", [Revenue (%) per Bin Range],
        "Percentage of Revenue per Category",[Revenue (%) per Category],
        "Percentage of Total Products",[Product Count (%)],
        "Percentage of Total Products by Category and State",[Percentage of Total Products by Category and State],
        "Total Revenue",[Total Product Revenue],
        "Product Count",[Product Count],
        0 -- This is the default value for if no selection is made
    )
RETURN
    IF(ISBLANK(Metrics), 0, Metrics)
```

#### Key Parts of the Measure
- **`SELECTEDVALUE('Toggle Table'[Metric])`**: Retrieves the selected metric from the 'Toggle Table' slicer.
- **`SWITCH` Function**: Maps the selected metric to the corresponding measure.
- **Default Value (`0`)**: Returns `0` if no valid selection is made to prevent errors.
- **Error Handling**: Uses `ISBLANK` to handle cases where the metric is blank.

</details>

<details> 

<summary><b> 3. Scatter Metric Value </b> </summary> 
<br>

- **Purpose**: Dynamically selects the metric for the scatter chart based on the user’s slicer selection.
- **Logic**:
  - "Percentage of Revenue" maps to `[Total Product Revenue]`.
  - "Percentage of Total Products" maps to `[Product Count]`.
- **Application**: Ensures the scatter chart displays the correct metric, toggling between revenue and product count totals.

``` dax
Scatter Metric Value = 
SWITCH(
    SELECTEDVALUE('Toggle Table'[Metric]),
    "Percentage of Revenue", [Total Product Revenue],
    "Percentage of Total Products", [Product Count]
)
```
</details>
