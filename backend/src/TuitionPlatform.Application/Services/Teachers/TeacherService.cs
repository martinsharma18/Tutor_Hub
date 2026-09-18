using AutoMapper;
using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.DTOs.Teachers;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Application.Services.Teachers;

public class TeacherService : ITeacherService
{
    private readonly IUserRepository _userRepository;
    private readonly ITeacherProfileRepository _teacherProfileRepository;
    private readonly ITuitionPostRepository _tuitionPostRepository;
    private readonly ITeacherApplicationRepository _applicationRepository;
    private readonly IReviewRepository _reviewRepository;
    private readonly INotificationService _notificationService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public TeacherService(
        IUserRepository userRepository,
        ITeacherProfileRepository teacherProfileRepository,
        ITuitionPostRepository tuitionPostRepository,
        ITeacherApplicationRepository applicationRepository,
        IReviewRepository reviewRepository,
        INotificationService notificationService,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _teacherProfileRepository = teacherProfileRepository;
        _tuitionPostRepository = tuitionPostRepository;
        _applicationRepository = applicationRepository;
        _reviewRepository = reviewRepository;
        _notificationService = notificationService;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<TeacherProfileDto> GetProfileAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var profile = await GetTeacherProfileAsync(userId, cancellationToken);
        var dto = _mapper.Map<TeacherProfileDto>(profile);

        var ratings = await _reviewRepository.GetRatingSummariesAsync(new[] { profile.Id }, cancellationToken);
        if (ratings.TryGetValue(profile.Id, out var summary))
        {
            dto.AverageRating = summary.AverageRating;
            dto.ReviewCount = summary.ReviewCount;
        }

        return dto;
    }

    public async Task<TeacherProfileDto> UpdateProfileAsync(Guid userId, UpdateTeacherProfileRequest request, CancellationToken cancellationToken = default)
    {
        var profile = await GetTeacherProfileAsync(userId, cancellationToken);

        if (request.Bio is not null) profile.Bio = request.Bio;
        if (request.Qualification is not null) profile.Qualification = request.Qualification;
        if (request.ExperienceSummary is not null) profile.ExperienceSummary = request.ExperienceSummary;
        if (request.YearsOfExperience.HasValue) profile.YearsOfExperience = request.YearsOfExperience.Value;
        if (request.Subjects is not null) profile.Subjects = request.Subjects;
        if (request.Classes is not null) profile.Classes = request.Classes;
        if (request.PreferredMode is not null && Enum.TryParse<TeachingMode>(request.PreferredMode, true, out var mode))
        {
            profile.PreferredMode = mode;
        }

        if (request.City is not null) profile.City = request.City;
        if (request.Area is not null) profile.Area = request.Area;
        if (request.Latitude.HasValue) profile.Latitude = request.Latitude;
        if (request.Longitude.HasValue) profile.Longitude = request.Longitude;
        if (request.HourlyRate.HasValue) profile.HourlyRate = request.HourlyRate;
        if (request.CvUrl is not null) profile.CvUrl = request.CvUrl;
        if (request.PhotoUrl is not null) profile.PhotoUrl = request.PhotoUrl;

        _teacherProfileRepository.Update(profile);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<TeacherProfileDto>(profile);
    }

    public async Task<TeacherApplicationDto> ApplyToPostAsync(Guid userId, CreateTeacherApplicationRequest request, CancellationToken cancellationToken = default)
    {
        var profile = await GetTeacherProfileAsync(userId, cancellationToken);

        if (!profile.IsApproved)
        {
            throw new ForbiddenException("Your profile must be approved by an admin before you can apply to vacancies.");
        }

        var post = await _tuitionPostRepository.GetByIdAsync(request.TuitionPostId, cancellationToken)
                   ?? throw new NotFoundException("Tuition Post", request.TuitionPostId);

        if (post.Status != TuitionPostStatus.Approved && post.Status != TuitionPostStatus.Open)
        {
            throw new ForbiddenException("You can only apply to approved or open posts.");
        }

        var existingApplications = await _applicationRepository.GetByTeacherIdAsync(profile.Id, cancellationToken);
        if (existingApplications.Any(a => a.TuitionPostId == post.Id))
        {
            throw new ForbiddenException("You have already applied to this post.");
        }

        var application = new Domain.Entities.TeacherApplication
        {
            TeacherProfileId = profile.Id,
            TuitionPostId = post.Id,
            Message = request.Message,
            Status = ApplicationStatus.Pending
        };

        await _applicationRepository.AddAsync(application, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await _notificationService.NotifyAsync(
            post.CreatedByUserId,
            "ApplicationReceived",
            "New application received",
            $"A teacher applied to your \"{post.Subject}\" vacancy.",
            $"/parent/posts/{post.Id}/applications",
            cancellationToken);

        return _mapper.Map<TeacherApplicationDto>(application);
    }

    // GetMyApplicationsAsync intentionally lives on IApplicationWorkflowService, not here — that
    // is the only implementation that applies ContactVisibility masking to the parent's phone
    // number. A duplicate here previously bypassed the commission paywall entirely.

    private async Task<Domain.Entities.TeacherProfile> GetTeacherProfileAsync(Guid userId, CancellationToken cancellationToken)
    {
        var profile = await _teacherProfileRepository.GetByUserIdAsync(userId, cancellationToken);
        if (profile is null)
        {
            throw new NotFoundException("Teacher profile", userId);
        }

        return profile;
    }
}

