using TuitionPlatform.Domain.Common;

namespace TuitionPlatform.Domain.Entities;

/// <summary>
/// Admin-editable option for a dropdown/select — one table backing every closed, bounded value
/// set (Gender, Qualification, TeachingMode, ...) instead of hardcoding &lt;option&gt; lists in
/// N different frontend files. NOT for open-ended data like Subject/City: those have real
/// existing free-text values already in TeacherProfile/TuitionPost and need a deliberate,
/// tested data migration before being normalized — out of scope here on purpose.
/// </summary>
public class LookupItem : BaseEntity
{
    // e.g. "Gender", "Qualification", "TeachingMode" — groups rows into one dropdown's options.
    public string Category { get; set; } = string.Empty;

    // Stable machine key stored on the owning record (e.g. TeacherProfile.Gender) — never
    // renamed once in use, unlike Label which is safe to edit freely.
    public string Code { get; set; } = string.Empty;

    public string Label { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    public bool IsActive { get; set; } = true;
}
