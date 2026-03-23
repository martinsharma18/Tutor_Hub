using TuitionPlatform.Application.Common.Models;
using TuitionPlatform.Application.DTOs.Search;
using TuitionPlatform.Application.DTOs.Teachers;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Application.Services.Search;

public class SearchService : ISearchService
{
    private readonly ITeacherProfileRepository _teacherProfileRepository;
    private readonly AutoMapper.IMapper _mapper;

    public SearchService(ITeacherProfileRepository teacherProfileRepository, AutoMapper.IMapper mapper)
    {
        _teacherProfileRepository = teacherProfileRepository;
        _mapper = mapper;
    }

    public async Task<TeacherSearchResponse> SearchTeachersAsync(TeacherSearchRequest request, CancellationToken cancellationToken = default)
    {
        var teachers = await _teacherProfileRepository.SearchAsync(
            request.City,
            request.Area,
            request.Latitude,
            request.Longitude,
            request.RadiusKm,
            request.Subject,
            request.ClassLevel,
            request.Mode,
            request.MinExperience,
            cancellationToken);

        var filtered = teachers
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(_mapper.Map<TeacherProfileDto>)
            .ToList();

        return new TeacherSearchResponse
        {
            Items = filtered,
            TotalCount = teachers.Count,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }
}

