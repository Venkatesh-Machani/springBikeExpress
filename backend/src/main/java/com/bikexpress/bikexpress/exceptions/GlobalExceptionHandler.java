package com.bikexpress.bikexpress.exceptions;

import org.jspecify.annotations.NonNull;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log =
            LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception e) {

        log.error("Unexpected exception occurred", e);

        ErrorResponse errorBody = new ErrorResponse(
                LocalDateTime.now(),
                "Something went wrong. Please try again later.",
                "Internal Server Error"
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errorBody);
    }


    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> notFoundException(NotFoundException exception){
            ErrorResponse errorResBody = new ErrorResponse(
                    LocalDateTime.now(),
                    exception.getMessage(),
                    exception.getLocalizedMessage(),
                    exception.getHttpStatus()
            );
            return new ResponseEntity<>(errorResBody, errorResBody.httpStatus());
    }
}
