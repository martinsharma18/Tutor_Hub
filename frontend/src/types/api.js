// Type definitions for reference (JavaScript doesn't enforce these)
// UserRole: "Admin" | "Parent" | "Teacher"

// ApiUser shape:
// {
//   id: string,
//   email: string,
//   fullName: string,
//   role: UserRole,
//   emailVerified: boolean
// }

// AuthResponse shape:
// {
//   accessToken: string,
//   refreshToken: string,
//   expiresAtUtc: string,
//   user: ApiUser
// }

// Export constants for role checking
export const UserRole = {
  Admin: "Admin",
  Parent: "Parent",
  Teacher: "Teacher",
};

