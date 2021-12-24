package assignment3.lambda;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.model.AttributeDefinition;
import com.amazonaws.services.dynamodbv2.model.CreateTableRequest;
import com.amazonaws.services.dynamodbv2.model.CreateTableResult;
import com.amazonaws.services.dynamodbv2.model.KeySchemaElement;
import com.amazonaws.services.dynamodbv2.model.KeyType;
import com.amazonaws.services.dynamodbv2.model.ProvisionedThroughput;
import com.amazonaws.services.dynamodbv2.model.ScalarAttributeType;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.lambda.runtime.events.models.s3.S3EventNotification;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.dynamodbv2.model.ResourceNotFoundException;

import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Dhrumil Amish Shah (B00857606 | dh416386@dal.ca)
 */
public class AccessDBLambda implements RequestHandler<S3Event, String> {
  final static String LOG_TAG = "assignment3.lambda.AccessDB";
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
      final AmazonS3 s3Client = AmazonS3ClientBuilder.standard().withRegion(Regions.US_EAST_1).build();
      final String body = s3Client.getObjectAsString(bucketName, fileNameKey);
      context.getLogger().log(LOG_TAG + ": " + body);

      // Extract JSON response.
      final String startingBracketFilter = "\\{";
      final String endingBracketFilter = "}";
      final String namedEntitiesString = body.split(startingBracketFilter)[1].replaceAll(endingBracketFilter, "");
      context.getLogger().log(LOG_TAG + ": " + namedEntitiesString);

      // Prepare named entities map.
      final Map<String, Integer> namedEntitiesMap = new HashMap<>();
      final String[] namedEntitiesArray = namedEntitiesString.split(",");
      for (String namedEntity : namedEntitiesArray) {
        final String namedEntityKey = namedEntity.split(":")[0].replaceAll("\"", "");
        final Integer namedEntityVal = Integer.parseInt(namedEntity.split(":")[1]);
        namedEntitiesMap.put(namedEntityKey, namedEntityVal);
      }
      context.getLogger().log(LOG_TAG + ": Map Size - " + namedEntitiesMap.size());

      // Prepare AmazonDynamoDB client builder.
      final AmazonDynamoDB amazonDynamoDB = AmazonDynamoDBClientBuilder.standard().withRegion(Regions.US_EAST_1).build();

      // DynamoDB entities.
      final String entityFrequencyTable = "EntityFrequencyTable";
      final String nameEntityCol = "NameEntity";
      final String frequencyCol = "Frequency";
      final String timestampOfEntryCol = "TimestampOfEntry";

      // Create table if not exists already.
      try {
        final CreateTableResult result = amazonDynamoDB.createTable(new CreateTableRequest()
            .withAttributeDefinitions(new AttributeDefinition(nameEntityCol, ScalarAttributeType.S))
            .withKeySchema(new KeySchemaElement(nameEntityCol, KeyType.HASH))
            .withProvisionedThroughput(new ProvisionedThroughput(10L, 10L))
            .withTableName(entityFrequencyTable));
        context.getLogger().log(LOG_TAG + ": Table name - " + result.getTableDescription().getTableName());
      } catch (final AmazonServiceException e) {
        context.getLogger().log(LOG_TAG + ": " + e.getMessage());
      }

      // Put values in table.
      for (final Map.Entry<String, Integer> nameEntity : namedEntitiesMap.entrySet()) {
        final Map<String, AttributeValue> items = new HashMap<>();
        items.put(nameEntityCol, new AttributeValue(nameEntity.getKey()));
        items.put(frequencyCol, new AttributeValue(String.valueOf(nameEntity.getValue())));
        items.put(timestampOfEntryCol, new AttributeValue(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSSSSS")
            .format(new Date())));

        try {
          amazonDynamoDB.putItem(entityFrequencyTable, items);
        } catch (final ResourceNotFoundException e) {
          context.getLogger().log(LOG_TAG + ": Error: The table " + entityFrequencyTable + " can't be found.");
          context.getLogger().log(LOG_TAG + ": " + e.getMessage());
        } catch (final AmazonServiceException e) {
          context.getLogger().log(LOG_TAG + ": " + e.getMessage());
        }
      }
      return OKAY;
    } catch (final Exception e) {
      context.getLogger().log(LOG_TAG + ": " + e.getMessage());
      context.getLogger().log(LOG_TAG + ": " + e.toString());
      return ERROR;
    }
  }
}