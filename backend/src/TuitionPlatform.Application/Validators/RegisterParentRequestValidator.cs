using FluentValidation;
using TuitionPlatform.Application.DTOs.Auth;

namespace TuitionPlatform.Application.Validators;

public class RegisterParentRequestValidator : AbstractValidator<RegisterParentRequest>
{
    public RegisterParentRequestValidator()
    {
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
        RuleFor(x => x.City).NotEmpty();
        RuleFor(x => x.Area).NotEmpty();
    }
}

