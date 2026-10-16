package com.bikexpress.bikexpress.controller;

import com.bikexpress.bikexpress.model.userDtos.UserBaseDto;
import com.bikexpress.bikexpress.model.userDtos.UserCreationAndUpdateRequestDto;
import com.bikexpress.bikexpress.model.userDtos.UserResponseDto;
import com.bikexpress.bikexpress.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/addUser")
    public ResponseEntity<UserResponseDto> addUser(@RequestBody UserCreationAndUpdateRequestDto userCreationAndUpdateRequestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.addUser(userCreationAndUpdateRequestDto));
    }

    @PutMapping("/update")
    public ResponseEntity<UserResponseDto> update(UserCreationAndUpdateRequestDto userCreationAndUpdateRequestDto) {
        return ResponseEntity.ok(userService.updateUser(userCreationAndUpdateRequestDto));
    }

    @GetMapping("/getUser/{email}")
    public ResponseEntity<UserResponseDto> getUser(@PathVariable String email) {
        UserResponseDto user = userService.getUserByEmailId(email);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<Void> deleteUser(@PathVariable String email){
        userService.deleteUser(email);
        return ResponseEntity.noContent().build();
    }
}
