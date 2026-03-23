using TuitionPlatform.Application.DTOs.Search;

namespace TuitionPlatform.Application.Interfaces.Services;

public interface ISearchService
{
    Task<TeacherSearchResponse> SearchTeachersAsync(TeacherSearchRequest request, CancellationToken cancellationToken = default);
}

