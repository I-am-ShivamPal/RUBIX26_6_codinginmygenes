# Smart-ProctorAI: Accuracy Evaluation & Presentation Strategy

## 1. How to Calculate Accuracy (The Scientific Way)
To present a credible accuracy number (like "99.9%"), you need ground truth data to back it up. You cannot calculate accuracy on "live" unknown users because you don't know if they are actually cheating.

### Step 1: Create a "Golden Dataset"
Conduct a controlled pilot test. Record or simulate **20 short sessions** (e.g., 1 minute each):

*   **10 "Clean" Sessions (Negatives)**:
    *   Instructions: Sit still, look at the screen, type normally, drink water, scratch head, look away briefly (natural behavior).
    *   *Expected Result*: Low Risk Score, No Critical Violations.
*   **10 "Cheating" Sessions (Positives)**:
    *   Instructions: Perform specific violations.
    *   **V1**: Look at a phone (off-screen).
    *   **V2**: Have a second person enter the camera frame.
    *   **V3**: Switch browser tabs/windows.
    *   **V4**: Completely leave the camera frame.
    *   **V5**: Cover the camera.
    *   *Expected Result*: High Risk Score, Specific Violation Logged.

### Step 2: The Confusion Matrix
Map your results to this table:

| | **Actual: Cheating** | **Actual: Innocent** |
| :--- | :--- | :--- |
| **AI Says: Cheating** | **True Positive (TP)** <br>*(Good: You caught them)* | **False Positive (FP)** <br>*(Bad: You annoyed a student)* |
| **AI Says: Innocent** | **False Negative (FN)** <br>*(Bad: They got away with it)* | **True Negative (TN)** <br>*(Good: Normal session)* |

### Step 3: The Formula
$$ Accuracy = \frac{TP + TN}{Total Sessions} $$

**Example**:
*   You detected 9 out of 10 cheaters. (TP=9, FN=1)
*   You correctly identified 10 out of 10 innocent students. (TN=10, FP=0)
*   Accuracy = (9 + 10) / 20 = **95%**

> **Pro Tip**: Judges care more about **False Positives** than accuracy. If your AI flags someone every time they sneeze, it's unusable. Emphasize that your system favors User Experience (UX) and uses a **Cumulative Risk Score** to prevent false alarms.

---

## 2. Presenting to Judges (The Pitch)

### The Narrative (Storytelling)
Don't just list features. Tell a story.
*   **The Problem**: "Remote exams are facing a crisis of integrity. Human proctoring is unscalable and expensive ($15/exam), while strict AI rules are buggy and stressful for students."
*   **The Solution**: "Smart-ProctorAI. An intelligent, multimodal system that watches the exam, not just the user."

### The "Secret Sauce" (Architecture)
Show the Landing Page "System Architecture" diagram. Explain that you use a multi-layered approach:
1.  **Browser Layer**: Tab/Window events (The first line of defense).
2.  **Vision Layer**: MediaPipe for Face Mesh (Head pose) + Object Detection (Phones/People).
3.  **Heuristics Engine**: We don't just ban users instantly; we calculate a `Risk Score`. This allows for minor accidental movements aka "Human-in-the-Loop" design.

### The Live Demo (Critical)
Nothing beats a live working demo.
1.  **Setup**:
    *   **Screen 1**: The **Admin Dashboard**, showing "Active Sessions".
    *   **Screen 2**: The **Student Exam Page** (The judge or a teammate works here).
2.  **The Flow**:
    *   **Show Normalcy**: Student types. Admin dashboard shows "Green/Low Risk".
    *   **The Violation**: Student picks up a phone or switches tabs.
    *   **The Reaction**:
        *   **Frontend**: Student gets a warning modal/toast.
        *   **Backend**: Admin dashboard **INSTANTLY** flashes Red/Updates the stats.
    *   **The "Receipt"**: Go to the "Violations" tab in Admin and show the log: *"Mobile Phone Detected at 10:48 AM"*.

### Anticipated Judge Questions (Q&A)
*   **Q: What if I have low internet?**
    *   A: "The core detection (Head/Gaze) runs **locally** in the browser using lightweight TensorFlow.js/MediaPipe. We only send lightweightJSON metadata to the server, sparing bandwidth."
*   **Q: Can I hold up a photo of myself?**
    *   A: "We use head-pose estimation (Pitch/Yaw/Roll). A static photo has 0 depth variance. We can calculate the variance over time to detect static images." (Or mention "Liveness Detection" as a roadmap feature).
*   **Q: Is my data safe?**
    *   A: "We abide by privacy-first principles. We do not store the video feed permanently, only the timestamps and snapshots of violations."

## 3. Key Metrics to Highlight
*   **Latency**: "< 100ms detection time" (Thanks to local processing).
*   **Scalability**: "Dockerized microservices architecture (Frontend, Backend, Database isolated)".
*   **Robustness**: "Handles 'No Face', 'Multiple Faces', 'Tab Switching', and 'Object Detection' simultaneously."
