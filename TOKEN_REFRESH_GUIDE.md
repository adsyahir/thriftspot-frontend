# JWT Token Refresh Implementation

## Overview
The token refresh mechanism has been implemented to automatically renew access tokens before they expire, providing a seamless user experience.

## When Token Refresh Happens

### 1. **Proactive Refresh (Before Expiration)**
- **Trigger**: Before every API request
- **Condition**: Token expires within 5 minutes
- **Location**: `app/plugins/api.ts:100`
- **Behavior**:
  - Checks token expiry before making any API call
  - If token expires in < 5 minutes, refreshes automatically
  - User never experiences session interruption

```typescript
if (isTokenExpiringSoon(userStore.token) && !isRefreshing) {
  isRefreshing = true
  const newToken = await refreshAccessToken()
  isRefreshing = false
}
```

### 2. **Reactive Refresh (On 401 Error)**
- **Trigger**: When API returns 401 Unauthorized
- **Location**: `app/plugins/api.ts:143`
- **Behavior**:
  - Intercepts 401 errors
  - Attempts to refresh token
  - Retries original failed request with new token
  - Queues multiple requests if they arrive during refresh

```typescript
if (error.response.status === 401 && !originalRequest._retry) {
  const newToken = await refreshAccessToken()
  if (newToken) {
    originalRequest.headers.Authorization = `Bearer ${newToken}`
    return api(originalRequest) // Retry original request
  }
}
```

### 3. **On App Initialization**
- **Trigger**: When user opens/refreshes the app
- **Location**: `app/stores/user.ts:77`
- **Behavior**:
  - Checks if stored token is expired
  - Clears session if expired
  - User redirected to login if needed

## Token Configuration

### Current Settings (Backend)
- **Access Token TTL**: 60 minutes (1 hour)
- **Refresh Token TTL**: 20,160 minutes (14 days)
- **Config File**: `thriftspot-backend/config/jwt.php`

### Recommended Settings for Better Security

```env
# Short-lived access token (15 minutes)
JWT_TTL=15

# Long-lived refresh token (7 days)
JWT_REFRESH_TTL=10080
```

## How It Works

### Request Flow with Automatic Refresh

```
User makes API request
    ↓
Request Interceptor checks token
    ↓
Is token expiring soon? (< 5 min)
    ↓ YES
Refresh token automatically
    ↓
Update Authorization header
    ↓
Proceed with request
    ↓
SUCCESS ✅


Alternative Flow (Token Already Expired):

User makes API request
    ↓
Request sent with expired token
    ↓
Backend returns 401 Unauthorized
    ↓
Response Interceptor catches 401
    ↓
Attempt token refresh
    ↓ SUCCESS
Retry original request with new token
    ↓
SUCCESS ✅

    ↓ FAILURE (refresh token expired)
Clear user session
    ↓
Redirect to login page
```

## Request Queuing During Refresh

When multiple requests happen simultaneously while refreshing:

```typescript
// Queue requests that arrive during refresh
if (isRefreshing) {
  return new Promise((resolve) => {
    subscribeTokenRefresh((token: string) => {
      originalRequest.headers.Authorization = `Bearer ${token}`
      resolve(api(originalRequest))
    })
  })
}
```

**Benefits**:
- Prevents multiple simultaneous refresh calls
- All queued requests retry automatically after refresh
- Maintains app responsiveness

## Security Features

### 1. **Single Refresh Lock**
```typescript
let isRefreshing = false
```
Prevents race conditions from multiple refresh attempts.

### 2. **Request Retry Limit**
```typescript
originalRequest._retry = true
```
Each request only retries once to avoid infinite loops.

### 3. **Automatic Logout on Refresh Failure**
```typescript
if (originalRequest.url?.includes('/auth/refresh')) {
  userStore.clearUser()
  navigateTo('/auth/signin')
}
```

### 4. **Skip Auth Endpoints**
```typescript
if (config.url?.includes('/auth/login') || config.url?.includes('/auth/register')) {
  return config
}
```
Login and registration don't require token checks.

## Testing the Implementation

### Test Scenario 1: Proactive Refresh
1. Login to the app
2. Wait 55 minutes (or modify `fiveMinutes` constant to 55 minutes for testing)
3. Make any API request
4. Check browser console: You should see "🔄 Refreshing access token..."
5. Request completes successfully with new token

### Test Scenario 2: Reactive Refresh
1. Login to the app
2. Manually delete/corrupt the token in localStorage
3. Make any API request
4. System detects 401 error
5. Attempts refresh
6. Either succeeds or redirects to login

### Test Scenario 3: Multiple Concurrent Requests
1. Login to the app
2. Make multiple API requests simultaneously when token is about to expire
3. Only one refresh call is made
4. All requests wait and retry with new token

## Backend Endpoint

The refresh endpoint is already implemented:

**Endpoint**: `POST /api/auth/refresh`
**Controller**: `AuthController@refresh` (line 66-69)
**Authentication**: Requires valid (but possibly expired) JWT token

```php
public function refresh(): JsonResponse
{
    return $this->respondWithToken(auth()->refresh());
}
```

## Monitoring and Debugging

Enable development logging to see refresh activity:

```javascript
console.log('🔄 Refreshing access token...')  // Refresh started
console.log('✅ Token refreshed successfully') // Refresh succeeded
console.error('❌ Token refresh failed')       // Refresh failed
console.error('🚫 Refresh token invalid')      // Logout triggered
```

## Next Steps for Enhanced Security

1. **Implement Refresh Token Rotation** - Issue new refresh token on each refresh
2. **Add Device Fingerprinting** - Track sessions per device
3. **Implement Token Blacklist** - Revoke tokens on logout
4. **Add Session Management** - Allow users to view/revoke active sessions
5. **Shorten Access Token TTL** - Reduce to 15 minutes for better security

## Summary

✅ **Proactive refresh** - Tokens refresh before expiry (5 min buffer)
✅ **Reactive refresh** - Handles 401 errors gracefully
✅ **Request queuing** - Multiple requests handled during refresh
✅ **Automatic logout** - Clears session when refresh fails
✅ **No user interruption** - Seamless experience
