using AutoMapper;
using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.DTOs.Reviews;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Application.Services.Reviews;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepository;
    private readonly ITuitionPostRepository _tuitionPostRepository;
    private readonly ITeacherApplicationRepository _applicationRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ReviewService(
        IReviewRepository reviewRepository,
        ITuitionPostRepository tuitionPostRepository,
        ITeacherApplicationRepository applicationRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _reviewRepository = reviewRepository;
        _tuitionPostRepository = tuitionPostRepository;
        _applicationRepository = applicationRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ReviewDto> CreateAsync(Guid reviewerUserId, CreateReviewRequest request, CancellationToken cancellationToken = default)
    {
        var post = await _tuitionPostRepository.GetByIdAsync(request.TuitionPostId, cancellationToken)
                   ?? throw new NotFoundException("Tuition post", request.TuitionPostId);

        if (post.CreatedByUserId != reviewerUserId)
        {
            throw new ForbiddenException("You can only review teachers hired for your own vacancy.");
        }

        // Reviewing is gated on an actual Hired application for this post — prevents drive-by
        // reviews of teachers the reviewer never actually engaged.
        var applications = await _applicationRepository.GetByPostIdAsync(post.Id, cancellationToken);
        var hired = applications.FirstOrDefault(a => a.Status == ApplicationStatus.Hired)
                    ?? throw new ForbiddenException("You can only review a teacher after hiring them for this vacancy.");

        if (await _reviewRepository.ExistsAsync(reviewerUserId, post.Id, cancellationToken))
        {
            throw new ForbiddenException("You have already reviewed this vacancy.");
        }

        var review = new Review
        {
            ReviewerUserId = reviewerUserId,
            TeacherProfileId = hired.TeacherProfileId,
            TuitionPostId = post.Id,
            Rating = request.Rating,
            Comment = request.Comment
        };

        await _reviewRepository.AddAsync(review, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<ReviewDto>(review);
    }

    public async Task<TeacherRatingSummaryDto> GetForTeacherAsync(Guid teacherProfileId, CancellationToken cancellationToken = default)
    {
        var reviews = await _reviewRepository.GetByTeacherIdAsync(teacherProfileId, cancellationToken);
        var dtos = reviews.Select(_mapper.Map<ReviewDto>).ToList();

        return new TeacherRatingSummaryDto
        {
            AverageRating = dtos.Count > 0 ? Math.Round(dtos.Average(r => r.Rating), 1) : 0,
            ReviewCount = dtos.Count,
            Reviews = dtos
        };
    }
}
