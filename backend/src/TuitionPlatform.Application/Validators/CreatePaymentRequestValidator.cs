using FluentValidation;
using TuitionPlatform.Application.DTOs.Payments;

namespace TuitionPlatform.Application.Validators;

public class CreatePaymentRequestValidator : AbstractValidator<CreatePaymentRequest>
{
    public CreatePaymentRequestValidator()
    {
        RuleFor(x => x.TuitionPostId).NotEmpty();
        RuleFor(x => x.TeacherId).NotEmpty();
        RuleFor(x => x.Amount).GreaterThan(0);
    }
}

