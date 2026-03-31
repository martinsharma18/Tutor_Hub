using AutoMapper;
using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.DTOs.Demo;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Application.Services.Demo;

public class DemoService : IDemoService
{
    private readonly IUserRepository _userRepository;
    private readonly ITeacherProfileRepository _teacherProfileRepository;
    private readonly ITuitionPostRepository _tuitionPostRepository;
    private readonly IDemoRequestRepository _demoRequestRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public DemoService(
        IUserRepository userRepository,
        ITeacherProfileRepository teacherProfileRepository,
        ITuitionPostRepository tuitionPostRepository,
        IDemoRequestRepository demoRequestRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _teacherProfileRepository = teacherProfileRepository;
        _tuitionPostRepository = tuitionPostRepository;
        _demoRequestRepository = demoRequestRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<DemoRequestDto> CreateAsync(Guid parentUserId, CreateDemoRequestDto request, CancellationToken cancellationToken = default)
    {
        throw new NotSupportedException("Demo requests are currently disabled as Parent features have been removed.");
    }

    public async Task<DemoRequestDto> UpdateStatusAsync(Guid userId, Guid demoId, UpdateDemoStatusRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken) ?? throw new NotFoundException("User", userId);

        var demo = await _demoRequestRepository.GetByIdAsync(demoId, cancellationToken)
                   ?? throw new NotFoundException("Demo request", demoId);

        if (!Enum.TryParse<DemoStatus>(request.Status, true, out var status))
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                ["status"] = new[] { "Invalid demo status." }
            });
        }

        if (user.Role == UserRole.Teacher)
        {
            var teacherProfile = await _teacherProfileRepository.GetByUserIdAsync(userId, cancellationToken)
                                  ?? throw new NotFoundException("Teacher profile", userId);
            if (teacherProfile.Id != demo.TeacherProfileId)
            {
                throw new ForbiddenException("You cannot modify this demo request.");
            }
        }
        else if (user.Role == UserRole.Admin)
        {
            // Admins can update status
        }
        else
        {
            throw new ForbiddenException("Only admins or teachers can update demo requests.");
        }

        demo.Status = status;
        demo.Notes = request.Notes;
        _demoRequestRepository.Update(demo);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<DemoRequestDto>(demo);
    }

    public async Task<IReadOnlyCollection<DemoRequestDto>> GetParentRequestsAsync(Guid parentUserId, CancellationToken cancellationToken = default)
    {
        return Array.Empty<DemoRequestDto>();
    }

    public async Task<IReadOnlyCollection<DemoRequestDto>> GetTeacherRequestsAsync(Guid teacherUserId, CancellationToken cancellationToken = default)
    {
        var teacherProfile = await _teacherProfileRepository.GetByUserIdAsync(teacherUserId, cancellationToken)
                                ?? throw new NotFoundException("Teacher profile", teacherUserId);

        var demos = await _demoRequestRepository.GetTeacherRequestsAsync(teacherProfile.Id, cancellationToken);
        return demos.Select(_mapper.Map<DemoRequestDto>).ToList();
    }
}
