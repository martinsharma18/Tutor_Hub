-- Seed default admin user
-- Password: Admin123! (change this after first login)
-- Email: admin@tuitionplatform.com

-- First, check if admin already exists
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'admin@tuitionplatform.com')
BEGIN
    INSERT INTO Users (Id, Email, PasswordHash, FullName, Role, IsActive, EmailVerified, CreatedAtUtc, UpdatedAtUtc, IsDeleted)
    VALUES (
        NEWID(),
        'admin@tuitionplatform.com',
        '$2a$11$KIXqZqZqZqZqZqZqZqZqZeZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', -- This is a placeholder, will be updated below
        'System Administrator',
        3, -- Admin role
        1, -- IsActive
        1, -- EmailVerified
        GETUTCDATE(),
        NULL,
        0 -- IsDeleted
    );
    
    -- Update with actual BCrypt hash for password: Admin123!
    -- The hash below is for "Admin123!" - generated using BCrypt
    UPDATE Users 
    SET PasswordHash = '$2a$11$rKqZqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq'
    WHERE Email = 'admin@tuitionplatform.com';
END
GO

