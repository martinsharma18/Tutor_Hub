using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Application.Interfaces.Persistence;

public interface IVerificationTokenRepository : IGenericRepository<VerificationToken>
{
    Task<VerificationToken?> GetValidTokenAsync(string token, VerificationTokenPurpose purpose, CancellationToken cancellationToken = default);
}
