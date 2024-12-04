## Customer Changes Overview

In the initial phase of data cleaning, `customer_id`s were filtered down to include only those appearing in the four most populated states in Brazil. With additional data from the IBGE, I was able to bring in many more valid entries. Previously, there were **20,958** `customer_id`s; after making various adjustments, this number increased to **93,927**—a gain of **72,969**. This is out of **99,441** total customers in the original dataset. The changes I implemented ensured that *94.45%* of the customers table was usable for analysis, compared to the initial *21.08%*.

During the creation of this table, I found that the number of `customer_id`s varied based on whether `Geolocation_Final` was created using an INNER or RIGHT JOIN with `IBGE_City_State_Source_of_Truth`. This led to a deeper investigation, where I discovered discrepancies between `Customers` and `Geolocation`: six `customer_city` entries did not appear in `Geolocation` (or in `Geolocation_Unaccented`). By creating `Geolocation_Final` with a `RIGHT JOIN` to include all entries from `IBGE_City_State_Source_of_Truth`, I was able to bring back those `customer_id`s, resulting in the aforementioned total of **93,927**.

[Click here](./steps.md) to read the detailed steps on the creation of `Customer_Final`.
