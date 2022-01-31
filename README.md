# Visual Facts Platform

VisualFacts is a prototype system, a self-service visual analytics platform for big geo-located data that helps data explorers perform ad hoc analysis of raw data files collected from different sources of varying quality (with duplicates or missing data) in rich visual ways, even though they do not have a background in notebooks, data integration, or machine learning techniques. VisualFacts platform offers in-situ visual exploration and analytics, as well as entity resolution analysis.

VisualFacts platform allows users to open their own data file(s) and via a map-centric Dashboard UI start visually interacting with the data without loading or indexing the data in a database. The backbone of the platform is a visual aware in-memory index, which is constructed on the fly and adjusted to user interaction, as well as a powerful deduplication engine which offers on-the-fly visual entity matching and clustering over dirty data. The platform can scale up the visualization, interactive exploration and analysis to million data points on a map, with the use of commodity hardware.

## Building VisualFacts platform

To build the VisualFacts platform JAR file run:

```

./mvnw -Pprod clean verify


```

To start the application, run the single executable JAR file that starts an embedded Apache Tomcat:

```

java -jar target/*.jar


```

Then navigate to [http://localhost:8080](http://localhost:8080) in your browser.

</br>

## Publications

- Bikakis N., Maroulis S., Papastefanatos G., Vassiliadis P.: In-Situ Visual Exploration over Big Raw Data, Information
  Systems, Elsevier,
  2021 [[pdf]](https://www.nbikakis.com/papers/in_situ_big_data_visual_analytics_indexing_IS_2020.pdf)

- Maroulis S., Bikakis N., Papastefanatos G., Vassiliadis P., Vassiliou Y.: RawVis: A System for Efficient In-situ
  Visual Analytics, intl. conf. on Management of Data (ACM SIGMOD/PODS ' 21) [[pdf]](https://www.nbikakis.com/papers/RawVis_A_System_for_Efficient_In-situ_Visual_Analytics_SIGMOD2021.pdf)

- Maroulis S., Bikakis N., Papastefanatos G., Vassiliadis P., Vasiliou Y.: Adaptive Indexing for In-situ Visual
  Exploration and Analytics, 23rd intl. Workshop on Design, Optimization, Languages and Analytical Processing of Big
  Data (DOLAP ' 21) [[pdf]](https://www.nbikakis.com/papers/RawVis_Adaptive_Indexing_for_In-situ_Visual_Exploration_and_Analytics_DOLAP2021.pdf)

- Bikakis N., Maroulis S., Papastefanatos G., Vassiliadis P.: RawVis: Visual Exploration over Raw Data, 22nd european
  conf. on advances in databases & information systems (ADBIS 2018) [[pdf]](http://www.nbikakis.com/papers/RawVis.Visual.Exploration.over.Big.Raw.Data.pdf)
