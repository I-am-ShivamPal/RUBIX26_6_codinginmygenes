import cv2
import mediapipe as mp
import numpy as np
import base64
import threading

# Global lock to ensure thread safety for MediaPipe
mp_lock = threading.Lock()

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    min_detection_confidence=0.75,
    min_tracking_confidence=0.75,
    max_num_faces=2
)

def decode_image(base64_string: str):
    try:
        if "," in base64_string:
            base64_string = base64_string.split(",")[1]
        decoded_data = base64.b64decode(base64_string)
        np_data = np.frombuffer(decoded_data, np.uint8)
        
        if np_data.size == 0:
            return None
            
        image = cv2.imdecode(np_data, cv2.IMREAD_COLOR)
        return image
    except Exception as e:
        print(f"Error decoding image: {e}")
        return None

def analyze_face(image):
    if image is None:
        return {"face_count": 0, "status": "error", "head_pose": "unknown"}

    # Convert to RGB
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Thread-safe inference
    with mp_lock:
        results = face_mesh.process(rgb_image)

    face_count = 0
    head_pose = "unknown"
    
    face_count = 0
    head_pose = "unknown"
    
    if results.multi_face_landmarks:
        raw_faces = results.multi_face_landmarks
        num_faces = len(raw_faces)
        
        # Geometric filtering to remove "ghost" detections (e.g. from shaking/blur)
        if num_faces > 1:
            # Get nose tips (landmark 1) for the first two faces
            nose1 = raw_faces[0].landmark[1]
            nose2 = raw_faces[1].landmark[1]
            
            # Calculate Euclidean distance between noses (normalized coordinates)
            dist = ((nose1.x - nose2.x)**2 + (nose1.y - nose2.y)**2)**0.5
            
            # If faces are very close (within 20% of screen), it's likely a duplicate/artifact
            if dist < 0.2:
                face_count = 1
            else:
                face_count = num_faces
        else:
            face_count = num_faces
        
        # Simple head pose estimation logic (MVP)
        # Taking the first face
        face_landmarks = results.multi_face_landmarks[0]
        h, w, _ = image.shape
        
        # 3D points
        face_3d = []
        face_2d = []
        h, w, _ = image.shape
        
        # 3D points
        face_3d = []
        face_2d = []
        
        # Key landmarks for pose estimation
        # Nose tip: 1
        # Chin: 152
        # Left eye left corner: 33
        # Right eye right corner: 263
        # Left Mouth corner: 61
        # Right Mouth corner: 291
        
        key_landmarks = [1, 152, 33, 263, 61, 291]
        
        for idx, lm in enumerate(face_landmarks.landmark):
            if idx in key_landmarks:
                if idx == 1: # nose
                    nose_2d = (lm.x * w, lm.y * h)
                    nose_3d = (lm.x * w, lm.y * h, lm.z * 8000) # approximation

                x, y = int(lm.x * w), int(lm.y * h)
                face_2d.append([x, y])
                face_3d.append([x, y, lm.z])
        
        face_2d = np.array(face_2d, dtype=np.float64)
        face_3d = np.array(face_3d, dtype=np.float64)

        # Camera matrix
        focal_length = 1 * w
        cam_matrix = np.array([ [focal_length, 0, w / 2],
                                [0, focal_length, h / 2],
                                [0, 0, 1]])

        # The distortion parameters
        dist_matrix = np.zeros((4, 1), dtype=np.float64)

        # Solve PnP
        # This is a bit simplified/complex for MVP without mapping landmarks indices correctly for solvePnP
        # For a truly robust MVP hackathon-style, let's use the relative position of nose to eyes.
        
        # Simple Logic:
        # Check if nose is too far left or right relative to eye center
        
        # Re-fetch landmarks for simplicity
        nose = face_landmarks.landmark[1]
        left_eye_outer = face_landmarks.landmark[33]
        right_eye_outer = face_landmarks.landmark[263]
        
        # Eye center
        eye_center_x = (left_eye_outer.x + right_eye_outer.x) / 2
        
        # Thresholds
        dx = nose.x - eye_center_x
        # dy = nose.y - eye_center_y
        
        # Simple heuristic values
        if dx < -0.05:
            head_pose = "right" # Mirror effect? depends on camera. Usually user looks left => nose goes left in image.
        elif dx > 0.05:
            head_pose = "left"
        else:
            head_pose = "center"
            
        # Up/Down check could be added with nose.y relative to eyes y
        
            
    return {
        "face_count": face_count,
        "head_pose": head_pose,
        "status": "success"
    }

