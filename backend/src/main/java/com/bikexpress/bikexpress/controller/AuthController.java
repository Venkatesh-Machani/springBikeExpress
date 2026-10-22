package com.bikexpress.bikexpress.controller;

import com.bikexpress.bikexpress.entities.UserEntity;
import com.bikexpress.bikexpress.repository.UserRepo;
import com.bikexpress.bikexpress.security.PasswordCodec;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.MessageDigest;
import java.util.Map;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepo userRepo;

    @Value("${bikexpress.admin.email:bikexpressadmin1@gmail.com}")
    private String adminEmail;

    @Value("${bikexpress.admin.password:admin@123}")
    private String adminPassword;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest servletRequest) {
        if (request == null || request.email() == null || request.password() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid email or password"));
        }

        if (adminEmail.equalsIgnoreCase(request.email().trim()) && secureEquals(adminPassword, request.password())) {
            HttpSession session = servletRequest.getSession(true);
            session.setAttribute("BIKEXPRESS_ROLE", "ADMIN");
            session.removeAttribute("BIKEXPRESS_USER_ID");
            return ResponseEntity.ok(new LoginResponse("ADMIN", null, adminEmail, "Administrator", null));
        }

        UserEntity user = userRepo.findByEmail(request.email().trim()).orElse(null);
        if (user != null && PasswordCodec.matches(request.password(), user.getPassword())) {
            if (!user.getPassword().startsWith("{pbkdf2}")) {
                user.setPassword(PasswordCodec.encode(request.password()));
                userRepo.save(user);
            }
            HttpSession session = servletRequest.getSession(true);
            session.setAttribute("BIKEXPRESS_ROLE", "USER");
            session.setAttribute("BIKEXPRESS_USER_ID", user.getUserId());
            return ResponseEntity.ok(new LoginResponse("USER", user.getUserId(), user.getEmail(), user.getName(), user.getAddress()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid email or password"));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) session.invalidate();
        return ResponseEntity.noContent().build();
    }

    private boolean secureEquals(String expected, String actual) {
        if (expected == null || actual == null) return false;
        return MessageDigest.isEqual(expected.getBytes(java.nio.charset.StandardCharsets.UTF_8),
                actual.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }

    public record LoginRequest(String email, String password) {}
    public record LoginResponse(String role, Integer userId, String email, String name, String address) {}
}
