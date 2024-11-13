## Geolocations_Final Table Creation Steps

### 1. Dataset Download
 - After downloading the dataset from the IBGE, I translated each column title to English in order to determine which columns were most likely to contain the information I was looking for *(cities and states)*.
 - After determining which columns I needed (Name of Municipality for Cities and Name of Federative Unit for States), I copied them into a new sheet and created a table (`City_State_Cleaning`).
### 2. Dataset Cleaning
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
  - Once in Power Query I added the following step in advanced error so that the m code looked like the following:
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
### 3. Geolocations_Final Creation
#### After creating the table in BigQuery, I needed to filter the `Geolocations` table to only display cities and states that were marked as valid by my `IBGE_City_State_Source_of_Truth` table
- I wrote the following query in order to accomplish this:
  - ```sql
    /* This query originally created a new Geolocation table based on a city_state_source_of_truth table from the GeoNames API to correct
    incorrect city-state combinations and city entry errors in the dataset.

    However, after obtaining a more robust list from the IBGE database, the join is now based on a new table, IBGE_City_State_Source_of_Truth.
    This update yields a higher number of valid combinations, resulting in a more comprehensive analysis.
    */
    CREATE TABLE `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Geolocation_Final` AS
    SELECT DISTINCT
      truth.City AS City,
      truth.StateCode AS Statecode
    FROM
      `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Geolocation_Cleaned_Final` AS geo
    INNER JOIN
      `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.IBGE_City_State_Source_of_Truth` AS truth
    ON
      geo.geolocation_city = truth.city AND geo.geolocation_state = truth.StateCode

### Data Source
The dataset for Brazilian municipalities and federative units was obtained from the **IBGE** *(Brazilian Institute of Geography and Statistics)*. You can access the original dataset [here](https://www.ibge.gov.br/geociencias/organizacao-do-territorio/estrutura-territorial/23701-divisao-territorial-brasileira.html?=&t=downloads).

    
     
