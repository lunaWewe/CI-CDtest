# 使用 Maven 作為構建階段
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# 使用 OpenJDK 17 作為運行階段
FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/FinalTest-0.0.1-SNAPSHOT.jar /app/my-app.jar

EXPOSE 8080
CMD ["java", "-jar", "/app/my-app.jar"]
