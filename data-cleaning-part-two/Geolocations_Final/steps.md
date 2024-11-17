# Geolocation_Final Table Creation Steps

## Part 1. Dataset Download

 - After downloading the dataset from the IBGE, I translated each column title to English in order to determine which columns were most likely to contain the information I was looking for *(cities and states)*.
 - After determining which columns I needed (Name of Municipality for Cities and Name of Federative Unit for States), I copied them into a new sheet and created a table (`City_State_Cleaning`).

## Part 2. Dataset Cleaning
  - As the original dataset used State Codes rather than the actual State (Federative Unit) names, I had to convert the names into State Codes. In order to do this, I created a separate sheet with every State name and their respective State Code.
  - In my (`City_State_Cleaning`) table, I added a column entitled **"StateCode"** and used the following function to find the proper State Code for each State:
    - ```
      =XLOOKUP([@[Name of the Federative Unit]], StateCodes!A:A, StateCodes!B:B, "Not Found")`
    Where:
      - `Name of the Federative Unit` refers to the column containing each state name.
      - `StateCodes!` tells the XLOOKUP function to specifically look at columns in a different sheet entitled "StateCodes".
  - Next I needed to ensure that each city name was in lowercase to standardize with the original dataset.
  - I created a column entitled **"Lowercase City"** and used the following function to make every city name lowercase:
    - ```
      =LOWER([@[Name of Municipality(City)]])`
    Where:
      - `LOWER` is the function name that will return whatever value selected in lowercase.
      - `Name of Municipality(City)` refers to the column containing the city names
  - My final step was to make sure that all of the cities did not contain accents due to most entries in the original dataset also not containing them.
  - I first copied all the cells in my **"Lowercase City"** column into another column entitled **"Unaccented City"**. Then I pulled that column into Power Query.
  - Once in Power Query I added the following step in advanced edit so that the m code looked like the following:
    - ```m
      let
        #"Remove Accents" = Table.TransformColumns(
          #"Changed Type",
        {{"Unaccented City", each 
            Text.Replace(Text.Replace(Text.Replace(Text.Replace(Text.Replace(
            Text.Replace(Text.Replace(Text.Replace(Text.Replace(Text.Replace(
            Text.Replace(Text.Replace(Text.Replace(Text.Replace(Text.Replace(
            Text.Replace(Text.Replace(Text.Replace(Text.Replace(Text.Replace(
            Text.Replace(Text.Replace(Text.Replace(Text.Replace(Text.Replace(Text.Lower(_), "á", "a"), "à", "a"), 
            "â", "a"), "ä", "a"), "ã", "a"), "å", "a"), 
            "é", "e"), "è", "e"), "ê", "e"), "ë", "e"),
            "í", "i"), "ì", "i"), "î", "i"), "ï", "i"), 
            "ó", "o"), "ò", "o"), "ô", "o"), "ö", "o"), "õ", "o"), 
            "ú", "u"), "ù", "u"), "û", "u"), "ü", "u"), 
            "ñ", "n"), "ç", "c")}}
      )
      in
        #"Remove Accents"
    - This long line of code basically just replaces all accents with their unaccented counterparts one by one while also ensuring any uppercase variants become lowercase as well.
  - After creating the output table, I made sure to remove all unneccesary columns that were loaded as well as removing StateCodes that appeared as *"0"*.
  - This gave me a cleaned table and so I copied the "StateCode" and "Unaccented City" columns to a final sheet entitled *"IBGE Brazil City States"*. This table I saved as a .csv file entitled **"IBGE Brazil City States"** which I imported into Google BigQuery as **`IBGE_City_State_Source_of_Truth`**.
---

## Part 3. Geolocation_Final Creation

### Objective

After creating the table in BigQuery, I needed to filter the `Geolocation` table to only display cities and states that were marked as valid by my `IBGE_City_State_Source_of_Truth` table. But before, I could do this, I needed to make sure that none of the cities in the original `Geolocation` table contained accents due to data entry errors. 

<detail> 
<summary>Click here to expand details</summary>

### Step 1: Creating `Geolocation_Unaccented`
- I wrote the following query in order to create a new table of geolocations that ensured all cities were unaccented:

```sql
   /*
    This query creates a new table called Gelocation_Unaccented where all the cities from the original table are unaccented.
    LOWER(...) converts all the city names to lowercase for consistent comparison. REGEXP_REPLACE(...) replaces all the accented characters with their unaccented versions.
    The original geolocation_city column is retained as well for reference.
    */
     CREATE OR REPLACE TABLE `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Geolocation_Unaccented` AS
    SELECT
    geolocation_state,
    LOWER(
        REGEXP_REPLACE(
                    REGEXP_REPLACE(
                        REGEXP_REPLACE(
                            REGEXP_REPLACE(
                                REGEXP_REPLACE(
                                    REGEXP_REPLACE(
                                        REGEXP_REPLACE(
                                            REGEXP_REPLACE(
                                                REGEXP_REPLACE(
                                                    REGEXP_REPLACE(
                                                        REGEXP_REPLACE(
                                                            REGEXP_REPLACE(
                                                                REGEXP_REPLACE(
                                                                    REGEXP_REPLACE(
                                                                        geolocation_city,
                                                                        r"[ÁÀÂÄÃ]", "A"),
                                                                    r"[áàâäã]", "a"),
                                                                r"[ÉÈÊË]", "E"),
                                                            r"[éèêë]", "e"),
                                                        r"[ÍÌÎÏ]", "I"),
                                                    r"[íìîï]", "i"),
                                                r"[ÓÒÔÖÕ]", "O"),
                                            r"[óòôöõ]", "o"),
                                        r"[ÚÙÛÜ]", "U"),
                                    r"[úùûü]", "u"),
                                r"Ñ", "N"),
                            r"ñ", "n"),
                        r"Ç", "C"),
                    r"ç", "c")
            )
     AS geolocation_city_unaccented,
    geolocation_city AS original_geolocation_city  -- Retain the original column for reference
    FROM
    `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Geolocation`
