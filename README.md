dependencies:
=
`java 1.8, maven, gulp 4.0.2, npm12`

*To setup environment*


*to develop*
1) `mvn install`
2) `run DemoApplication on IDE with live profile so thymeleaf cache gets disabled`
3) `npm run watch`

*to deploy*
`mvn clean package -Prelease`