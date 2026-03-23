using FluentValidation;
using TuitionPlatform.Application.DTOs.TuitionPosts;

namespace TuitionPlatform.Application.Validators;

public class CreateTuitionPostRequestValidator : AbstractValidator<CreateTuitionPostRequest>
{
    public CreateTuitionPostRequestValidator()
    {
        RuleFor(x => x.Subject).NotEmpty();
        RuleFor(x => x.ClassLevel).NotEmpty();
        RuleFor(x => x.City).NotEmpty();
        RuleFor(x => x.Area).NotEmpty();
        RuleFor(x => x.Mode).NotEmpty();
        RuleFor(x => x.Budget).GreaterThan(0);
    }
}

