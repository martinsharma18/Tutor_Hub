using TuitionPlatform.Application.Common.Models;
using TuitionPlatform.Application.DTOs.TuitionPosts;

namespace TuitionPlatform.Application.Interfaces.Services;

public interface ITuitionPostService
{
    Task<TuitionPostDto> CreateAsync(Guid userId, CreateTuitionPostRequest request, CancellationToken cancellationToken = default);

    Task<TuitionPostDto> ApproveAsync(Guid adminUserId, Guid postId, CancellationToken cancellationToken = default);

    Task<TuitionPostDto> UpdateStatusAsync(Guid userId, Guid postId, UpdateTuitionPostStatusRequest request, CancellationToken cancellationToken = default);

    Task<PagedResult<TuitionPostDto>> GetMyPostsAsync(Guid userId, PagedRequest request, CancellationToken cancellationToken = default);

    Task<PagedResult<TuitionPostDto>> GetOpenPostsAsync(PagedRequest request, CancellationToken cancellationToken = default);

    Task<PagedResult<TuitionPostDto>> GetPendingPostsAsync(PagedRequest request, CancellationToken cancellationToken = default);

    Task<PagedResult<TuitionPostDto>> GetAllPostsAsync(PagedRequest request, CancellationToken cancellationToken = default);
}

