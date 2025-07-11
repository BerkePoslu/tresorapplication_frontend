# Backend reCAPTCHA Validation Implementation

## Overview

This implementation adds secure server-side reCAPTCHA validation to the Tresor application, ensuring that bot protection cannot be bypassed by malicious clients.

## Features

### Backend Implementation

- **Secure Server-Side Validation**: reCAPTCHA tokens are validated on the backend using Google's verification API
- **IP Address Tracking**: Client IP addresses are captured and sent to Google for enhanced security
- **Configurable Settings**: Enable/disable reCAPTCHA validation and configure secret keys via environment variables
- **Error Handling**: Comprehensive error handling with detailed logging
- **Timeout Protection**: 5-second timeout for reCAPTCHA API calls to prevent hanging requests

### Integration Points

- **User Registration**: reCAPTCHA validation required for new user accounts
- **Forgot Password**: reCAPTCHA validation required for password reset requests
- **Extensible**: Easy to add to other endpoints as needed

## Implementation Details

### Backend Components

#### 1. Dependencies Added

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

#### 2. Service Layer

- **RecaptchaService**: Interface for reCAPTCHA validation
- **RecaptchaServiceImpl**: Implementation using WebClient for HTTP requests

#### 3. Controller Updates

- **UserController**: Updated with reCAPTCHA validation for registration and forgot password endpoints
- **IP Address Extraction**: Helper method to extract client IP addresses from requests

#### 4. Model Updates

- **ForgotPasswordRequest**: Added `recaptchaToken` field
- **RegisterUser**: Already had `recaptchaToken` field

### Configuration

#### application.properties

```properties
# reCAPTCHA Configuration
recaptcha.secret-key=${RECAPTCHA_SECRET_KEY:6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe}
recaptcha.enabled=${RECAPTCHA_ENABLED:true}
```

#### Environment Variables

- `RECAPTCHA_SECRET_KEY`: Your Google reCAPTCHA secret key
- `RECAPTCHA_ENABLED`: Enable/disable reCAPTCHA validation (true/false)

## Setup Instructions

### 1. Google reCAPTCHA Setup

1. **Create reCAPTCHA Keys**:

   - Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
   - Create a new site
   - Choose reCAPTCHA v2 "I'm not a robot" checkbox
   - Add your domain (localhost for development)
   - Get your Site Key and Secret Key

2. **Configure Keys**:
   - **Site Key**: Already configured in frontend (`6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI` for testing)
   - **Secret Key**: Set in environment variable or application.properties

### 2. Environment Configuration

#### Development (application.properties)

```properties
recaptcha.secret-key=YOUR_SECRET_KEY_HERE
recaptcha.enabled=true
```

#### Production (Environment Variables)

```bash
export RECAPTCHA_SECRET_KEY=your_production_secret_key
export RECAPTCHA_ENABLED=true
```

#### Testing/Development (Disable reCAPTCHA)

```bash
export RECAPTCHA_ENABLED=false
```

### 3. Frontend Updates

The frontend has been updated to send reCAPTCHA tokens to the backend:

- **RegisterUser component**: Sends `recaptchaToken` with registration data
- **ForgotPassword component**: Sends `recaptchaToken` with email
- **API calls**: Updated to include reCAPTCHA tokens in request bodies

## API Documentation

### Updated Endpoints

#### User Registration

```http
POST /api/users
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirmation": "password123",
  "recaptchaToken": "03AGdBq24..."
}
```

#### Forgot Password

```http
POST /api/users/forgot-password
Content-Type: application/json

{
  "email": "john@example.com",
  "recaptchaToken": "03AGdBq24..."
}
```

### Response Codes

#### Success

- `200 OK`: Request processed successfully
- `202 Accepted`: User created successfully

#### Error Responses

- `400 Bad Request`: reCAPTCHA validation failed

```json
{
  "message": "reCAPTCHA validation failed"
}
```

## Security Features

### Server-Side Validation

- **Token Verification**: All reCAPTCHA tokens are verified server-side with Google's API
- **IP Validation**: Client IP addresses are included in verification requests
- **Timeout Protection**: 5-second timeout prevents hanging on Google's API
- **Error Handling**: Graceful handling of network failures and invalid tokens

