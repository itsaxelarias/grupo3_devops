# ====== build ======
FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /app

# Descarga dependencias primero (cache)
COPY pom.xml .
RUN mvn -B -q -DskipTests dependency:go-offline

# Copia el código y compila
COPY src ./src
RUN mvn -B -DskipTests package

# ====== run ======
FROM eclipse-temurin:17-jre
WORKDIR /app
ENV PORT=8080
EXPOSE 8080

# Copia el JAR construido
COPY --from=build /app/target/*.jar /app/app.jar

# Arranque
ENTRYPOINT ["java","-jar","/app/app.jar"]
