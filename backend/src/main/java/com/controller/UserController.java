package com.controller;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.entity.AuthRequest;
import com.entity.UserInfo;
import com.repository.UserInfoRepository;
import com.service.JwtService;
import com.service.UserInfoService;
@RestController
@CrossOrigin(origins = {"https://remote-theta.vercel.app", "http://localhost:3000"})
@RequestMapping("/auth")
public class UserController {
    @Autowired
    private UserInfoService service;

    @Autowired
    private JwtService jwtService;
     
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserInfoRepository repository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome this endpoint is not secure";
    }
    @PostMapping("/addNewUser")
    public String addNewUser(@RequestBody UserInfo userInfo) {
    	userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));
    	repository.save(userInfo);
    	return "User added successfully";

    }
    @GetMapping("/user/{userId}")
    public Optional<UserInfo> userProfile(@PathVariable int userId) {
    	Optional<UserInfo> user=repository.findById(userId);
        return user;
    }
    @GetMapping("/admin/adminProfile")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String adminProfile() {
        return "Welcome to Admin Profile";
    }
    @GetMapping("/searchUsers")
    public ResponseEntity<List<UserInfo>> searchUsers(@RequestParam String name) {
        List<UserInfo> users = repository.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(users);
    }
    @PostMapping("/generateToken")
    public ResponseEntity<Map<String, Object>> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );

        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken(authRequest.getUsername());
            Optional<UserInfo> optionalUser = repository.findByName(authRequest.getUsername());
            
            if (optionalUser.isPresent()) {
                UserInfo user = optionalUser.get();
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("user_id", user.getId());  
                
                return ResponseEntity.ok(response);
            } else {
                throw new UsernameNotFoundException("User not found in the database!");
            }
        } else {
            throw new UsernameNotFoundException("Invalid user request!");
        }
    }

}
