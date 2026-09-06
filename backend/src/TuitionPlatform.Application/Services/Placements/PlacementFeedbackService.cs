using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.DTOs.Placements;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Application.Services.Placements;

public class PlacementFeedbackService : IPlacementFeedbackService
{
    private readonly IPlacementFeedbackRepository _feedbackRepository;
    private readonly IPlacementRepository _placementRepository;
    private readonly IUnitOfWork _unitOfWork;

    public PlacementFeedbackService(
        IPlacementFeedbackRepository feedbackRepository,
        IPlacementRepository placementRepository,
        IUnitOfWork unitOfWork)
    {
        _feedbackRepository = feedbackRepository;
        _placementRepository = placementRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<PlacementFeedbackDto> AddAsync(Guid adminUserId, Guid placementId, CreatePlacementFeedbackRequest request, CancellationToken cancellationToken = default)
    {
        var placement = await _placementRepository.GetDetailedByIdAsync(placementId, cancellationToken)
                        ?? throw new NotFoundException("Placement", placementId);

        if (request.Rating < 1 || request.Rating > 5)
        {
            throw new BadRequestException("Rating must be between 1 and 5.");
        }

        var feedback = new PlacementFeedback
        {
            PlacementId = placement.Id,
            CollectedByAdminUserId = adminUserId,
            Rating = request.Rating,
            Notes = request.Notes,
            IsAtRisk = request.IsAtRisk
        };

        await _feedbackRepository.AddAsync(feedback, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Re-read so CollectedByAdminUser is populated for the name in the DTO.
        var saved = await _feedbackRepository.GetByPlacementAsync(placement.Id, cancellationToken);
        return MapToDto(saved.First(f => f.Id == feedback.Id));
    }

    public async Task<IReadOnlyCollection<PlacementFeedbackDto>> GetForPlacementAsync(Guid placementId, CancellationToken cancellationToken = default)
    {
        var feedback = await _feedbackRepository.GetByPlacementAsync(placementId, cancellationToken);
        return feedback.Select(MapToDto).ToList();
    }

    public async Task<IReadOnlyCollection<PlacementFeedbackDto>> GetAtRiskAsync(CancellationToken cancellationToken = default)
    {
        var feedback = await _feedbackRepository.GetAtRiskAsync(cancellationToken);
        return feedback.Select(MapToDto).ToList();
    }

    private static PlacementFeedbackDto MapToDto(PlacementFeedback feedback) => new()
    {
        Id = feedback.Id,
        PlacementId = feedback.PlacementId,
        CollectedByName = feedback.CollectedByAdminUser?.FullName ?? "Admin",
        Rating = feedback.Rating,
        Notes = feedback.Notes,
        IsAtRisk = feedback.IsAtRisk,
        CreatedAtUtc = feedback.CreatedAtUtc
    };
}
