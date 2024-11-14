## Steps for Creating `Customers_Final` Table


### 1. `Customers_Comparison` Table
 - This table was made based on an `INNER JOIN` between the original Customers table and my `Geolocation_Comparison` table. This ensured the only filters on this table were based on the `RIGHT JOIN` from the Geolocation_Comparison table. 
   ```sql
      CREATE OR REPLACE TABLE iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Customers_Comparison AS 
      SELECT
         customer.customer_id AS customer_id,
         truth.City AS City,
         truth.StateCode AS Statecode
      FROM 
         `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Customers AS customer
      INNER JOIN 
         `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Geolocation_Comparison` AS truth
      ON
         customer.customer_city = truth.City AND customer.customer_state = truth.StateCode

### 2. `Customers_Final_Original` Table 

 - This table was based on `Geolocations_Final_Original` and `Customers`. To recap, `Geolocation_Final_Original` was created with an `INNER JOIN` rather than a `RIGHT JOIN`.
 - *Note*: The purpose of the "_Original" in the geolocation and customers table is to display the logic that lead to the actual Final tables. The Original final table for customers contained 98,709 entries. After making the changes the new `Customers_Final` table will contain the intended 98,715 entries. 
       
       ```sql
        CREATE OR REPLACE TABLE iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Customers_Final AS 
        SELECT
          customer.customer_id AS customer_id,
          truth.City AS City,
          truth.StateCode AS Statecode
        FROM 
          iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Customers AS customer
        INNER JOIN 
          `iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Geolocation_Final_Original` AS truth
        ON
          customer.customer_city = truth.City AND customer.customer_state = truth.StateCode
    
 ### 3. Comparison of Customer Tables 
  - Finally I wrote a Query to compare the 2 tables to identify the `customer_id`s appearing in `Customers_Comparison` but *not* in `Customers_Final_Original`.

    ```sql
       -- Compares Customers_Comparison (98,715) to the final table (98,709)
       SELECT
         customer_id
       FROM
         iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Customers_Comparison
       EXCEPT DISTINCT
       SELECT
         customer_id
       FROM
         iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Customers_Final_Original
  
  - This query identified the 6 `customer_id`s missing due to the `INNER JOIN` between `Geolocation` and `IBGE_City_State_Source_of_Truth`. I investigated one of these IDs (`"e6add8f4805cb6a382c26548daaed9d7"`) and found that the customer was based in `Sambaiba, MA`. Checking this city in both `Geolocation` and `IBGE_City_State_Source_of_Truth` revealed that it was missing in the former, explaining why these customers were dropped in the `INNER JOIN` but retained in the `RIGHT JOIN`.

    ```sql
       SELECT *
       FROM
         iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Customers
       WHERE
         customer_id = "e6add8f4805cb6a382c26548daaed9d7"
  
      SELECT *
      FROM
        iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.IBGE_City_State_Source_of_Truth
      WHERE
        city = "sambaiba";
      
      SELECT *
      FROM
        iconic-fountain-435918-q3.Target_Ecommerce_Sales_2016_2018.Geolocation
      WHERE
        geolocation_city = "sambaiba"
 
 - The first query returned a result, while the second did not, indicating that the original `Geolocation` table was missing certain cities, which led to the decision to use a `RIGHT JOIN` to include all entries from `IBGE_City_State_Source_of_Truth`.
