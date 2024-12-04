---
layout: default
title: Order_Item Overview
---

# Overview of Order Item Changes

In my initial analysis, I considered using a `JOIN` with the `Sellers_Final` table on `seller_id`. However, since I was no longer filtering `Sellers_Final` by the `IBGE_City_State_Source_of_Truth`, this approach would have introduced all `order_ids` linked to those unfiltered `seller_ids` — regardless of whether the orders were made by customers from valid city-state combinations.

Instead, I opted to use a `JOIN` with `Orders_Final`, which ensured that only `order_ids` and `seller_ids` associated with filtered `customer_ids` appeared in the `Order_Items_Final` table. An additional benefit of this approach was that I no longer needed to include filter logic for either missing or discrepant `order_ids`:


- **Recalculated Missing Orders**:  
  These `order_ids` were inherently excluded, as they were already absent from the `Order Items` table in the initial dataset.

- **Recalculated Discrepant Orders**:  
  These `order_ids` were automatically excluded, as `Order_Items_Final` was created by joining on `order_id` from `Orders_Final`, which had already filtered out discrepant orders.


  [Click here](./steps.md) to read the detailed steps on the creation of `Order_Items_Final`.

