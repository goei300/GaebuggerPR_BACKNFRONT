# Multi-stage Dockerfile

# Stage 1: Node.js를 사용하여 React 프론트엔드 빌드
FROM node:14 AS frontend-build
WORKDIR /app/frontend
COPY src/main/frontend/package*.json ./
RUN npm install
COPY src/main/frontend/ ./
RUN npm run build

# Stage 2: Java와 Gradle을 사용하여 Spring Boot 빌드
FROM gradle:7.3-jdk11 AS backend-build
WORKDIR /app
COPY --from=frontend-build /app/frontend/build src/main/resources/static
COPY build.gradle settings.gradle ./
COPY src ./src
RUN gradle clean build

# Stage 3: 빌드된 JAR 파일 실행
FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=backend-build /app/build/libs/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
