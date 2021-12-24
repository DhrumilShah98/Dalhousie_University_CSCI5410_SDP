package assignment3.lambda;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.lambda.runtime.events.models.s3.S3EventNotification;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Dhrumil Amish Shah (B00857606 | dh416386@dal.ca)
 */
public class ExtractFeaturesLambda implements RequestHandler<S3Event, String> {
  final static String LOG_TAG = "assignment3.lambda.ExtractFeaturesLambda";
  final static String UTF_8 = "UTF-8";
  final static String OKAY = "okay";
  final static String ERROR = "error";

  @Override
  public String handleRequest(final S3Event s3Event,
                              final Context context) {
    try {
      final S3EventNotification.S3EventNotificationRecord record = s3Event.getRecords().get(0);

      // Get the bucket name and key for the uploaded S3 object that caused this lambda to be triggered.
      final String bucketName = record.getS3().getBucket().getName();
      final String fileNameKey = URLDecoder.decode(record.getS3().getObject().getKey().replace('+', ' '), UTF_8);
      context.getLogger().log(LOG_TAG + ": Bucket name: " + bucketName + " File name key: " + fileNameKey);

      // Read the source file as text.
      // https://stackoverflow.com/questions/30651502/how-to-get-contents-of-a-text-file-from-aws-s3-using-a-lambda-function
      final AmazonS3 s3Client = AmazonS3ClientBuilder.standard().withRegion(Regions.US_EAST_1).build();
      String body = s3Client.getObjectAsString(bucketName, fileNameKey);
      context.getLogger().log(LOG_TAG + ": " + body);

      // Filter body.
      final String generalFilter = "(\\\\[ntr])";
      final String commaFilter = ",";
      final String bracketFilter = "[{}]";
      body = body.replaceAll(generalFilter, " ");
      body = body.replaceAll(commaFilter, "");
      body = body.replaceAll(bracketFilter, "");

      // Core logic to extract Named Entities.
      final String[] words = body.split(" ");
      final Map<String, Integer> namedEntities = new HashMap<>();
      for (final String currentWord : words) {
        if (Character.isUpperCase(currentWord.charAt(0))) {
          if (namedEntities.containsKey(currentWord)) {
            namedEntities.put(currentWord, namedEntities.get(currentWord) + 1);
          } else {
            namedEntities.put(currentWord, 1);
          }
        }
      }

      // Prepare the JSON string of Named Entities ("001ne": {"Asia":1, "Soviet":1...etc}).
      final StringBuilder jsonNamedEntity = new StringBuilder();
      jsonNamedEntity.append("\"").append(fileNameKey.split("\\.")[0]).append("ne").append("\"");
      jsonNamedEntity.append(":").append("{");
      for (final Map.Entry<String, Integer> namedEntity : namedEntities.entrySet()) {
        jsonNamedEntity.append("\"").append(namedEntity.getKey()).append("\"").append(":").append(namedEntity.getValue());
        jsonNamedEntity.append(",");
      }
      jsonNamedEntity.replace(jsonNamedEntity.length() - 1, jsonNamedEntity.length(), "");
      jsonNamedEntity.append("}");
      context.getLogger().log(LOG_TAG + ": " + jsonNamedEntity.toString());

      // Add JSON string to a new file and upload it on S3 in a bucket named "second-b00857606".
      final String newFileName = fileNameKey.split("\\.")[0] + "ne" + ".txt";
      final String bucket2Name = "second-b00857606";
      s3Client.putObject(bucket2Name, newFileName, jsonNamedEntity.toString());
      context.getLogger().log(LOG_TAG + ": " + "Content written to file " + newFileName + " successfully!");

      return OKAY;
    } catch (final Exception e) {
      context.getLogger().log(LOG_TAG + ": " + e.getMessage());
      return ERROR;
    }
  }
}