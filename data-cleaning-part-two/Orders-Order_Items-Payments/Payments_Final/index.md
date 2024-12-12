---
layout: default
title: Payments Final Overview
---

<h1>Overview of Payment Changes</h1>

<p>
  In my initial cleaning, I removed the <code>payment_sequential</code> column and summed all <code>payment_value</code> entries into <code>total_payment_value</code>. This reduced duplicates in the <code>Payments</code> table and resulted in the creation of the <code>Payments_Cleaned</code> table.
</p>

<p>Upon further analysis, I identified additional issues:</p>
<ul>
  <li><strong>Duplicates</strong>: The <code>payment_type</code> and <code>payment_installments</code> columns added <strong>1,123</strong> and <strong>866</strong> duplicate entries respectively.</li>
  <li><strong>Missing <code>order_id</code></strong>: One <code>order_id</code> present in <code>Orders_Final</code> and <code>Order_Items_Final</code> was absent from <code>Payments_Final</code>.</li>
</ul>

<p>To resolve these, I:</p>
<ol>
  <li>Removed <code>payment_type</code> and <code>payment_installments</code>, further reducing duplicates.</li>
  <li>Applied filter logic to remove invalid <code>order_id</code>s identified in <code>Recalculated_Missing_Orders</code> and <code>Recalculated_Discrepant_Orders</code>.</li>
  <li>Reinserted the missing <code>order_id</code>, bringing <code>Payments_Final</code> to the correct total of <strong>92,843 entries</strong>, fully aligning with <code>Orders_Final</code>.</li>
</ol>

<p>The iterative cleaning process ensured <code>Payments_Final</code> is consistent with <code>Orders_Final</code> and free of duplicate or invalid entries.</p>

<hr />

<h2>Assumptions for Inserting Missing <code>order_id</code></h2>

<ol>
  <li>
    <strong>All <code>order_id</code>s Should Have Payments</strong>
    <ul>
      <li>I assumed every <code>order_id</code> in <code>Order_Items_Final</code> should have a matching entry in <code>Payments_Final</code>, as payments logically follow valid orders.</li>
    </ul>
  </li>
  <li>
    <strong>Missing Data Over Invalid Data</strong>
    <ul>
      <li>The absence of this <code>order_id</code> in <code>Payments_Final</code> was treated as missing data, not an invalid or canceled order, because it appeared in both <code>Orders_Final</code> (with a <code>delivered</code> status) and <code>Order_Items_Final</code>.</li>
    </ul>
  </li>
  <li>
    <strong>Validated by Calculation</strong>
    <ul>
      <li>I calculated the expected payment value (<code>price</code> + <code>freight_value</code>) for the missing <code>order_id</code>, reinforcing its validity.</li>
    </ul>
  </li>
  <li>
    <strong>Isolated Anomaly</strong>
    <ul>
      <li>I treated this as an isolated issue requiring individual correction, rather than a systemic problem with missing or invalid <code>order_id</code>s.</li>
    </ul>
  </li>
</ol>

<hr />

<p><a href="steps">Click here</a> to read the detailed steps on the creation of <code>Payments_Final</code>.</p>
