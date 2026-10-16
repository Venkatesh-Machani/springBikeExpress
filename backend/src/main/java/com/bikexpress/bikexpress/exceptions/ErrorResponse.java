package com.bikexpress.bikexpress.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import java.time.LocalDateTime;

public record ErrorResponse(LocalDateTime timeDate,
                            String message,
                            String details,
                            HttpStatus httpStatus) {

    public ErrorResponse(LocalDateTime now, String message, String internalServerError) {
        this(now,message,internalServerError,null);
    }
}
