package com.planify.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorPreferenceDto {
    private Long id;
    private Long professorId;
    private Long timeSlotId;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
}