```

### Step 2: Creating `Geolocation_Final` with a RIGHT JOIN

- Once `Geolocation_Unaccented` was created, I proceed to creat the `Geolocation_Final` table using a `RIGHT JOIN` to ensure all city-state combinations from `IBGE_City_State_Source_of_Truth` were included, even if they did not have a match in `Geolocation_Unaccented`.
  
  - ```sql
    /* 
    1.The COALESCE function is used to select values from Geolocation_Unaccented if it's present or default to values from IBGE_City_State_Source_of_Truth.
    This approach helps to fill in missing entries from the Geolocation_Unaccented table with data from the source of truth table.
    2. The RIGHT JOIN is used to include all rows from the IBGE_City_State_Source_of_Truth table, even when there aren't matches in Geolocation_Unaccented.
    */ 
    -- Create a comprehensive Geolocations_Final table using RIGHT JOIN to ensure all IBGE entries appear
     CREATE OR REPLACE TABLE iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Geolocation_Final AS
     SELECT DISTINCT
         COALESCE(geo.geolocation_city_unaccented, truth.city) AS city,
         COALESCE(geo.geolocation_state, truth.StateCode) AS state
     FROM     
         iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Geolocation_Unaccented AS geo
     RIGHT JOIN  
         iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.IBGE_City_State_Source_of_Truth AS truth
     ON 
         truth.city = geo.geolocation_city_unaccented AND truth.StateCode = geo.geolocation_state;
 
### **3A. Why RIGHT JOIN?**
   - I noticed that when using an `INNER JOIN` to create the final table and selecting `DISTINCT` cities that were unaccented, I would get less customer_ids than if I used a `RIGHT JOIN` from the `IBGE_City_State_Source_of_Truth` table. Specifically from **(98,715)** to **(98,709)**, a loss of **6** IDs. 

**1.** **Using `Geolocation_Comparison` to Identify Missing Matches**
 - To identify the cause of these removed IDs, I created a `Geolocation_Comparison` table using a `RIGHT JOIN` and retained accents to control for any potential changes introduced by removing them. The purpose of the `RIGHT JOIN` was to ensure that all city-state combinations from the source of truth table would appear, regardless of whether there was a matching entry in the Geolocation table.

      ```sql
      CREATE OR REPLACE TABLE iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Geolocation_Comparison AS 
      SELECT DISTINCT
        truth.City AS City,
        truth.StateCode AS Statecode
      FROM 
        `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Geolocation` AS geo
      RIGHT JOIN 
        `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.IBGE_City_State_Source_of_Truth` AS truth
      ON
        geo.geolocation_city = truth.city AND geo.geolocation_state = truth.StateCode
         -
**2.** **Direct Comparison with Geolocation_Final** 
 - This table (`Geolocation_Comparison`) was used to directly compare with a filtered version, specifically `Geolocation_Final_Original`. The `INNER JOIN` in `Geolocations_Final` pulls only cities and states that have a match between the two tables. Additionally, accents were not removed to confirm that any discrepancies were due solely to the difference between an `INNER JOIN` and a `RIGHT JOIN`, rather than any potential issues introduced by `Geolocation_Unccented`.  

     ```sql
       CREATE OR REPLACE TABLE iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Geolocation_Final_Original AS 
       SELECT DISTINCT
         truth.City AS City,
         truth.StateCode AS Statecode
       FROM 
         `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Geolocation` AS geo
       INNER JOIN 
         `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.IBGE_City_State_Source_of_Truth` AS truth
       ON
         geo.geolocation_city = truth.city AND geo.geolocation_state = truth.StateCode
With these two versions of Geolocation tables, I could compare my customer tables to investigate why `INNER JOIN` was leading to fewer IDs. Click here to read the steps taken to find which `customer_id`s were being removed due to the `INNER JOIN` and why.
With these two versions of Geolocation tables, I could compare my customer tables to investigate why `INNER JOIN` was leading to fewer IDs. [Click here to read the steps taken to find which `customer_id`s were being removed due to the `INNER JOIN` and why.](../Customers_Final/steps.md)
 
 - *After running my comparison, I discovered that six cities in `Customer` were either misspelled or missing entirely from `Geolocation`. Using an INNER JOIN would only include cities present in both `Geolocation` and `IBGE_City_State_Source_of_Truth`. Therefore, to ensure these six cities were included, a `RIGHT JOIN` on `IBGE_City_State_Source_of_Truth` was the best choice, as it retains all entries from that table, regardless of their presence in `Geolocation`.*


### **3B. Why COALESCE?**
 - The purpose of the `COALESCE` function is to select values from `Geolocation_Unaccented` when present, or to default to values from `IBGE_City_State_Source_of_Truth` when they are missing. This approach handles cases like `"Sambaiba, MA"` by filling gaps in `Geolocation_Unaccented` with the authoritative data from the IBGE table.

</detail>
---        
### Data Source
The dataset for Brazilian municipalities and federative units was obtained from the **IBGE** *(Brazilian Institute of Geography and Statistics)*. You can access the original dataset [here](https://www.ibge.gov.br/geociencias/organizacao-do-territorio/estrutura-territorial/23701-divisao-territorial-brasileira.html?=&t=downloads).

    
     
