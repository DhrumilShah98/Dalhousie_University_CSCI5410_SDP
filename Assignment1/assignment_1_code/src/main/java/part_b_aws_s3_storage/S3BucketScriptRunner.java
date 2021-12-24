package part_b_aws_s3_storage;

import java.util.Scanner;

public final class S3BucketScriptRunner {
  public static void main(String[] args) {
    final Scanner scanner = new Scanner(System.in);

    String bucketName = null;
    while (bucketName == null || bucketName.trim().isEmpty()) {
      System.out.println("Enter AWS S3 bucket name. (Cannot be empty)");
      bucketName = scanner.nextLine();
    }

    final S3BucketScript s3BucketScript = new S3BucketScript();
    s3BucketScript.execute(bucketName);
  }
}