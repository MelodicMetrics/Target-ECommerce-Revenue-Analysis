# Orders Changes Overview

As noted in my [Overview README.md](../README.md), I needed to recalculate the discrepant and missing `order_id`s.

There were more unique `order_id`s present in `Order_Items_Final` than in `Orders_Final`; therefore, the filter to remove missing IDs needed to be applied to the `Orders_Final` table. After doing so, I was able to ensure that both `Orders_Final` and `Order_Items_Final` were clean and usable for consistent analysis.

Additionally, by removing the `order_id`s found to be discrepant in order value from `Orders_Final`, I ensured consistency between `Orders_Final` and `Payments_Final`.

- *Note: There was one `order_id` that appeared in `Orders_Final` but not in `Payments_Final`; this is described in detail in the Payments_final_steps.md.*
