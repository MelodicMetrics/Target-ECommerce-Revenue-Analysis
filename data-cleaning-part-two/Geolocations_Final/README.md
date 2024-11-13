## Geolocation Changes Overview

Initially, in the first phase of my data cleaning, I used the GeoNames API to create a list of valid city-state combinations to filter the dataset. However due to constraints of using a free account, I had to limit my analysis to just **4 states** and their respective cities. This yielded me **274** rows. 

Before creating my `Geolocation_Final` table, I decided to change the source of my city-state combinations to a publication by the **IBGE** *(Brazilian Institute of Geography and Statistics)*. This dataset, from 2022, contains a complete list of all municipalities and federative units in Brazil, providing a more comprehensive and current basis for filtering.

Using the IBGE dataset allowed me to increase the number of valid city-state combinations in my dataset from **274** to **5,441** entries—an increase of **5,167 entries**.

### Impact
 - By filtering the city-state list in Google BigQuery, I was able to apply this filter directly across all related tables. This eliminated the need for the filter logic in my Power BI DAX queries, such as the line `LOOKUPVALUE(Customers[customer_state], Customers[customer_id], RELATED(Orders[customer_id])) IN {"SP", "RJ", "MG", "BA"}`. Previously, I had to include this line in every measure and calculated column dealing with customer IDs.

 - By incorporating this filter in Google BigQuery, my Power BI measures and DAX queries are now cleaner and more readable, allowing for easier maintenance and improved performance.
