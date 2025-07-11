# Forgot Password Implementation

## Overview

This implementation adds comprehensive forgot password functionality to the Tresor application with email-based password reset tokens, validation, and security measures.

## Features

### Backend Features

- **Secure Token Generation**: UUID-based password reset tokens with 1-hour expiration
- **Email Integration**: Automated password reset emails via Spring Mail
- **Validation**: Comprehensive input validation with proper error handling
- **Security**: Tokens are automatically cleared after successful password reset
- **Database Updates**: New fields added to User model for token storage

### Frontend Features

- **Forgot Password Form**: User-friendly form with reCAPTCHA protection
- **Reset Password Form**: Token-based password reset with validation
- **Navigation Integration**: Links added to login page and navigation menu
- **Responsive Design**: Consistent styling with existing application
- **User Feedback**: Clear success/error messages and loading states

## Implementation Details

### Backend Components

#### 1. Model Updates

- **User.java**: Added `passwordResetToken` and `passwordResetTokenExpiry` fields
- **ForgotPasswordRequest.java**: DTO for forgot password requests
- **ResetPasswordRequest.java**: DTO for password reset with validation

#### 2. Service Layer

- **EmailService**: Interface and implementation for sending password reset emails
- **UserService**: Extended with password reset methods:
  - `generatePasswordResetToken(email)`
  - `validatePasswordResetToken(token)`
  - `findByPasswordResetToken(token)`
  - `updatePassword(token, newPassword)`

#### 3. Controller Endpoints

- `POST /api/users/forgot-password`: Initiates password reset process
- `POST /api/users/reset-password`: Completes password reset with token

#### 4. Repository Updates

- **UserRepository**: Added `findByPasswordResetToken(token)` method

### Frontend Components

#### 1. React Components

- **ForgotPassword.js**: Form for requesting password reset
- **ResetPassword.js**: Form for setting new password with token
- **LoginUser.js**: Updated with "Forgot Password" link

#### 2. Routing

- `/user/forgot-password`: Forgot password form
- `/user/reset-password?token=<token>`: Reset password form

#### 3. Styling

- **secrets.css**: Added styles for success messages, form links, and buttons

## Setup Instructions

### Backend Configuration

1. **Email Configuration**
   Update `application.properties` with your email settings:

   ```properties
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-app-password
   ```

2. **Environment Variables**
   Set the following environment variables:

   ```bash
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   ```

3. **Database Migration**
   The application will automatically add the new columns:
   - `password_reset_token`
   - `password_reset_token_expiry`

### Frontend Configuration

No additional configuration required. The frontend uses the same API base URL configuration.

## Usage Flow

### For Users

1. **Request Password Reset**

   - Navigate to login page
   - Click "Forgot Password?"
   - Enter email address
   - Complete reCAPTCHA
   - Submit form

2. **Receive Email**

   - Check email for password reset message
   - Copy the provided token

3. **Reset Password**

   - Click the reset link or navigate to reset page
   - Enter the token (auto-filled if using link)
   - Enter new password (min 8 characters)
   - Confirm new password
   - Submit form

4. **Login**
   - Use new password to login

### Email Template

The system sends emails with this format:

```
Subject: Password Reset Request - Tresor Application

Hello,

You have requested to reset your password for the Tresor application.

Please use the following token to reset your password:
[TOKEN]

This token will expire in 1 hour.

If you didn't request this password reset, please ignore this email.

Best regards,
Tresor Application Team
```

## Security Features

### Token Security

- **Unique Tokens**: UUID-based tokens for each request
- **Time-Limited**: 1-hour expiration for all tokens
- **Single Use**: Tokens are cleared after successful password reset
- **Validation**: Comprehensive token validation before password updates

### Input Validation

- **Email Validation**: Proper email format validation
- **Password Strength**: Minimum 8 characters required
- **Password Matching**: Confirmation password must match
- **reCAPTCHA**: Bot protection on forgot password form

### Error Handling

- **Generic Messages**: Same message for valid/invalid emails (prevents user enumeration)
- **Graceful Degradation**: Proper error handling for email failures
- **Logging**: Detailed logging for debugging and monitoring

## API Documentation

### Forgot Password Endpoint

```http
POST /api/users/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "message": "If an account with that email exists, a password reset email has been sent."
}
```

### Reset Password Endpoint

```http
POST /api/users/reset-password
Content-Type: application/json

{
  "token": "uuid-token-here",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response:**

```json
{
  "message": "Password reset successful"
}
```

## Testing

### Manual Testing

1. Register a new user
2. Request password reset
3. Check console/logs for email token (if email not configured)
4. Use token to reset password
5. Login with new password

### Email Testing

For development, you can use:

- **Gmail**: With app-specific passwords
- **Mailhog**: Local email testing server
- **Console Logging**: Token appears in application logs

## Troubleshooting

### Common Issues

1. **Email Not Sending**

   - Check SMTP credentials
   - Verify firewall settings
   - Enable "Less secure app access" for Gmail (or use app passwords)

2. **Token Validation Fails**

   - Check token expiry (1 hour limit)
   - Verify token format in database
   - Check for whitespace in token

3. **Database Errors**
   - Ensure new columns are created
   - Check database connectivity
   - Verify table permissions

### Debugging

- Enable debug logging: `logging.level.ch.bbw.pr.tresorbackend=DEBUG`
- Check email logs: `logging.level.org.springframework.mail=DEBUG`
- Monitor database for token creation/deletion

## Future Enhancements

### Potential Improvements

1. **Rate Limiting**: Limit password reset requests per IP/email
2. **Template Engine**: HTML email templates with better formatting
3. **Multiple Email Providers**: Fallback email services
4. **SMS Reset**: Alternative reset method via SMS
5. **Account Lockout**: Temporary lockout after multiple failed attempts
6. **Admin Dashboard**: View and manage password reset requests

### Configuration Options

1. **Token Expiry**: Configurable expiration time
2. **Email Templates**: Customizable email content
3. **Security Policies**: Configurable password strength requirements
4. **Logging Levels**: Adjustable logging for production/development

## Dependencies

### Backend

- Spring Boot Mail Starter
- Spring Security (for password hashing)
- MariaDB/MySQL Driver
- Lombok
- Jakarta Validation

### Frontend

- React Router DOM
- React Google reCAPTCHA

This implementation provides a secure, user-friendly password reset system that integrates seamlessly with the existing Tresor application architecture.
