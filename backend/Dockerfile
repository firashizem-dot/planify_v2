# Multi-stage build for Spring Boot application
FROM maven:3.9.9-eclipse-temurin-17 AS builder

WORKDIR /app
COPY pom.xml .
# Download dependencies first (cached layer)
RUN mvn -v && mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -B \
    && ls -la target \
    && cp target/planify-backend-*.jar /app/app.jar

# Runtime stage
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Add non-root user for security
RUN addgroup -S planify && adduser -S planify -G planify

COPY --from=builder /app/app.jar app.jar

RUN chown planify:planify app.jar
USER planify

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=docker", "app.jar"]
