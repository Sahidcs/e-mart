package com.controller;
import com.entity.PageResponse;
import com.entity.Project;
import com.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@CrossOrigin(origins = {"https://remote-theta.vercel.app", "http://localhost:3000"})
@RequestMapping("/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/create")
    public Project createProject(@RequestBody Project project) {
        return projectService.saveProject(project);
    }

    @GetMapping("/manager/{managerId}")
    public List<Project> getProjectsByManager(@PathVariable int managerId) {
        return projectService.findByManagerId(managerId);
    }
    @GetMapping("/manager/{managerId}/paged")
public ResponseEntity<PageResponse<Project>> getProjectsByManagerWithPaging(
        @RequestParam int pageno,
        @RequestParam int pagesize,
        @RequestParam String sort,
        @PathVariable int managerId,
        @RequestParam(defaultValue = "asc") String direction
) {
    Sort.Direction sortDirection;
    try {
        sortDirection = Sort.Direction.valueOf(direction.trim().toUpperCase());
    } catch (IllegalArgumentException e) {
        throw new IllegalArgumentException("Invalid value '" + direction + "' for sorting direction; Must be either 'asc' or 'desc' (case insensitive)");
    }
    Sort sorting = Sort.by(sortDirection, sort);
    Pageable pageable = PageRequest.of(pageno, pagesize, sorting);
    Page<Project> projectPage = projectService.findProjectsByManagerId(managerId, pageable);
    PageResponse<Project> pageResponse = new PageResponse<>(
            projectPage.getContent(),
            projectPage.getTotalPages(),
            projectPage.getTotalElements(),
            projectPage.getNumber(),
            projectPage.getSize()
    );
    return ResponseEntity.ok(pageResponse);
}
    @GetMapping("/search")
    public List<Project> searchProjects(@RequestParam String name) {
        return projectService.searchProjectsByName(name);
    }

    @DeleteMapping("/delete/{projectId}")
    public ResponseEntity<String> deleteProject(@PathVariable int projectId) {
        return projectService.delete(projectId);
    }

    @PostMapping("/update")
    public ResponseEntity<Project> updateProject(@RequestBody Project project) {
        return projectService.update(project);
    }
}
