package com.planify.dto;

import com.planify.model.enums.DayOfWeek;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalTime;

@Data
public class TimeSlotDto {
    private Long id;
    @NotNull
    private DayOfWeek dayOfWeek;
    @NotNull
    private LocalTime startTime;
    @NotNull
    private LocalTime endTime;
    @NotNull
    private Long departmentId;
}
