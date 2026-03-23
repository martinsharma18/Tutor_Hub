using FluentValidation;
using TuitionPlatform.Application.DTOs.Teachers;

namespace TuitionPlatform.Application.Validators;

public class CreateTeacherApplicationRequestValidator : AbstractValidator<CreateTeacherApplicationRequest>
{
    public CreateTeacherApplicationRequestValidator()
    {
        RuleFor(x => x.TuitionPostId).NotEmpty();
        RuleFor(x => x.Message).NotEmpty().MaximumLength(2000);
    }
}

