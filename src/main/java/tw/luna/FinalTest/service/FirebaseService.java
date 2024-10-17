package tw.luna.FinalTest.service;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.util.stream.Collectors;

@Service
public class FirebaseService {

    @PostConstruct
    public void initialize() {
        try {
            // 獲取加密密鑰
            String key = System.getenv("ENCRYPTION_KEY");
            if (key == null) {
                throw new IllegalStateException("Encryption key is not set in environment variables.");
            }

            // 使用 openssl 解密 JSON 文件
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "openssl", "enc", "-aes-256-cbc", "-pbkdf2", "-d", "-in", "/app/ee85enjoyum-firebase-adminsdk-879hb-b508264fb5.json.enc",
                    "-pass", "pass:" + key
            );


            Process process = processBuilder.start();

            // 確認是否有錯誤輸出
            String errorMessage = new BufferedReader(new InputStreamReader(process.getErrorStream()))
                    .lines().collect(Collectors.joining("\n"));
            if (!errorMessage.isEmpty()) {
                throw new RuntimeException("OpenSSL Error: " + errorMessage);
            }

            // 獲取解密後的內容流
            InputStream serviceAccount = process.getInputStream();
            if (serviceAccount.available() == 0) {
                throw new RuntimeException("Decrypted JSON file is empty or not found.");
            }

            // 使用解密的 JSON 初始化 Firebase
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