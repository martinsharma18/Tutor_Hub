using AutoMapper;
using TuitionPlatform.Application.DTOs.Auth;
using TuitionPlatform.Application.DTOs.Demo;
using TuitionPlatform.Application.DTOs.Payments;
using TuitionPlatform.Application.DTOs.Teachers;
using TuitionPlatform.Application.DTOs.TuitionPosts;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Application.Mapping;

public class ApplicationProfile : Profile
{
    public ApplicationProfile()
    {
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));

        CreateMap<TeacherProfile, TeacherProfileDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.User.FullName))
            .ForMember(dest => dest.PreferredMode, opt => opt.MapFrom(src => src.PreferredMode.ToString()));

        CreateMap<TeacherApplication, TeacherApplicationDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.TeacherProfile.User.FullName))
            .ForMember(dest => dest.TeacherCity, opt => opt.MapFrom(src => src.TeacherProfile.City))
            .ForMember(dest => dest.TeacherUserId, opt => opt.MapFrom(src => src.TeacherProfile.UserId))
            .ForMember(dest => dest.YearsOfExperience, opt => opt.MapFrom(src => src.TeacherProfile.YearsOfExperience))
            .ForMember(dest => dest.PostOwnerId, opt => opt.MapFrom(src => src.TuitionPost.CreatedByUserId))
            .ForMember(dest => dest.PostSubject, opt => opt.MapFrom(src => src.TuitionPost.Subject))
            .ForMember(dest => dest.CreatedAtUtc, opt => opt.MapFrom(src => src.CreatedAtUtc))
            .ForMember(dest => dest.ShortlistedAtUtc, opt => opt.MapFrom(src => src.ShortlistedAtUtc))
            .ForMember(dest => dest.HiredAtUtc, opt => opt.MapFrom(src => src.HiredAtUtc));

        CreateMap<TuitionPost, TuitionPostDto>()
            .ForMember(dest => dest.Mode, opt => opt.MapFrom(src => src.Mode.ToString()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

        CreateMap<DemoRequest, DemoRequestDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

        CreateMap<Payment, PaymentDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
    }
}

