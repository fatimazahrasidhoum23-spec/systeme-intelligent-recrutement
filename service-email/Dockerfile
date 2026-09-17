FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY EmailService.API/EmailService.API.csproj             EmailService.API/
COPY EmailService.Application/EmailService.Application.csproj EmailService.Application/
COPY EmailService.Domain/EmailService.Domain.csproj       EmailService.Domain/
COPY EmailService.Infrastructure/EmailService.Infrastructure.csproj EmailService.Infrastructure/
RUN dotnet restore EmailService.API/EmailService.API.csproj
COPY . .
RUN dotnet publish EmailService.API/EmailService.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8083
EXPOSE 8083
ENTRYPOINT ["dotnet", "EmailService.API.dll"]
