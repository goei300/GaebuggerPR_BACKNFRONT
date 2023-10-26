package com.example.backend.dto;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponseDTO {
    private String process_Id;
    private String process_Original;
    private int process_Law_Violate;
    private int process_Law_Danger;
    private int process_Guide_Violate;
    private int process_Score;
    private List<Paragraph> process_Paragraph;
    private List<Issue> process_Issues;
    private String process_Modified;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Paragraph {
        private int paragraph_id;
        private String paragraph_content;
        private int paragraph_startIndex;
        private int paragraph_endIndex;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Issue {
        private int issue_id;
        private int issue_paragraph_id;
        private String issue_type;
        private String issue_content;
        private String issue_reason;
        private int issue_startIndex;
        private int issue_endIndex;
        private List<String> issue_guideline;
        private String issue_goodCase;
    }
}
