using FluentValidation;
using TuitionPlatform.Application.DTOs.Auth;

namespace TuitionPlatform.Application.Validators;

public class RegisterTeacherRequestValidator : AbstractValidator<RegisterTeacherRequest>
{
    public RegisterTeacherRequestValidator()
    {
        RuleFor(x => x.FullName).NotEmpty();
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
        RuleFor(x => x.Subjects).NotEmpty();
        RuleFor(x => x.Classes).NotEmpty();
        RuleFor(x => x.PreferredMode).NotEmpty();
    }
}

