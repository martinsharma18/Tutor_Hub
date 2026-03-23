using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Application.Services.Admin;
using TuitionPlatform.Application.Services.Applications;
using TuitionPlatform.Application.Services.Auth;
using TuitionPlatform.Application.Services.Demo;
using TuitionPlatform.Application.Services.Messages;
using TuitionPlatform.Application.Services.Payments;
using TuitionPlatform.Application.Services.Search;
using TuitionPlatform.Application.Services.Teachers;
using TuitionPlatform.Application.Services.TuitionPosts;

namespace TuitionPlatform.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(DependencyInjection).Assembly);
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITeacherService, TeacherService>();
        services.AddScoped<ITuitionPostService, TuitionPostService>();
        services.AddScoped<ISearchService, SearchService>();
        services.AddScoped<IDemoService, DemoService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<IMessageService, MessageService>();
        services.AddScoped<IAdminService, AdminService>();
        services.AddScoped<IApplicationWorkflowService, ApplicationWorkflowService>();

        return services;
    }
}

