package com.service;

import com.entity.Project;
import com.repository.ProjectRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    public List<Project> findByManagerId(int managerId) {
        return projectRepository.findByManagerId(managerId);
    }
   
    public Page<Project> findProjectsByManagerId(int managerId, Pageable pageable) {
        return projectRepository.findByManagerId(managerId, pageable);
    }
    public List<Project> searchProjectsByName(String name) {
        return projectRepository.findByNameContainingIgnoreCase(name);
    }

    public ResponseEntity<String> delete(int projectId) {
        try {
            projectRepository.deleteById(projectId);
            return ResponseEntity.status(202).body("Project is deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error occurred while deleting the project");
        }
    }

    public ResponseEntity<Project> update(Project project) {
        Optional<Project> currProject = projectRepository.findById(project.getId());
        if (currProject.isPresent()) {
            Project updatedProject = currProject.get();
            updatedProject.setName(project.getName());
            updatedProject.setDescription(project.getDescription());
            projectRepository.save(updatedProject);
            return ResponseEntity.ok(updatedProject);
        } else {
            return ResponseEntity.status(404).body(null);
        }
    }
}
