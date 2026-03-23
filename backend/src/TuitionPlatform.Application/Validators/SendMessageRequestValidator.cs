using FluentValidation;
using TuitionPlatform.Application.DTOs.Messages;

namespace TuitionPlatform.Application.Validators;

public class SendMessageRequestValidator : AbstractValidator<SendMessageRequest>
{
    public SendMessageRequestValidator()
    {
        RuleFor(x => x.ReceiverId).NotEmpty();
        RuleFor(x => x.Body).NotEmpty().MaximumLength(2000);
    }
}

