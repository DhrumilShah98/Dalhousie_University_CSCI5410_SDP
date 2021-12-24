package part_b_aws_s3_storage;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.Bucket;

import java.io.File;
import java.nio.file.Paths;
import java.util.List;

public final class S3BucketScript {
  private static final String AWS_ACCESS_KEY = "<AWS_ACCESS_KEY>";
  private static final String AWS_SECRET_KEY = "<AWS_SECRET_KEY>";
  private static final String AWS_SESSION_TOKEN = "<AWS_SESSION_TOKEN>";
  private static final BasicSessionCredentials AWS_CREDENTIALS = new BasicSessionCredentials(AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_SESSION_TOKEN);

  private void uploadObject(final AmazonS3 awsS3ClientBuilder, final String bucketName) {
    final String filePath = "./src/main/java/part_b_aws_s3_storage/Dhrumil.txt";
    final File file = new File(filePath);
    final String keyName = Paths.get(filePath).getFileName().toString();
    System.out.println("Uploading " + filePath + " to S3 bucket " + bucketName + "...");
    try {
      awsS3ClientBuilder.putObject(bucketName, keyName, file);
      System.out.println("File uploaded successfully.");
    } catch (final AmazonServiceException e) {
      e.printStackTrace();
      System.err.println(e.getMessage());
    }
  }

  private static Bucket getBucketIfExists(final AmazonS3 awsS3ClientBuilder, final String bucketName) {
    final List<Bucket> allBuckets = awsS3ClientBuilder.listBuckets();
    for (final Bucket s3Bucket : allBuckets) {
      if (s3Bucket.getName().equals(bucketName)) {
        return s3Bucket;
      }
    }
    return null;
  }

  private Bucket createBucketIfNotExists(final AmazonS3 awsS3ClientBuilder, final String bucketName) {
    if (awsS3ClientBuilder.doesBucketExistV2(bucketName)) {
      System.out.println("Bucket " + bucketName + " exists already!");
      return getBucketIfExists(awsS3ClientBuilder, bucketName);
    } else {
      try {
        System.out.println("Creating bucket " + bucketName + "...");
        return awsS3ClientBuilder.createBucket(bucketName);
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

  public void execute(final String bucketName) {
    try {
      final AmazonS3 awsS3ClientBuilder = createAWSS3ClientBuilder();
      if (awsS3ClientBuilder != null) {
        final Bucket s3Bucket = createBucketIfNotExists(awsS3ClientBuilder, bucketName);
        if (s3Bucket != null) {
          System.out.println("Working with bucket: " + s3Bucket.getName() + ".");
          uploadObject(awsS3ClientBuilder, s3Bucket.getName());
        } else {
          System.err.println("Error with working with bucket: " + bucketName + ".");
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