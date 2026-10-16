package com.bikexpress.bikexpress.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

public class NotFoundException extends RuntimeException{

    public NotFoundException(String message) {
        super(message);
    }

    public HttpStatus getHttpStatus(){
        return HttpStatus.NOT_FOUND;
    }
}
