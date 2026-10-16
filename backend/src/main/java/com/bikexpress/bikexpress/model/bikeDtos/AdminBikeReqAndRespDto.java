package com.bikexpress.bikexpress.model.bikeDtos;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AdminBikeReqAndRespDto extends UserBikeReqAndRespDto {
    private  Integer bikeId;
}
