# Use Maven to build the app
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy project files
COPY . .

# Build the project
RUN mvn clean package -DskipTests

# Use lightweight Java image to run app
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port (Spring Boot default)
EXPOSE 8080

# Run application
ENTRYPOINT ["java","-jar","app.jar"]