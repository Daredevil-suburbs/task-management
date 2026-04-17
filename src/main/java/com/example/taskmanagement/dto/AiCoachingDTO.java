/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.dto;

public class AiCoachingDTO {

    // ── Response: what the prediction endpoint returns ──────────────
    public static class PredictionResponse {
        private String status;
        private String recommendation;

        public static PredictionResponse analyzed(String recommendation) {
            PredictionResponse res = new PredictionResponse();
            res.status = "Analyzed";
            res.recommendation = recommendation;
            return res;
        }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getRecommendation() { return recommendation; }
        public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
    }
}
