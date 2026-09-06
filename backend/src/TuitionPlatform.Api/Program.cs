using System.Text;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Threading.RateLimiting;
using TuitionPlatform.Api.BackgroundJobs;
using TuitionPlatform.Api.Filters;
using TuitionPlatform.Api.Hubs;
using TuitionPlatform.Api.Seeding;
using TuitionPlatform.Application;
using TuitionPlatform.Application.Interfaces.Services;
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

// Allowed origins come from config (AllowedOrigins:0, :1, ... or a CSV env var mapped the same
// way). Previously this accepted every origin in every environment, including production, which
// let any website call the API using a logged-in user's browser session.
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Default", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.AllowAnyHeader().AllowAnyMethod().AllowCredentials().SetIsOriginAllowed(_ => true);
        }
        else
        {
            policy.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins(allowedOrigins);
        }
    });
});

// Throttles brute-force login/register attempts. Auth endpoints opt in via
// [EnableRateLimiting("auth")]; everything else is unaffected.
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddFixedWindowLimiter("auth", limiterOptions =>
    {
        limiterOptions.PermitLimit = 10;
        limiterOptions.Window = TimeSpan.FromMinutes(1);
        limiterOptions.QueueLimit = 0;
    });
});

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddSignalR();
builder.Services.AddScoped<IRealtimeNotifier, SignalRRealtimeNotifier>();

// Bills active placements monthly. Safe to run repeatedly — see MonthlyInvoiceService.
builder.Services.AddHostedService<MonthlyInvoiceService>();

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
    options.Events = new JwtBearerEvents
    {
        // Browser WebSocket/SSE connections can't set an Authorization header, so SignalR's
        // JS client sends the token as ?access_token=... instead — read it only for hub paths.
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            if (!string.IsNullOrEmpty(accessToken) && context.HttpContext.Request.Path.StartsWithSegments("/hubs"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

var app = builder.Build();

// Run migrations, then seed the admin from config (AdminSeeder — never hardcoded credentials).
try
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<TuitionPlatformDbContext>();
    await dbContext.Database.MigrateAsync();
}
catch (Exception ex)
{
    Console.WriteLine($"Warning: Could not apply database migrations: {ex.Message}");
    throw;
}

await AdminSeeder.SeedAsync(app.Services, app.Logger);
await LookupSeeder.SeedAsync(app.Services, app.Logger);

// ⚠️ CORS must be FIRST — before HTTPS redirect — so preflight OPTIONS
// requests get Access-Control-Allow-Origin before any 301 redirect.
app.UseCors("Default");
app.UseRateLimiter();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

// Serves wwwroot/uploads at /uploads — see LocalFileStorageService for the important caveat that
// Render's filesystem is ephemeral, so this is a dev/placeholder storage backend, not production.
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat");

app.Run();
