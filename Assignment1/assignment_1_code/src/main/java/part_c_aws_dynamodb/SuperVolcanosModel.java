package part_c_aws_dynamodb;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "Super_Volcanos")
public final class SuperVolcanosModel {
  private String id;
  private String name;
  private String location;
  private String type;
  private String lat;
  private String lng;
  private String lastEruptionPeriod;

  @DynamoDBHashKey(attributeName = "ID")
  public String getId() {
    return id;
  }

  public void setId(final String id) {
    this.id = id;
  }

  @DynamoDBAttribute(attributeName = "name")
  public String getName() {
    return name;
  }

  public void setName(final String name) {
    this.name = name;
  }

  @DynamoDBAttribute(attributeName = "location")
  public String getLocation() {
    return location;
  }

  public void setLocation(final String location) {
    this.location = location;
  }

  @DynamoDBAttribute(attributeName = "type")
  public String getType() {
    return type;
  }

  public void setType(final String type) {
    this.type = type;
  }

  @DynamoDBAttribute(attributeName = "latitude")
  public String getLat() {
    return lat;
  }

  public void setLat(String lat) {
    this.lat = lat;
  }

  @DynamoDBAttribute(attributeName = "longitude")
  public String getLng() {
    return lng;
  }

  public void setLng(String lng) {
    this.lng = lng;
  }

  @DynamoDBAttribute(attributeName = "last_eruption_period")
  public String getLastEruptionPeriod() {
    return lastEruptionPeriod;
  }

  public void setLastEruptionPeriod(final String lastEruptionPeriod) {
    this.lastEruptionPeriod = lastEruptionPeriod;
  }
}