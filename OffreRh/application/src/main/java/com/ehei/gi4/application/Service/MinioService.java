package com.ehei.gi4.application.Service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class MinioService {

    @Value("${minio.url:http://minio:9000}")
    private String minioUrl;

    @Value("${minio.access-key:admin}")
    private String accessKey;

    @Value("${minio.secret-key:password}")
    private String secretKey;

    @Value("${minio.bucket:documents}")
    private String bucket;

    private MinioClient minioClient;

    @PostConstruct
    public void init() {
        this.minioClient = MinioClient.builder()
                .endpoint(minioUrl)
                .credentials(accessKey, secretKey)
                .build();

        try {
            boolean exists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
            if (!exists) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
            }
        } catch (Exception e) {
            System.err.println("Erreur création bucket MinIO: " + e.getMessage());
        }
    }

    public String uploadFile(MultipartFile file) throws Exception {
        String original = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        String fileName = UUID.randomUUID() + "_" + original;

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucket)
                        .object(fileName)
                        .stream(file.getInputStream(), file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build()
        );

        // URL accessible depuis l'extérieur du conteneur — pour la démo
        return "http://minio:9000/" + bucket + "/" + fileName;
    }
}
