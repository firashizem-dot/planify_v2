package com.planify.service;

import com.planify.dto.TimeSlotDto;
import com.planify.exception.ResourceNotFoundException;
import com.planify.model.Department;
import com.planify.model.TimeSlot;
import com.planify.repository.DepartmentRepository;
import com.planify.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;
    private final DepartmentRepository departmentRepository;

    public List<TimeSlotDto> getTimeSlotsByDepartment(Long deptId) {
        return timeSlotRepository.findByDepartmentIdOrderByDayOfWeekAscStartTimeAsc(deptId)
                .stream().map(this::toDto).toList();
    }

    public TimeSlotDto getTimeSlotById(Long id) {
        return toDto(timeSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot", id)));
    }

    @Transactional
    public TimeSlotDto createTimeSlot(TimeSlotDto dto) {
        TimeSlot ts = new TimeSlot();
        mapDtoToEntity(dto, ts);
        return toDto(timeSlotRepository.save(ts));
    }

    @Transactional
    public TimeSlotDto updateTimeSlot(Long id, TimeSlotDto dto) {
        TimeSlot ts = timeSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot", id));
        mapDtoToEntity(dto, ts);
        return toDto(timeSlotRepository.save(ts));
    }

    @Transactional
    public void deleteTimeSlot(Long id) {
        if (!timeSlotRepository.existsById(id)) throw new ResourceNotFoundException("TimeSlot", id);
        timeSlotRepository.deleteById(id);
    }

    private void mapDtoToEntity(TimeSlotDto dto, TimeSlot ts) {
        ts.setDayOfWeek(dto.getDayOfWeek());
        ts.setStartTime(dto.getStartTime());
        ts.setEndTime(dto.getEndTime());
        Department dept = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", dto.getDepartmentId()));
        ts.setDepartment(dept);
    }

    public TimeSlotDto toDto(TimeSlot ts) {
        TimeSlotDto dto = new TimeSlotDto();
        dto.setId(ts.getId());
        dto.setDayOfWeek(ts.getDayOfWeek());
        dto.setStartTime(ts.getStartTime());
        dto.setEndTime(ts.getEndTime());
        dto.setDepartmentId(ts.getDepartment().getId());
        return dto;
    }
}
