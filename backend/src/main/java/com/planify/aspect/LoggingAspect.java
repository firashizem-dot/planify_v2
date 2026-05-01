package com.planify.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * AOP Logging Aspect - logs API calls, security events, and critical operations.
 * Fulfills requirement SEC-INT-04 (audit trail).
 */
@Slf4j
@Aspect
@Component
public class LoggingAspect {

    /** Logs entry and exit of all controller methods with timing. */
    @Around("execution(* com.planify.controller.*.*(..))")
    public Object logApiCall(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        String user = getCurrentUser();
        long start = System.currentTimeMillis();

        log.info("[API] [{}/{}] called by user={} args={}",
                className, methodName, user, Arrays.toString(joinPoint.getArgs()));

        try {
            Object result = joinPoint.proceed();
            log.info("[API] [{}/{}] completed in {}ms", className, methodName, System.currentTimeMillis() - start);
            return result;
        } catch (Exception e) {
            log.error("[API] [{}/{}] failed after {}ms: {}",
                    className, methodName, System.currentTimeMillis() - start, e.getMessage());
            throw e;
        }
    }

    /** Logs all service-layer operations at DEBUG level. */
    @Around("execution(* com.planify.service.*.*(..))")
    public Object logServiceCall(ProceedingJoinPoint joinPoint) throws Throwable {
        String method = joinPoint.getSignature().toShortString();
        log.debug("[SERVICE] {} called", method);
        try {
            Object result = joinPoint.proceed();
            log.debug("[SERVICE] {} returned", method);
            return result;
        } catch (Exception e) {
            log.warn("[SERVICE] {} threw {}: {}", method, e.getClass().getSimpleName(), e.getMessage());
            throw e;
        }
    }

    /** Logs security-sensitive auth operations. */
    @AfterReturning(pointcut = "execution(* com.planify.service.AuthService.*(..))", returning = "result")
    public void logAuthSuccess(JoinPoint joinPoint, Object result) {
        log.info("[SECURITY] Auth operation '{}' succeeded", joinPoint.getSignature().getName());
    }

    @AfterThrowing(pointcut = "execution(* com.planify.service.AuthService.*(..))", throwing = "ex")
    public void logAuthFailure(JoinPoint joinPoint, Exception ex) {
        log.warn("[SECURITY] Auth operation '{}' failed: {}", joinPoint.getSignature().getName(), ex.getMessage());
    }

    /** Logs OptaPlanner solver invocations. */
    @Around("execution(* com.planify.optaplanner.service.*.*(..))")
    public Object logSolverCall(ProceedingJoinPoint joinPoint) throws Throwable {
        log.info("[OPTAPLANNER] Starting solver: {}", joinPoint.getSignature().getName());
        long start = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            log.info("[OPTAPLANNER] Solver completed in {}ms", System.currentTimeMillis() - start);
            return result;
        } catch (Exception e) {
            log.error("[OPTAPLANNER] Solver failed: {}", e.getMessage(), e);
            throw e;
        }
    }

    private String getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : "anonymous";
    }
}
