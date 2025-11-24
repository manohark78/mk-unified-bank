package com.banking.controller;

import com.banking.dto.ChangePasswordRequest;
import com.banking.dto.LoginRequest;
import com.banking.dto.LoginResponse;
import com.banking.exception.ResourceNotFoundException;
import com.banking.repository.UserRepository;
import com.banking.security.JwtProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.email(),   // if you log in by email
                            loginRequest.password()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtProvider.generateToken(userDetails);

            // Fetch domain User to read passwordChangeRequired
            var userOpt = userRepository.findByEmail(userDetails.getUsername());
            if (userOpt.isEmpty()) {
                userOpt = userRepository.findByPhoneNumber(userDetails.getUsername()); // optional, if you allow phone login
            }
            var domainUser = userOpt.orElseThrow(() -> new ResourceNotFoundException("User not found"));

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            LoginResponse response = new LoginResponse(
                    token,
                    userDetails.getUsername(),
                    roles,
                    domainUser.isPasswordChangeRequired()   // ← fix: use domain user
            );
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

    }
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest req) {
        // Find by email first; fallback to phone if your app allows it
        var userOpt = userRepository.findByEmail(req.username());
        if (userOpt.isEmpty()) userOpt = userRepository.findByPhoneNumber(req.username());
        var user = userOpt.orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(req.oldPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Old password incorrect"));
        }

        user.setPassword(passwordEncoder.encode(req.newPassword()));
        user.setPasswordChangeRequired(false); // ← critical
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password updated"));
    }




}

