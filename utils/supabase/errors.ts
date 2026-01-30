import { AuthError } from "@supabase/supabase-js";

export function getAuthErrorMessage(error: AuthError | null): string {
    if (!error) return "An unexpected error occurred.";

    // Use error code if available
    if (error.code) {
        switch (error.code) {
            case "invalid_credentials":
                return "Invalid email or password. Please try again.";
            case "user_not_found":
                return "No account found with this email address.";
            case "email_not_confirmed":
                return "Please confirm your email address before logging in.";
            case "email_exists":
            case "user_already_exists":
                return "An account with this email already exists.";
            case "over_request_rate_limit":
            case "over_email_send_rate_limit":
                return "Too many attempts. Please try again later.";
            case "weak_password":
                return "Password is too weak. It should be at least 8 characters and include a mix of letters, numbers, and symbols.";
            case "otp_expired":
                return "The password reset link has expired. Please request a new one.";
            case "otp_disabled":
                return "Sign in with OTP is disabled.";
            case "bad_json":
                return "An error occurred while processing your request (Bad JSON).";
            case "bad_jwt":
                return "Your session is invalid. Please sign in again.";
            case "session_expired":
                return "Your session has expired. Please sign in again.";
            case "service_unavailable":
            case "database_error":
            case "unexpected_failure":
                return "Service is temporarily unavailable. Please try again later.";
            case "validation_failed":
                return "Please check your input and try again.";
            // Add more codes as needed based on the comprehensive list
            default:
                // Use the original message if it's not one of the codes we strictly map, 
                // or fall back to a generic message if even that is missing.
                break;
        }
    }

    // Fallback for string matching if code is missing (some older Supabase errors or edge cases)
    const message = error.message.toLowerCase();

    if (message.includes("invalid login") || message.includes("invalid credentials")) {
        return "Invalid email or password.";
    }
    if (message.includes("email not confirmed")) {
        return "Please confirm your email before logging in.";
    }
    if (message.includes("user already registered") || message.includes("already registered")) {
        return "An account with this email already exists.";
    }
    if (message.includes("rate limit") || message.includes("too many")) {
        return "Too many attempts. Please try again later.";
    }
    if (message.includes("password should be at least")) {
        return "Password must be at least 8 characters long.";
    }

    // If we really don't know what it is, but it has a message, return it? 
    // Or return 'Something went wrong'.
    return error.message || "An unexpected error occurred.";
}
