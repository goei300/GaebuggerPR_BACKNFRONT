package com.example.backend.repository.Analysis;

import com.example.backend.model.Analysis.Analysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AnalysisRepository extends JpaRepository<Analysis, String> {
    Optional<Analysis> findByProcessIdAndProcessReportUriIsNotNull(String processId);
}
