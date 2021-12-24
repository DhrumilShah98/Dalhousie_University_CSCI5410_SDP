package part_c_aws_dynamodb;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;

import java.util.List;
import java.util.Scanner;

public final class DynamoDBScript {
  private static final String AWS_ACCESS_KEY = "<AWS_ACCESS_KEY>";
  private static final String AWS_SECRET_KEY = "<AWS_SECRET_KEY>";
  private static final String AWS_SESSION_TOKEN = "<AWS_SESSION_TOKEN>";
  private static final BasicSessionCredentials AWS_CREDENTIALS = new BasicSessionCredentials(AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_SESSION_TOKEN);
  private static final String TABLE_NAME = "Super_Volcanos";

  private void addLastEruptionPeriodForVolcanos(final DynamoDBMapper awsDynamoDBMapper,
                                                final List<SuperVolcanosModel> allSuperVolcanosModel) {
    final Scanner scanner = new Scanner(System.in);
    for (final SuperVolcanosModel superVolcanosModel : allSuperVolcanosModel) {
      System.out.printf("%nEnter last eruption period for %s.%n", superVolcanosModel.getName());
      final String lastEruptionPeriod = scanner.nextLine();
      superVolcanosModel.setLastEruptionPeriod(lastEruptionPeriod);
      awsDynamoDBMapper.save(superVolcanosModel);
    }
  }

  private void printSuperVolcanosModelList(final List<SuperVolcanosModel> allSuperVolcanosModel) {
    if (allSuperVolcanosModel.size() > 0) {
      System.out.printf("%nTotal entries in table %s: %d", TABLE_NAME, allSuperVolcanosModel.size());
      System.out.printf("%n%n%-25s%-25s%-25s%-15s%-15s%-15s", "ID", "Name", "Location", "Type", "Latitude", "Longitude");
      for (final SuperVolcanosModel superVolcanosModel : allSuperVolcanosModel) {
        final String id = superVolcanosModel.getId();
        final String name = superVolcanosModel.getName();
        final String location = superVolcanosModel.getLocation();
        final String type = superVolcanosModel.getType();
        final String latitude = superVolcanosModel.getLat();
        final String longitude = superVolcanosModel.getLng();
        System.out.printf("%n%-25s%-25s%-25s%-15s%-15s%-15s", id, name, location, type, latitude, longitude);
      }
    } else {
      System.out.printf("%nNo entries in table %s.", TABLE_NAME);
    }
  }

  private List<SuperVolcanosModel> getSuperVolcanosModelList(final DynamoDBMapper awsDynamoDBMapper) {
    final DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
    return awsDynamoDBMapper.scan(SuperVolcanosModel.class, scanExpression);
  }

  private DynamoDBMapper getAWSDynamoDBMapper(final AmazonDynamoDB awsDynamoDBClientBuilder) {
    final DynamoDBMapperConfig mapperConfig = new DynamoDBMapperConfig
        .Builder()
        .withTableNameOverride(DynamoDBMapperConfig
            .TableNameOverride
            .withTableNameReplacement(TABLE_NAME)).build();
    return new DynamoDBMapper(awsDynamoDBClientBuilder, mapperConfig);
  }

  private AmazonDynamoDB createAWSDynamoDBClientBuilder() {
    return AmazonDynamoDBClientBuilder.standard()
        .withCredentials(new AWSStaticCredentialsProvider(AWS_CREDENTIALS))
        .withRegion(Regions.US_EAST_1)
        .build();
  }

  public void execute() {
    try {
      final AmazonDynamoDB awsDynamoDBClientBuilder = createAWSDynamoDBClientBuilder();
      if (awsDynamoDBClientBuilder != null) {
        final DynamoDBMapper awsDynamoDBMapper = getAWSDynamoDBMapper(awsDynamoDBClientBuilder);

        System.out.printf("%nFetching entries from table %s ...", TABLE_NAME);
        final List<SuperVolcanosModel> allSuperVolcanosModel = getSuperVolcanosModelList(awsDynamoDBMapper);
        if (allSuperVolcanosModel.size() > 0) {
          System.out.printf("%n%n<========== %s ==========>", "OUTPUT 2");
          printSuperVolcanosModelList(allSuperVolcanosModel);
          System.out.printf("%n%n<========== %s ==========>", "OUTPUT 3");
          System.out.printf("%n%nUpdating entries in table %s.", TABLE_NAME);
          addLastEruptionPeriodForVolcanos(awsDynamoDBMapper, allSuperVolcanosModel);

          System.out.printf("%n%nUpdated entries in table %s.", TABLE_NAME);
          System.out.printf("%n%n%-25s%-25s%-25s%-15s%-15s%-15s%-30s", "ID", "Name", "Location", "Type", "Latitude", "Longitude", "Last Eruption Period");
          for (final SuperVolcanosModel superVolcanosModel : allSuperVolcanosModel) {
            final String id = superVolcanosModel.getId();
            final String name = superVolcanosModel.getName();
            final String location = superVolcanosModel.getLocation();
            final String type = superVolcanosModel.getType();
            final String latitude = superVolcanosModel.getLat();
            final String longitude = superVolcanosModel.getLng();
            final String lastErrPeriod = superVolcanosModel.getLastEruptionPeriod();
            System.out.printf("%n%-25s%-25s%-25s%-15s%-15s%-15s%-30s", id, name, location, type, latitude, longitude, lastErrPeriod);
          }
        } else {
          System.out.printf("%n%n<========== %s ==========>", "OUTPUT 1");
          printSuperVolcanosModelList(allSuperVolcanosModel);
        }
      } else {
        System.err.println("\nError creating AWS DynamoDB client builder instance!");
      }
    } catch (final Exception e) {
      System.err.println(e.getMessage());
    }
  }
}