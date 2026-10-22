package com.bikexpress.bikexpress.model.userDtos;


import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@SuperBuilder
public class UserResponseDto extends UserBaseDto {
    private Integer userId;
}
