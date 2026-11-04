package com.bikexpress.bikexpress.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AdminApiFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        boolean adminOnly = requiresAdmin(request);
        String path = request.getRequestURI().substring(request.getContextPath().length());
        boolean loginRequired = path.equals("/api/orders/addOrder") || path.startsWith("/api/orders/getOrdersByUserId/");
        if (!adminOnly && !loginRequired) {
            chain.doFilter(request, response);
            return;
        }

        HttpSession session = request.getSession(false);
        Object role = session == null ? null : session.getAttribute("BIKEXPRESS_ROLE");
        if ((adminOnly && !"ADMIN".equals(role)) || (loginRequired && role == null)) {
            response.setStatus(session == null ? HttpServletResponse.SC_UNAUTHORIZED : HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Administrator login required\"}");
            return;
        }
        chain.doFilter(request, response);
    }

    private boolean requiresAdmin(HttpServletRequest request) {
        String path = request.getRequestURI().substring(request.getContextPath().length());
        String method = request.getMethod();
        if (path.startsWith("/api/bikes/")) {
            return method.equals("PUT") || method.equals("DELETE") || path.startsWith("/api/bikes/getBikeForAdmin/");
        }
        if (path.startsWith("/api/users/")) {
            return !path.equals("/api/users/addUser");
        }
        if (path.startsWith("/api/orders/")) {
            return !(path.equals("/api/orders/addOrder") || path.startsWith("/api/orders/getOrdersByUserId/"));
        }
        return false;
    }
}
