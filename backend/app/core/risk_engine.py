from typing import List

class RiskEngine:
    def __init__(self):
        self.weights = {
            "multiple_faces": 10.0,
            "no_face": 5.0,
            "looking_away": 2.0,
            "tab_switch": 10.0
        }

    def calculate_frame_risk(self, face_count: int, head_pose: str):
        score = 0.0
        violations = []

        if face_count == 0:
            score += self.weights["no_face"]
            violations.append("No face detected")
        elif face_count > 1:
            score += self.weights["multiple_faces"]
            violations.append("Multiple faces detected")
        
        if head_pose != "center" and face_count == 1:
            score += self.weights["looking_away"]
            violations.append(f"Looking {head_pose}")

        return score, violations

    def calculate_event_risk(self, event_type: str):
        score = 0.0
        if event_type in ["tab_switch", "tab_hidden", "window_blur"]:
            score = self.weights["tab_switch"]
        return score

risk_engine = RiskEngine()
