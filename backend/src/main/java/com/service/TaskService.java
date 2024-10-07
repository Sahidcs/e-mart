package com.service;

import com.entity.Task;
import com.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    public List<Task> findByUserId(int userId) {
        return taskRepository.findByUserId(userId);
    }

    public List<Task> findByProjectId(int projectId) {
        return taskRepository.findByProjectId(projectId);
    }
    public Page<Task> findTasksByUserId(int user_id,Pageable Pageable)
    {
        return taskRepository.findByUserId(user_id,Pageable);
    }

    public ResponseEntity<String> delete(int taskId) {
        try {
            taskRepository.deleteById(taskId);
            return ResponseEntity.status(202).body("Task is deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Id not found");
        }
    }
    public ResponseEntity<Task> updateUser(Task task) {
        Optional<Task> currTask = taskRepository.findById(task.getId());
        if (currTask.isPresent()) {
            Task updatedTask = currTask.get();
            updatedTask.setDescription(task.getDescription());
            updatedTask.setStatus(task.getStatus());
            taskRepository.save(updatedTask);
            return ResponseEntity.ok(updatedTask);
        } else {
            return ResponseEntity.status(404).body(null);
        }
    }
    public ResponseEntity<Task> update(Task task) {
        Optional<Task> currTask = taskRepository.findById(task.getId());
        if (currTask.isPresent()) {
            Task updatedTask = currTask.get();
            updatedTask.setName(task.getName());
            updatedTask.setDescription(task.getDescription());
            updatedTask.setStatus(task.getStatus());
            updatedTask.setDueDate(task.getDueDate()); 
            updatedTask.setUser(task.getUser());
            taskRepository.save(updatedTask);
            return ResponseEntity.ok(updatedTask);
        } else {
            return ResponseEntity.status(404).body(null);
        }
    }
    
    
}
