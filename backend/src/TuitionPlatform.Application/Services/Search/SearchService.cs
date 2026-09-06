using TuitionPlatform.Application.Common.Models;
using TuitionPlatform.Application.DTOs.Search;
using TuitionPlatform.Application.DTOs.Teachers;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Application.Services.Search;

public class SearchService : ISearchService
{
    private readonly ITeacherProfileRepository _teacherProfileRepository;
    private readonly IReviewRepository _reviewRepository;
    private readonly AutoMapper.IMapper _mapper;

    public SearchService(ITeacherProfileRepository teacherProfileRepository, IReviewRepository reviewRepository, AutoMapper.IMapper mapper)
    {
        _teacherProfileRepository = teacherProfileRepository;
        _reviewRepository = reviewRepository;
        _mapper = mapper;
    }

    public async Task<TeacherSearchResponse> SearchTeachersAsync(TeacherSearchRequest request, CancellationToken cancellationToken = default)
    {
        var result = await _teacherProfileRepository.SearchAsync(
            request.City,
            request.Area,
            request.Latitude,
            request.Longitude,
            request.RadiusKm,
            request.Subject,
            request.ClassLevel,
            request.Mode,
            request.MinExperience,
            request.Page,
            request.PageSize,
            cancellationToken);

        var ratings = await _reviewRepository.GetRatingSummariesAsync(result.Items.Select(x => x.Teacher.Id).ToList(), cancellationToken);
        var items = result.Items.Select(x =>
        {
            var dto = _mapper.Map<TeacherProfileDto>(x.Teacher);
            dto.DistanceKm = x.DistanceKm.HasValue ? Math.Round(x.DistanceKm.Value, 1) : null;
            if (ratings.TryGetValue(x.Teacher.Id, out var summary))
            {
                dto.AverageRating = summary.AverageRating;
                dto.ReviewCount = summary.ReviewCount;
            }
            return dto;
        }).ToList();

        return new TeacherSearchResponse
        {
            Items = items,
            TotalCount = result.TotalCount,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }
}

