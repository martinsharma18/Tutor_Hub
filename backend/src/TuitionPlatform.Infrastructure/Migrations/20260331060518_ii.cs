using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TuitionPlatform.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ii : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "CommissionAmount",
                table: "TuitionPosts",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "ParentPhoneNumber",
                table: "TuitionPosts",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsPaymentVerified",
                table: "TeacherApplications",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PaymentReference",
                table: "TeacherApplications",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CommissionAmount",
                table: "TuitionPosts");

            migrationBuilder.DropColumn(
                name: "ParentPhoneNumber",
                table: "TuitionPosts");

            migrationBuilder.DropColumn(
                name: "IsPaymentVerified",
                table: "TeacherApplications");

            migrationBuilder.DropColumn(
                name: "PaymentReference",
                table: "TeacherApplications");
        }
    }
}
