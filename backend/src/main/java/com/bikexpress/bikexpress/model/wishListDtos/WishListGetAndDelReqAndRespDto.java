package com.bikexpress.bikexpress.model.wishListDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class WishListGetAndDelReqAndRespDto extends WishListAddReq{

    private Integer wishListId;

}
