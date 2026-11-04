package com.bikexpress.bikexpress.exceptions;

import org.springframework.http.HttpStatus;

public class BikeOutStock extends RuntimeException {
    public BikeOutStock(String message) {
        super(message);
    }

    public HttpStatus getHttpStatus(){
        return HttpStatus.UNPROCESSABLE_CONTENT;
    }
}
