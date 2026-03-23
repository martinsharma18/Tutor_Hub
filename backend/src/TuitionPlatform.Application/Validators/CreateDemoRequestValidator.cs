using FluentValidation;
using TuitionPlatform.Application.DTOs.Demo;

namespace TuitionPlatform.Application.Validators;

public class CreateDemoRequestValidator : AbstractValidator<CreateDemoRequestDto>
{
    public CreateDemoRequestValidator()
    {
        RuleFor(x => x.TeacherProfileId).NotEmpty();
        RuleFor(x => x.TuitionPostId).NotEmpty();
        RuleFor(x => x.SelectedDate).NotEmpty();
        RuleFor(x => x.SelectedTime).NotEmpty();
    }
}

