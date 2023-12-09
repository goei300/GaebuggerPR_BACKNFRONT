package com.example.backend.repository.Analysis;

import com.example.backend.model.Analysis.AnalysisIssuesReasons;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalysisIssuesReasonsRepository extends JpaRepository <AnalysisIssuesReasons,String> {
}