### Configuration Security

- **Environment Variables**: Secret keys stored as environment variables
- **Development Mode**: Can disable reCAPTCHA for testing
- **Logging**: Detailed security logging for monitoring

### Client IP Detection

```java
private String getClientIpAddress(HttpServletRequest request) {
    String xForwardedForHeader = request.getHeader("X-Forwarded-For");
    if (xForwardedForHeader == null || xForwardedForHeader.isEmpty()) {
        return request.getRemoteAddr();
    } else {
        return xForwardedForHeader.split(",")[0].trim();
    }
}
```

## Testing

### Manual Testing

1. **Valid reCAPTCHA**:

   - Complete reCAPTCHA on frontend
   - Submit form
   - Verify success response

2. **Invalid reCAPTCHA**:

   - Skip reCAPTCHA or use invalid token
   - Submit form
   - Verify error response

3. **Disabled reCAPTCHA**:
   - Set `recaptcha.enabled=false`
   - Submit without reCAPTCHA
   - Verify success (for testing only)

### Development Testing

For development, you can use Google's test keys:

- **Site Key**: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- **Secret Key**: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

These keys always pass validation in test mode.

## Logging

### Log Levels

```properties
logging.level.ch.bbw.pr.tresorbackend.service.impl.RecaptchaServiceImpl=DEBUG
```

### Log Messages

- `INFO`: "reCAPTCHA validation successful"
- `WARN`: "reCAPTCHA validation failed with error codes: [...]"
- `ERROR`: "Error during reCAPTCHA validation"

## Error Handling

### Common Errors

1. **Missing Token**:

   - Error: "reCAPTCHA token is null or empty"
   - Solution: Ensure frontend sends token

2. **Invalid Secret Key**:

   - Error: "reCAPTCHA secret key is not configured"
   - Solution: Set `RECAPTCHA_SECRET_KEY` environment variable

3. **Network Timeout**:

   - Error: "Error during reCAPTCHA validation"
   - Solution: Check network connectivity to Google APIs

4. **Invalid Token**:
   - Error: "reCAPTCHA validation failed"
   - Solution: User must complete reCAPTCHA again

## Troubleshooting

### Common Issues

1. **reCAPTCHA Always Fails**:

   - Check secret key configuration
   - Verify site key matches in frontend
   - Check domain configuration in Google Console

2. **Network Errors**:

   - Verify internet connectivity
   - Check firewall settings
   - Test with `curl` to Google's API

3. **Development Issues**:
   - Use test keys for development
   - Set `recaptcha.enabled=false` for testing
   - Check logs for detailed error messages

### Debug Commands

Test reCAPTCHA API directly:

```bash
curl -X POST https://www.google.com/recaptcha/api/siteverify \
  -d "secret=YOUR_SECRET_KEY" \
  -d "response=RECAPTCHA_TOKEN"
```

## Production Considerations

### Security

- **Never expose secret keys** in client-side code
- **Use environment variables** for secret key storage
- **Monitor logs** for validation failures
- **Rate limiting** may be needed for high-traffic applications

### Performance

- **5-second timeout** prevents hanging requests
- **Async processing** using WebClient for better performance
- **Caching** could be implemented for repeated validations (not recommended for security)

### Monitoring

- **Log all validation attempts** for security monitoring
- **Track validation failure rates** to detect attacks
- **Monitor API response times** to Google's service

## Future Enhancements

### Potential Improvements

1. **Rate Limiting**: Limit reCAPTCHA requests per IP
2. **Custom Error Messages**: More user-friendly error messages
3. **reCAPTCHA v3**: Upgrade to score-based validation
4. **Fallback Validation**: Alternative bot protection methods
5. **Admin Dashboard**: Monitor reCAPTCHA statistics

### Additional Integration Points

1. **Login Protection**: Add reCAPTCHA to login after failed attempts
2. **Comment Systems**: Protect user-generated content
3. **Contact Forms**: Protect contact/support forms
4. **API Rate Limiting**: Integrate with rate limiting systems

This implementation provides robust, server-side reCAPTCHA validation that significantly enhances the security of the Tresor application by preventing automated bot attacks on user registration and password reset functionality.
