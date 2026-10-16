package com.bikexpress.bikexpress.serviceImp;

import com.bikexpress.bikexpress.entities.UserEntity;
import com.bikexpress.bikexpress.exceptions.NotFoundException;
import com.bikexpress.bikexpress.mappers.UserMapper;
import com.bikexpress.bikexpress.model.userDtos.UserCreationAndUpdateRequestDto;
import com.bikexpress.bikexpress.model.userDtos.UserResponseDto;
import com.bikexpress.bikexpress.repository.UserRepo;
import com.bikexpress.bikexpress.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService {

    private final UserRepo userRepo;

    @Override
    public UserResponseDto addUser(UserCreationAndUpdateRequestDto userCreationAndUpdateRequestDto) {
        if (userRepo.existsByEmail(userCreationAndUpdateRequestDto.getEmail())) {
            throw new RuntimeException("email already exists");
        }
        UserEntity user = userRepo.save(UserMapper.toUserEntity(userCreationAndUpdateRequestDto));
        return UserMapper.toUserResponseDto(user);
    }

    @Override
    public UserResponseDto getUserByEmailId(String email) {
        if(!userRepo.existsByEmail(email)){
            throw new NotFoundException("User Not Found");
        }
        return UserMapper.toUserResponseDto(getUserEntity(email));
    }

    private UserEntity getUserEntity(String email) {
        return userRepo.findByEmail(email).orElseThrow(()-> new NotFoundException("User not found with email : "+ email));
    }

    @Override
    public UserResponseDto updateUser(UserCreationAndUpdateRequestDto userCreationAndUpdateRequestDto){
        UserEntity userEntity = userRepo.findByEmail(userCreationAndUpdateRequestDto.getEmail())
                .orElseThrow(() -> new NotFoundException(("USER NOT FOUND WITH " + userCreationAndUpdateRequestDto.getEmail())));
        Field[] declaredFields = userCreationAndUpdateRequestDto.getClass().getDeclaredFields();
        for(Field field : declaredFields){
            try {
                field.setAccessible(true);
                if("userId".equalsIgnoreCase(field.getName())){
                    continue;
                }
                Object value = field.get(userCreationAndUpdateRequestDto);
                if(value != null){
                    Field fieldEntity;
                    try {

                        fieldEntity = userEntity.getClass().getDeclaredField(field.getName());
                    } catch (NoSuchFieldException e) {
                        throw new RuntimeException(e);
                    }
                    fieldEntity.setAccessible(true);
                    if(fieldEntity.getType().isAssignableFrom(field.getType())){
                        fieldEntity.set(userEntity, value);
                    }
                }
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }
        UserEntity user = userRepo.save(userEntity);
        return UserMapper.toUserResponseDto(user);
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        return userRepo.findAll().stream()
                .map(UserMapper::toUserResponseDto)
                .toList();
    }

    @Override
    public void deleteUser(String email) {
        userRepo.delete(getUserEntity(email));
    }
}
