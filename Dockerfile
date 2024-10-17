# 使用 slim 版的 OpenJDK 17 作為基礎映像
FROM openjdk:17-jdk-slim AS base
# 更新並安裝 openssl
RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# 使用 Maven 作為構建階段
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
# 複製 pom.xml 和 src，然後進行依賴構建
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# 最終運行階段
FROM base AS final
WORKDIR /app
# 複製構建好的應用 JAR 文件到容器中
COPY --from=build /app/target/FinalTest-0.0.1-SNAPSHOT.jar /app/my-app.jar

# 複製加密的 Firebase 密鑰文件到容器內
COPY src/main/resources/ee85enjoyum-firebase-adminsdk-879hb-b508264fb5.json.enc /app/

# 建立應用運行用戶並更改權限
RUN useradd -m myappuser && \
    chown -R myappuser /app
USER myappuser

# 暴露 443 端口
EXPOSE 443

# 設定運行指令
CMD ["java", "-jar", "/app/my-app.jar"]
