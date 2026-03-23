using System.Text;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TuitionPlatform.Api.Filters;
using TuitionPlatform.Application;
using TuitionPlatform.Infrastructure;
using TuitionPlatform.Infrastructure.Persistence;
using TuitionPlatform.Infrastructure.Settings;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(options =>
{
    options.Filters.Add<ApiExceptionFilter>();
});

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Default", policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(origin => true); // Allow all origins in development
    });
});

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var jwtSettings = builder.Configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>() ?? new JwtSettings();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
    };
});

var app = builder.Build();

// Seed admin user in development
if (app.Environment.IsDevelopment())
{
    try
    {
        using (var scope = app.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<TuitionPlatform.Infrastructure.Persistence.TuitionPlatformDbContext>();
            
            // Ensure database is created
            await dbContext.Database.EnsureCreatedAsync();
            
            var passwordHasher = scope.ServiceProvider.GetRequiredService<TuitionPlatform.Application.Interfaces.Services.IPasswordHasher>();
            
            var adminExists = await dbContext.Users.AnyAsync(u => u.Email == "admin@tuitionplatform.com");
            if (!adminExists)
            {
                var adminUser = new TuitionPlatform.Domain.Entities.User
                {
                    Id = Guid.NewGuid(),
                    Email = "admin@tuitionplatform.com",
                    FullName = "System Administrator",
                    PasswordHash = passwordHasher.Hash("Admin123!"),
                    Role = TuitionPlatform.Domain.Enums.UserRole.Admin,
                    IsActive = true,
                    EmailVerified = true,
                    CreatedAtUtc = DateTime.UtcNow
                };
                
                dbContext.Users.Add(adminUser);
                await dbContext.SaveChangesAsync();
                Console.WriteLine("✅ Default admin user created!");
                Console.WriteLine("   Email: admin@tuitionplatform.com");
                Console.WriteLine("   Password: Admin123!");
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"⚠️  Warning: Could not initialize database: {ex.Message}");
        Console.WriteLine("   The application will continue, but database features may not work.");
        Console.WriteLine("   Please ensure SQL Server is running and the connection string is correct.");
    }
    
    app.UseSwagger();
    app.UseSwaggerUI();
    // Skip HTTPS redirection in development to avoid port detection issues
    // app.UseHttpsRedirection();
}
else
{
    app.UseHttpsRedirection();
}

app.UseCors("Default");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
