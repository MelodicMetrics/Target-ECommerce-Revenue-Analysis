# Geolocation Data Cleaning Process: Challenges and Limitations

### Project Context  
This project required preparing geolocation data for analysis at the state and city levels, with an emphasis on clean and accurate geographic insights. To achieve this, I implemented multiple steps to normalize, verify, and enhance data quality, focusing especially on city-state pairings. Initially, I attempted to validate the entire dataset through the GeoNames API, but limitations in the API led me to adapt the analysis by focusing on Brazil’s four largest states.

---

### Initial Cleaning and Normalization Efforts

- **Identification and Correction of Inconsistencies**: Addressed duplicate zip codes and corrected cities incorrectly mapped to state codes.
- **Normalization**: Standardized state entries and city names by trimming spaces and converting text to lowercase for consistent formatting.
- **Accent Removal and Term Cleanup**: Removed accents and unnecessary terms (e.g., "municipality") from city names to create uniform entries across the dataset.

---

### Initial Attempts with GeoNames API and Limitations Encountered

- **GeoNames API Integration**: Integrated the GeoNames API to build a reference list of valid city-state combinations in Brazil, intending to use it as a benchmark for validating data quality.
- **Limitations Encountered**:
  - Due to record limits and incomplete city data, the API provided fewer valid matches than anticipated.
  - Attempts to expand data retrieval through pagination were constrained by the API’s limitations, resulting in only partial validation of city-state combinations.
  - With these limitations, the API verification process could not cover the entire dataset, leaving many city-state combinations unverifiable.

---

### Adjusted Analysis to Focus on Four Largest States

To improve data quality within API constraints, I adapted my analysis to concentrate on Brazil’s four most populous states, making data validation more manageable and enhancing overall data reliability.

1. **International Census Bureau Data**: Acquired subpopulation data from the International Census Bureau for Brazil’s states, focusing on averages from 2016-2018 to determine the largest states:
   - **São Paulo**: Average Population of 56,879,799
   - **Rio de Janeiro**: Average Population of 24,175,260
   - **Minas Gerais**: Average Population of 21,120,398
   - **Bahia**: Average Population of 15,011,824

2. **Targeted GeoNames API Calls**: Limited the API call to retrieve city-state combinations for only these four states, yielding a more focused and accurate dataset.

---

### Final Verification and Cleaning Through GeoNames API

- **City Cleaning for Standardization**: Transformed city names to lowercase and removed accents to align with my dataset, creating a standardized reference list.
- **Merge with Customer and Seller Data**: Integrated this cleaned city-state data with my Customer and Seller tables, resulting in a significant increase in valid city-state combinations—from an initial 8 to approximately 150.

---

### Final Decision and Adaptation

- **Acknowledging Limitations**: Despite this focused approach, some inconsistencies may remain due to the API’s inherent limitations and the challenges of an individual project.
- **Summary of Limitations**: Complete data accuracy was not feasible with the available tools. All validation and cleaning steps are documented to provide transparency regarding any remaining data limitations.

---

### Outcome

This iterative data cleaning process highlights the importance of adaptability in achieving data quality. By adjusting the analysis to focus on the largest states and merging validated city-state pairs, I improved the dataset’s accuracy within resource constraints. The final analysis transparently acknowledges these limitations, presenting insights with a clear understanding of the data quality considerations.
