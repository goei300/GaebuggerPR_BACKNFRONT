package com.example.backend.repository.Analysis;

import com.example.backend.model.Analysis.AnalysisIssues;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalysisIssuesRepository extends JpaRepository<AnalysisIssues, String> {
}
