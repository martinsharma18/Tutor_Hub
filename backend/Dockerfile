FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY src/TuitionPlatform.Domain/TuitionPlatform.Domain.csproj src/TuitionPlatform.Domain/
COPY src/TuitionPlatform.Application/TuitionPlatform.Application.csproj src/TuitionPlatform.Application/
COPY src/TuitionPlatform.Infrastructure/TuitionPlatform.Infrastructure.csproj src/TuitionPlatform.Infrastructure/
COPY src/TuitionPlatform.Api/TuitionPlatform.Api.csproj src/TuitionPlatform.Api/

RUN dotnet restore src/TuitionPlatform.Api/TuitionPlatform.Api.csproj

COPY . .
RUN dotnet publish src/TuitionPlatform.Api/TuitionPlatform.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production
ENTRYPOINT ["sh", "-c", "ASPNETCORE_URLS=http://0.0.0.0:${PORT:-8080} dotnet TuitionPlatform.Api.dll"]
