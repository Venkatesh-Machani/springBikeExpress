package com.bikexpress.bikexpress.service;

import com.bikexpress.bikexpress.model.userDtos.UserCreationAndUpdateRequestDto;
//import com.bikexpress.bikexpress.model.UserPasswordUpdateDto;
import com.bikexpress.bikexpress.model.userDtos.UserResponseDto;

import java.util.List;

public interface UserService {

    UserResponseDto addUser(UserCreationAndUpdateRequestDto userCreationAndUpdateRequestDto);

    UserResponseDto getUserByEmailId(String email);

    UserResponseDto updateUser(UserCreationAndUpdateRequestDto userCreationAndUpdateRequestDto);

    List<UserResponseDto> getAllUsers();

    void deleteUser(String email);
}
