using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TuitionPlatform.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPerformanceIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_TuitionPosts_CreatedAtUtc",
                table: "TuitionPosts",
                column: "CreatedAtUtc");

            migrationBuilder.CreateIndex(
                name: "IX_TuitionPosts_CreatedByUserId",
                table: "TuitionPosts",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_TuitionPosts_Status",
                table: "TuitionPosts",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_TeacherProfiles_City_Area",
                table: "TeacherProfiles",
                columns: new[] { "City", "Area" });

            migrationBuilder.CreateIndex(
                name: "IX_TeacherProfiles_IsApproved",
                table: "TeacherProfiles",
                column: "IsApproved");

            migrationBuilder.CreateIndex(
                name: "IX_TeacherApplications_Status",
                table: "TeacherApplications",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_Status",
                table: "Payments",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TuitionPosts_CreatedAtUtc",
                table: "TuitionPosts");

            migrationBuilder.DropIndex(
                name: "IX_TuitionPosts_CreatedByUserId",
                table: "TuitionPosts");

            migrationBuilder.DropIndex(
                name: "IX_TuitionPosts_Status",
                table: "TuitionPosts");

            migrationBuilder.DropIndex(
                name: "IX_TeacherProfiles_City_Area",
                table: "TeacherProfiles");

            migrationBuilder.DropIndex(
                name: "IX_TeacherProfiles_IsApproved",
                table: "TeacherProfiles");

            migrationBuilder.DropIndex(
                name: "IX_TeacherApplications_Status",
                table: "TeacherApplications");

            migrationBuilder.DropIndex(
                name: "IX_Payments_Status",
                table: "Payments");
        }
    }
}
