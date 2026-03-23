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
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public TeacherService(
        IUserRepository userRepository,
        ITeacherProfileRepository teacherProfileRepository,
        ITuitionPostRepository tuitionPostRepository,
        ITeacherApplicationRepository applicationRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _teacherProfileRepository = teacherProfileRepository;
        _tuitionPostRepository = tuitionPostRepository;
        _applicationRepository = applicationRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<TeacherProfileDto> GetProfileAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var profile = await GetTeacherProfileAsync(userId, cancellationToken);
        return _mapper.Map<TeacherProfileDto>(profile);
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

        _teacherProfileRepository.Update(profile);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<TeacherProfileDto>(profile);
    }

    public async Task<TeacherApplicationDto> ApplyToPostAsync(Guid userId, CreateTeacherApplicationRequest request, CancellationToken cancellationToken = default)
    {
        var profile = await GetTeacherProfileAsync(userId, cancellationToken);

        var post = await _tuitionPostRepository.GetByIdAsync(request.TuitionPostId, cancellationToken)
                   ?? throw new NotFoundException("Tuition Post", request.TuitionPostId);

        if (post.Status is not TuitionPostStatus.Approved and not TuitionPostStatus.Open)
        {
            throw new ForbiddenException("You can only apply to approved or open posts.");
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

        return _mapper.Map<TeacherApplicationDto>(application);
    }

    public async Task<IReadOnlyCollection<TeacherApplicationDto>> GetMyApplicationsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var profile = await GetTeacherProfileAsync(userId, cancellationToken);
        var applications = await _applicationRepository.GetByTeacherIdAsync(profile.Id, cancellationToken);
        return applications.Select(_mapper.Map<TeacherApplicationDto>).ToList();
    }

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

