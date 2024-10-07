package com.repository;

import com.entity.Project;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
    List<Project> findByManagerId(int managerId);
    Page<Project> findByManagerId(int managerId, Pageable pageable);
    List<Project> findByNameContainingIgnoreCase(String name);
}
