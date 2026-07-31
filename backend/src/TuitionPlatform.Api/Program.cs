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

// Run migrations on startup (all environments)
try
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<TuitionPlatformDbContext>();
    await dbContext.Database.MigrateAsync();

    var passwordHasher = scope.ServiceProvider.GetRequiredService<TuitionPlatform.Application.Interfaces.Services.IPasswordHasher>();
    var adminUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == "martinsharma18@gmail.com");
    if (adminUser is null)
    {
        adminUser = new TuitionPlatform.Domain.Entities.User
        {
            Id = Guid.NewGuid(),
            Email = "martinsharma18@gmail.com",
            FullName = "System Administrator",
            PasswordHash = passwordHasher.Hash("Martin#123"),
            Role = TuitionPlatform.Domain.Enums.UserRole.Admin,
            IsActive = true,
            EmailVerified = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.Users.Add(adminUser);
        Console.WriteLine("Default admin user created.");
    }
    else
    {
        adminUser.Role = TuitionPlatform.Domain.Enums.UserRole.Admin;
        adminUser.PasswordHash = passwordHasher.Hash("Martin#123");
        adminUser.IsActive = true;
        adminUser.EmailVerified = true;
        adminUser.UpdatedAtUtc = DateTime.UtcNow;
        Console.WriteLine("Default admin user promoted.");
    }

    await dbContext.SaveChangesAsync();
}
catch (Exception ex)
{
    Console.WriteLine($"Warning: Could not apply database migrations: {ex.Message}");
    throw;
}


// ⚠️ CORS must be FIRST — before HTTPS redirect — so preflight OPTIONS
// requests get Access-Control-Allow-Origin before any 301 redirect.
app.UseCors("Default");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapControllers();

app.Run();
