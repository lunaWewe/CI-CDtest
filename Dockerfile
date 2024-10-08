# 使用 Maven 作為構建階段
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# 使用 OpenJDK 17 作為運行階段
FROM openjdk:17-jdk-alpine
WORKDIR /app

# 複製 keystore.jks 文件到容器
COPY keystore.jks /app/keystore.jks

# 複製構建好的應用 JAR 文件到容器
COPY --from=build /app/target/FinalTest-0.0.1-SNAPSHOT.jar /app/my-app.jar

# 替換端口，公開 443 端口
EXPOSE 443
CMD ["java", "-jar", "/app/my-app.jar"]
