package com.bikexpress.bikexpress.mappers;

import com.bikexpress.bikexpress.model.userDtos.UserCreationAndUpdateRequestDto;
import com.bikexpress.bikexpress.entities.UserEntity;
import com.bikexpress.bikexpress.model.userDtos.UserResponseDto;

public class UserMapper {
    private UserMapper() {

    }

    public static UserEntity toUserEntity(UserCreationAndUpdateRequestDto userCreationAndUpdateRequestDto) {
        return UserEntity.builder()
                .phone(userCreationAndUpdateRequestDto.getPhoneNumber())
                .email(userCreationAndUpdateRequestDto.getEmail())
                .address(userCreationAndUpdateRequestDto.getAddress())
                .name(userCreationAndUpdateRequestDto.getName())
                .password(userCreationAndUpdateRequestDto.getPassword())
                .build();
    }

    public static UserResponseDto toUserResponseDto(UserEntity userEntity) {
        return UserResponseDto.builder()
                .userId(userEntity.getUserId())
                .name(userEntity.getName())
                .email(userEntity.getEmail())
                .phoneNumber(userEntity.getPhone())
                .address(userEntity.getAddress())
                .build();
    }
}
