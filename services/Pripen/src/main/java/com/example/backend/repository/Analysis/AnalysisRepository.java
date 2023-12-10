package com.example.backend.repository.Analysis;

import com.example.backend.model.Analysis.Analysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AnalysisRepository extends JpaRepository<Analysis, String> {
    Optional<Analysis> findByProcessIdAndProcessReportUriIsNotNull(String processId);
    @Query("SELECT a.processReportUri FROM Analysis a WHERE a.processId = :processId")
    String findProcessReportUriByProcessId(@Param("processId") String processId);
}
