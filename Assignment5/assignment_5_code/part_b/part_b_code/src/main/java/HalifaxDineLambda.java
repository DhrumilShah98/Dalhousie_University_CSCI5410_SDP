import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.SQSEvent;
import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.AmazonSNSClientBuilder;
import com.amazonaws.services.sns.model.AmazonSNSException;
import com.amazonaws.services.sns.model.CreateTopicRequest;
import com.amazonaws.services.sns.model.CreateTopicResult;
import com.amazonaws.services.sns.model.ListTopicsRequest;
import com.amazonaws.services.sns.model.ListTopicsResult;
import com.amazonaws.services.sns.model.PublishRequest;
import com.amazonaws.services.sns.model.PublishResult;
import com.amazonaws.services.sns.model.Topic;

import java.util.List;

/**
 * {@code HalifaxDineLambda} class polls the SQS Queue when a new order is received, prepares a message
 * for that order, and sends it to the subscriber.
 *
 * @author Dhrumil Amish Shah (B00857606 | dh416386@dal.ca)
 */
public final class HalifaxDineLambda implements RequestHandler<SQSEvent, Void> {
  private static final String LOG_TAG = HalifaxDineLambda.class.getSimpleName();
  private static final String SNS_TOPIC = "HalifaxDineSNS";

  /**
   * Publishes the received message to all the subscribers of the provided {@code topicArn}.
   *
   * @param amazonSNSClient Amazon SNS client.
   * @param message         Message body to be delivered.
   * @param topicArn        SNS Topic ARN (Amazon Resource Name).
   * @param context         Context object.
   *
   * @throws AmazonSNSException if any error occurs while publishing the message.
   */
  private void publishSNSTopicViaEmail(final AmazonSNS amazonSNSClient,
                                       final String message,
                                       final String topicArn,
                                       final Context context) throws AmazonSNSException {
    final PublishRequest request = new PublishRequest();
    request.setMessage(message);
    request.setTopicArn(topicArn);
    final PublishResult result = amazonSNSClient.publish(request);
    context.getLogger().log(LOG_TAG + " => " + result.getMessageId() + " Message sent. " +
        "Status is " + result.getSdkHttpMetadata().getHttpStatusCode());
  }

  /**
   * Creates if not already created, a new SNS Topic {@code SNS_TOPIC} and retrieves it's Topic ARN.
   *
   * @param amazonSNSClient Amazon SNS Client.
   *
   * @return Created topic's ARN.
   *
   * @throws AmazonSNSException if any error occurs while creating an SNS Topic or retrieving the topic's ARN.
   */
  private String createSNSTopic(final AmazonSNS amazonSNSClient) throws AmazonSNSException {
    final ListTopicsResult listTopicsResult = amazonSNSClient.listTopics(new ListTopicsRequest());
    final List<Topic> topics = listTopicsResult.getTopics();
    for (final Topic topic : topics) {
      final String[] topicARNSplit = topic.getTopicArn().split(":");
      if (topicARNSplit[topicARNSplit.length - 1].equals(SNS_TOPIC)) {
        return topic.getTopicArn();
      }
    }
    final CreateTopicRequest request = new CreateTopicRequest().withName(SNS_TOPIC);
    final CreateTopicResult result = amazonSNSClient.createTopic(request);
    return result.getTopicArn();
  }

  /**
   * Retrieves the default SNS Client object.
   *
   * @return default SNS Client object.
   */
  private AmazonSNS createAmazonSNSClientBuilder() {
    return AmazonSNSClientBuilder.defaultClient();
  }

  @Override
  public Void handleRequest(final SQSEvent sqsEvent,
                            final Context context) {
    final StringBuilder emailMsgStringBuilder = new StringBuilder();
    emailMsgStringBuilder.append("Here are the list of orders prepared and ready for delivery! :)");
    emailMsgStringBuilder.append("<+===========================================================+>");
    emailMsgStringBuilder.append("\n\n");
    for (final SQSEvent.SQSMessage sqsMessage : sqsEvent.getRecords()) {
      emailMsgStringBuilder.append(sqsMessage.getBody());
      emailMsgStringBuilder.append("\n\n");
    }
    context.getLogger().log(LOG_TAG + " => " + emailMsgStringBuilder.toString());
    try {
      final AmazonSNS amazonSNSClient = createAmazonSNSClientBuilder();
      final String snsTopicARN = createSNSTopic(amazonSNSClient);
      if (snsTopicARN == null) {
        return null;
      }
      publishSNSTopicViaEmail(amazonSNSClient, emailMsgStringBuilder.toString(), snsTopicARN, context);
    } catch (final AmazonSNSException e) {
      e.printStackTrace();
      context.getLogger().log(LOG_TAG + " => " + e.getMessage());
    }
    return null;
  }
}