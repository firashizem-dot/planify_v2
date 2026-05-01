package com.planify.dto;

import com.planify.model.enums.CourseType;
import com.planify.model.enums.DayOfWeek;
import lombok.Data;

import java.time.LocalTime;

@Data
public class ScheduleSessionDto {
    private Long id;
    private Long scheduleId;
    // Subject info
    private Long subjectId;
    private String subjectName;
    private String subjectCode;
    private CourseType courseType;
    // Professor info
    private Long professorId;
    private String professorName;
    // Classroom info
    private Long classroomId;
    private String classroomName;
    private String classroomCode;
    // Student group info
    private Long studentGroupId;
    private String studentGroupName;
    // Time slot info
    private Long timeSlotId;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
}
