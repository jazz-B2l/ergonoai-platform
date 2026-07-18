export const AUTH_CONSTANTS = {
  PASSWORD: {
    MIN_LENGTH: 12,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
  },
  SESSION: {
    TIMEOUT_HOURS: 24, // Assuming default session timeout is 24 hours if idle
  },
  INVITE: {
    EXPIRATION_DAYS: 7, // Invites expire after 7 days
  },
  RATE_LIMIT: {
    LOGIN_MAX_ATTEMPTS: 5,
    LOGIN_WINDOW_MINUTES: 15,
    RECOVERY_MAX_ATTEMPTS: 3,
    RECOVERY_WINDOW_MINUTES: 60,
    RESEND_VERIFICATION_COOLDOWN_SECONDS: 60,
  },
};
