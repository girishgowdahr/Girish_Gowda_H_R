package com.girish.security.api;

import com.girish.security.application.MasterPasswordAuthService;
import com.girish.security.domain.AppUser;
import com.girish.security.infra.SessionAuthenticationFilter;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final MasterPasswordAuthService authService;

    public AuthController(MasterPasswordAuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getAuthStatus() {
        boolean setupRequired = authService.isSetupRequired();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean authenticated = auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof AppUser;

        if (authenticated) {
            AppUser user = (AppUser) auth.getPrincipal();
            return ResponseEntity.ok(Map.of(
                    "authenticated", true,
                    "setupRequired", setupRequired,
                    "user", Map.of(
                            "id", user.getId(),
                            "email", user.getEmail(),
                            "displayName", user.getDisplayName(),
                            "role", user.getRole()
                    )
            ));
        }

        return ResponseEntity.ok(Map.of(
                "authenticated", false,
                "setupRequired", setupRequired
        ));
    }

    @PostMapping("/setup")
    public ResponseEntity<Map<String, Object>> setupMasterPassword(@RequestBody Map<String, String> request,
                                                                   HttpServletRequest httpRequest,
                                                                   HttpServletResponse httpResponse) {
        String password = request.get("password");
        if (password == null || password.trim().length() < 8) {
            return ResponseEntity.badRequest().body(Map.of("error", "Master password must be at least 8 characters long."));
        }

        try {
            AppUser owner = authService.setupMasterPassword(password);
            MasterPasswordAuthService.LoginResult loginResult = authService.login(
                    password,
                    resolveClientIp(httpRequest),
                    httpRequest.getHeader("User-Agent")
            );

            attachSessionCookie(httpResponse, loginResult.rawToken(), httpRequest.isSecure());

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "success", true,
                    "message", "Master password successfully created.",
                    "token", loginResult.rawToken(),
                    "user", Map.of(
                            "id", owner.getId(),
                            "email", owner.getEmail(),
                            "displayName", owner.getDisplayName(),
                            "role", owner.getRole()
                    )
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request,
                                                     HttpServletRequest httpRequest,
                                                     HttpServletResponse httpResponse) {
        String password = request.get("password");
        if (password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password is required."));
        }

        try {
            MasterPasswordAuthService.LoginResult result = authService.login(
                    password,
                    resolveClientIp(httpRequest),
                    httpRequest.getHeader("User-Agent")
            );

            attachSessionCookie(httpResponse, result.rawToken(), httpRequest.isSecure());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "token", result.rawToken(),
                    "expiresAt", result.expiresAt().toString(),
                    "user", Map.of(
                            "id", result.user().getId(),
                            "email", result.user().getEmail(),
                            "displayName", result.user().getDisplayName(),
                            "role", result.user().getRole()
                    )
            ));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletRequest httpRequest,
                                                      HttpServletResponse httpResponse) {
        String token = resolveToken(httpRequest);
        if (token != null) {
            authService.logout(token);
        }

        clearSessionCookie(httpResponse, httpRequest.isSecure());
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok(Map.of("success", true, "message", "Logged out successfully."));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody Map<String, String> request,
                                                              HttpServletRequest httpRequest,
                                                              HttpServletResponse httpResponse) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AppUser user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required."));
        }

        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        if (currentPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Both current and new password are required."));
        }

        try {
            authService.changePassword(currentPassword, newPassword, user.getId());
            clearSessionCookie(httpResponse, httpRequest.isSecure());
            SecurityContextHolder.clearContext();
            return ResponseEntity.ok(Map.of("success", true, "message", "Master password changed successfully. Please log in again."));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private void attachSessionCookie(HttpServletResponse response, String token, boolean isSecure) {
        ResponseCookie cookie = ResponseCookie.from(SessionAuthenticationFilter.SESSION_COOKIE_NAME, token)
                .httpOnly(true)
                .secure(isSecure)
                .path("/")
                .maxAge(MasterPasswordAuthService.SESSION_DURATION_MINUTES * 60L)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearSessionCookie(HttpServletResponse response, boolean isSecure) {
        ResponseCookie cookie = ResponseCookie.from(SessionAuthenticationFilter.SESSION_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(isSecure)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String resolveToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7).trim();
        }
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (SessionAuthenticationFilter.SESSION_COOKIE_NAME.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
