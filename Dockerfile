# 使用 Ubuntu 作為基礎映像，包含 OpenSSL
FROM ubuntu:20.04 as base
# 更新並安裝 openssl 和 OpenJDK 17
RUN apt-get update && \
    apt-get install -y openssl openjdk-17-jdk && \
    apt-get clean

# 使用 Maven 作為構建階段
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY . .

# 使用 root 權限運行 mvn 命令
USER root
RUN mvn clean package -DskipTests

# 最終運行階段，基於相同的 Ubuntu 基礎映像
FROM base AS final
WORKDIR /app
# 複製構建好的應用 JAR 文件到容器中
COPY --from=build /app/target/FinalTest-0.0.1-SNAPSHOT.jar /app/my-app.jar

# 複製加密的 Firebase 密鑰文件到容器內
COPY src/main/resources/ee85enjoyum-firebase-adminsdk-879hb-b508264fb5.json.enc /app/ee85enjoyum-firebase-adminsdk-879hb-b508264fb5.json.enc

# 暴露 443 端口
EXPOSE 443

# 設定運行指令
CMD ["java", "-jar", "/app/my-app.jar"]
