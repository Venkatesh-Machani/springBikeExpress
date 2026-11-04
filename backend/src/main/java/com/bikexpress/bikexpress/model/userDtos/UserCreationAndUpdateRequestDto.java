package com.bikexpress.bikexpress.model.userDtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class UserCreationAndUpdateRequestDto extends UserBaseDto {

    @NotBlank(message = "Create a custom password with atleast 6 characters")
    @Size(min = 6, max = 14)
    private String password;

}
