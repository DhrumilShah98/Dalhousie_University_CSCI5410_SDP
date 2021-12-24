import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.BucketInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * {@code DatasetProcessingEngine} class uploads the training dataset from location Dataset\Train and
 * testing dataset from location Dataset\Test to {@code SOURCE_BUCKET} bucket folder.
 */
public final class DatasetProcessingEngine {
  private static final String SOURCE_BUCKET;
  private static final String CREDENTIALS_JSON_FILE;
  private static final String GOOGLE_PROJECT_ID;
  private static final String DATASET_FILES_PATH;

  static {
    SOURCE_BUCKET = "sourcedatab00857606";
    CREDENTIALS_JSON_FILE = "csci5410-a4-partb-e37656a2fcca.json";
    GOOGLE_PROJECT_ID = "csci5410-a4-partb";
    DATASET_FILES_PATH = "Dataset" + File.separator + "Test" + File.separator;
  }


  private void uploadDatasetToGCSBucket(final Storage storage) {
    try {
      final File[] datasetFiles = new File(DATASET_FILES_PATH).listFiles();
      if (datasetFiles == null) {
        return;
      }
      for (File datasetCurrentFile : datasetFiles) {
        final String datasetFileName = datasetCurrentFile.getName();
        final BlobId blobId = BlobId.of(SOURCE_BUCKET, datasetFileName);
        final BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
        System.out.println(DATASET_FILES_PATH + datasetFileName);
        storage.create(blobInfo, Files.readAllBytes(Paths.get(DATASET_FILES_PATH + datasetFileName)));
        System.out.println("File " + datasetFileName + " uploaded to bucket " + SOURCE_BUCKET + ".");
      }
    } catch (final IOException e) {
      System.out.println("Method uploadDatasetToGCSBucket: " + e.getMessage());
      e.printStackTrace();
    }
  }

  private Storage establishGCSConnection() {
    try {
      final Credentials credentials = GoogleCredentials.fromStream(new FileInputStream(CREDENTIALS_JSON_FILE));
      return StorageOptions.newBuilder().setCredentials(credentials).setProjectId(GOOGLE_PROJECT_ID).build().getService();
    } catch (final IOException e) {
      System.out.println("Method establishGCPConnection: " + e.getMessage());
      e.printStackTrace();
    }
    return null;
  }

  public void processDataset() {
    final Storage storage = establishGCSConnection();
    if (storage != null) {
      if (storage.get(SOURCE_BUCKET) == null) {
        storage.create(BucketInfo.of(SOURCE_BUCKET));
        System.out.println("Bucket " + SOURCE_BUCKET + " created successfully.");
      } else if (!storage.get(SOURCE_BUCKET).exists()) {
        storage.create(BucketInfo.of(SOURCE_BUCKET));
        System.out.println("Bucket " + SOURCE_BUCKET + " created successfully.");
      } else {
        System.out.println("Bucket " + SOURCE_BUCKET + " exists already.");
      }
      uploadDatasetToGCSBucket(storage);
    }
  }
}