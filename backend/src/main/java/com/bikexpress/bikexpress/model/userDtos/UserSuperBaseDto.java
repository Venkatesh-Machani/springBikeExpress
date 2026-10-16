package com.bikexpress.bikexpress.model.userDtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class UserSuperBaseDto {
    @Email
    @NotBlank(message = "Email is required")
    private String email;
}
