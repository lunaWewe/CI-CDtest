# 使用 Maven 作為構建階段，方便運行測試並構建最終應用
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# 使用 OpenJDK 17 作為運行階段
FROM openjdk:17-jdk-alpine
WORKDIR /app

# 安裝 openssl
RUN apk update && apk add --no-cache openssl

# 複製構建好的應用 JAR 文件到容器中，作為最終運行應用
COPY --from=build /app/target/FinalTest-0.0.1-SNAPSHOT.jar /app/my-app.jar

# 複製加密的 Firebase 密鑰文件到容器內
COPY src/main/resources/ee85enjoyum-firebase-adminsdk-879hb-b508264fb5.json.enc /app/ee85enjoyum-firebase-adminsdk-879hb-b508264fb5.json.enc

# 替換端口，公開 443 端口
EXPOSE 443
CMD ["java", "-jar", "/app/my-app.jar"]
