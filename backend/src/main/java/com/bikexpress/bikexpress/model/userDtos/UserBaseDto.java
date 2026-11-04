package com.bikexpress.bikexpress.model.userDtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class UserBaseDto extends UserSuperBaseDto {

    @NotBlank(message = "Name is required")
    @Size(min=3, max = 20)
    private String name;

    @NotNull(message = "Enter valid Mobile Number")
    private Long phoneNumber;

    @NotBlank(message = "Enter a correct address")
    private String address;

}
