package tw.luna.FinalTest.service;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Service
public class FirebaseService {

    @PostConstruct
    public void initialize() {
        try {
            String firebaseConfig = System.getenv("FIREBASE_CONFIG");
            if (firebaseConfig == null) {
                throw new IllegalStateException("Firebase configuration is not set in environment variables.");
            }

            // 將 JSON 字符串轉換為 InputStream
            InputStream serviceAccount = new ByteArrayInputStream(firebaseConfig.getBytes(StandardCharsets.UTF_8));

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            FirebaseApp.initializeApp(options);
            System.out.println("FirebaseApp has been successfully initialized.");

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to initialize FirebaseApp: " + e.getMessage());
        }
    }
}
