package com.controller;
import com.entity.PageResponse;
import com.entity.Project;
import com.entity.Task;
import com.service.TaskService;
import org.springframework.data.domain.Pageable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@CrossOrigin(origins = {"https://remote-theta.vercel.app", "http://localhost:3000"})
@RequestMapping("/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @PostMapping("/assign")
    public Task assignTask(@RequestBody Task task) {
        return taskService.saveTask(task);
    }
    @GetMapping("/delete/{projectId}")
    public ResponseEntity<String> deleteTask(@RequestParam int taskId) {
        return taskService.delete(taskId);
    }
    @GetMapping("/user/{userId}")
    public List<Task> getTasksByUser(@PathVariable int userId) {
        return taskService.findByUserId(userId);
    }
    @GetMapping("/user/{userId}/paged")
    public ResponseEntity<PageResponse<Task>> getTasksByUserWithPaging(
            @PathVariable int userId,
            @RequestParam int pageno,
            @RequestParam int pagesize,
            @RequestParam String sort, 
            @RequestParam(defaultValue = "asc") String direction) {
        Sort.Direction sortDirection;
        try {
            sortDirection = Sort.Direction.valueOf(direction.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid value '" + direction + "' for sorting direction; Must be either 'asc' or 'desc' (case insensitive)");
        }
        Sort sorting = Sort.by(sortDirection, sort);
        Pageable pageable = PageRequest.of(pageno, pagesize, sorting);
        Page<Task> taskPage = taskService.findTasksByUserId(userId, pageable);
    
        PageResponse<Task> pageResponse = new PageResponse<>(
            taskPage.getContent(),
            taskPage.getTotalPages(),
            taskPage.getTotalElements(),
            taskPage.getNumber(),
            taskPage.getSize()
        );
    
        return ResponseEntity.ok(pageResponse);
    }
    @GetMapping("/project/{projectId}")
    public List<Task> getTasksByProject(@PathVariable int projectId) {
        return taskService.findByProjectId(projectId);
    }
@PostMapping("/user/update")
public ResponseEntity<Task> updateUser(@RequestBody Task task) {
    System.out.println(task);
    return taskService.updateUser(task);
}
@PostMapping("/user/update/manager")
@PreAuthorize("hasRole('MANAGER')")
public ResponseEntity<Task> updateManager(@RequestBody Task task) {
    return taskService.update(task);
}
}

