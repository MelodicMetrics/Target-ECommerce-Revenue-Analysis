---
layout: default
title: Products Final Index
---

<h1>Overview of Products Changes</h1>

<p>
  In my initial cleaning and analysis, I identified several issues with the <code>product_category</code> column, including:
</p>
<ul>
  <li><strong>Inconsistent Case</strong>: Categories were in a mix of lowercase, uppercase, and title case (e.g., <code>babies</code>, <code>HEALTH BEAUTY</code>, <code>Construction Tools Garden</code>).</li>
  <li><strong>Translation Inconsistencies</strong>: Some categories were in Spanish, while others were in English (e.g., <code>Agro Industria e Comercio</code>).</li>
  <li><strong>Confusing Naming</strong>: Certain categories had unclear or ambiguous names, requiring best-guess corrections (e.g., <code>CITTE AND UPHACK FURNITURE</code>).</li>
  <li><strong>Missing Categories</strong>: Some <code>product_id</code>s in the <code>Products</code> table had no associated <code>product_category</code>, resulting in <code>NULL</code> values.</li>
</ul>

<p>To address these issues, I created a standardized mapping file (<code>Product_Category_Mappings.csv</code>) and uploaded it to Google BigQuery. Using this mapping table, I applied the following steps:</p>

<ol>
  <li>
    <strong>LEFT JOIN</strong>:  
    <ul>
      <li>Joined the <code>Products</code> table with <code>Product_Category_Mappings</code> to standardize category names wherever possible.</li>
      <li>This ensured all rows from <code>Products</code> were included, even if no matching entry existed in the mapping table.</li>
    </ul>
  </li>
  <li>
    <strong>COALESCE for Missing Categories</strong>:  
    <ul>
      <li>Replaced <code>NULL</code> values in <code>product_category</code> (from rows with no category entries) with a default value of <code>Uncategorized</code>.</li>
      <li>This ensured every product in <code>Products_Final</code> had a valid category.</li>
    </ul>
  </li>
</ol>

<p>
  These changes resulted in a clean and consistent <code>Products_Final</code> table, with all <code>product_category</code> entries standardized or assigned a default value.
</p>

<p><a href="steps">Click here</a> to read the detailed steps on the creation of <code>Products_Final</code>.</p>
