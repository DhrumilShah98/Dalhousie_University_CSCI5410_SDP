package assignment3.application;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.Bucket;

import java.io.File;
import java.util.List;

/**
 * @author Dhrumil Amish Shah (B00857606 | dh416386@dal.ca)
 */
public class EventDrivenServerlessApplication {
  private static final String AWS_ACCESS_KEY = "<AWS_ACCESS_KEY>";
  private static final String AWS_SECRET_KEY = "<AWS_SECRET_KEY>";
  private static final String AWS_SESSION_TOKEN = "<AWS_SESSION_TOKEN>";
  private static final BasicSessionCredentials AWS_CREDENTIALS = new BasicSessionCredentials(AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_SESSION_TOKEN);

  private void uploadObject(final AmazonS3 awsS3ClientBuilder,
                            final String bucketName,
                            final File file) {
    final String fileName = file.getName();
    System.out.println("Uploading " + fileName + " to S3 bucket " + bucketName + "...");
    try {
      awsS3ClientBuilder.putObject(bucketName, fileName, file);
      System.out.println("File uploaded successfully.");
    } catch (final AmazonServiceException e) {
      e.printStackTrace();
      System.err.println(e.getMessage());
    }
  }

  private void uploadFilesFromFolderToS3Bucket(final AmazonS3 awsS3ClientBuilder,
                                               final String bucketName,
                                               final String folderName) {
    final File folderPath = new File(folderName);
    final File[] allFiles = folderPath.listFiles();
    if (allFiles != null) {
      for (final File file : allFiles) {
        uploadObject(awsS3ClientBuilder, bucketName, file);
        try {
          Thread.sleep(200);
        } catch (final InterruptedException e) {
          e.printStackTrace();
          System.err.println(e.getMessage());
        }
      }
    } else {
      System.out.println("No files to upload!");
    }
  }

  private static Bucket getBucketIfExists(final AmazonS3 awsS3ClientBuilder,
                                          final String bucketName) {
    final List<Bucket> allBuckets = awsS3ClientBuilder.listBuckets();
    for (final Bucket s3Bucket : allBuckets) {
      if (s3Bucket.getName().equals(bucketName)) {
        return s3Bucket;
      }
    }
    return null;
  }

  private Bucket createBucketIfNotExists(final AmazonS3 awsS3ClientBuilder,
                                         final String bucketName) {
    if (awsS3ClientBuilder.doesBucketExistV2(bucketName)) {
      System.out.println("Bucket " + bucketName + " exists already!");
      return getBucketIfExists(awsS3ClientBuilder, bucketName);
    } else {
      try {
        System.out.println("Creating bucket " + bucketName + "...");
        Bucket bucket = awsS3ClientBuilder.createBucket(bucketName);
        System.out.println("Bucket " + bucketName + " created successfully!");
        return bucket;
      } catch (final AmazonS3Exception e) {
        e.printStackTrace();
        System.err.println(e.getErrorMessage());
      }
    }
    return null;
  }

  private AmazonS3 createAWSS3ClientBuilder() {
    return AmazonS3ClientBuilder.standard()
        .withCredentials(new AWSStaticCredentialsProvider(AWS_CREDENTIALS))
        .withRegion(Regions.US_EAST_1)
        .build();
  }

  public void execute(final String folderName) {
    try {
      final String bucket1Name = "first-b00857606";
      final String bucket2Name = "second-b00857606";
      final AmazonS3 awsS3ClientBuilder = createAWSS3ClientBuilder();
      if (awsS3ClientBuilder != null) {
        final Bucket firstBucket = createBucketIfNotExists(awsS3ClientBuilder, bucket1Name);
        final Bucket secondBucket = createBucketIfNotExists(awsS3ClientBuilder, bucket2Name);
        if (firstBucket != null && secondBucket != null) {
          uploadFilesFromFolderToS3Bucket(awsS3ClientBuilder, firstBucket.getName(), folderName);
        } else {
          System.err.println("Error working with bucket.");
        }
      } else {
        System.err.println("Error creating AWS S3 client builder instance!");
      }
    } catch (final Exception e) {
      e.printStackTrace();
      System.err.println(e.getMessage());
    }
  }
}