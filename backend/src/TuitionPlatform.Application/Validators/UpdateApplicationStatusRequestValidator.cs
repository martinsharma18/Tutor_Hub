using FluentValidation;
using TuitionPlatform.Application.DTOs.Teachers;

namespace TuitionPlatform.Application.Validators;

public class UpdateApplicationStatusRequestValidator : AbstractValidator<UpdateApplicationStatusRequest>
{
    private static readonly string[] AllowedStatuses = ["pending", "shortlisted", "rejected", "hired"];

    public UpdateApplicationStatusRequestValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty()
            .Must(status => AllowedStatuses.Contains(status.ToLowerInvariant()))
            .WithMessage("Status must be pending, shortlisted, rejected, or hired.");

        When(x => x.Status.Equals("hired", StringComparison.OrdinalIgnoreCase), () =>
        {
            RuleFor(x => x.AgreedAmount)
                .NotNull()
                .GreaterThan(0)
                .WithMessage("Agreed amount is required when hiring a teacher.");
        });
    }
}


