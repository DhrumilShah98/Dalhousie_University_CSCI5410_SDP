import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.AmazonSQSClientBuilder;
import com.amazonaws.services.sqs.model.GetQueueUrlRequest;
import com.amazonaws.services.sqs.model.SendMessageRequest;
import com.amazonaws.services.sqs.model.SendMessageResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

/**
 * {@code HalifaxDineProgram} class simulates the order placing at HalifaxDine.
 *
 * @author Dhrumil Amish Shah (B00857606 | dh416386@dal.ca)
 */
public final class HalifaxDineProgram {
  // AWS Access Key.
  private static final String AWS_ACCESS_KEY;

  // AWS Secret Key.
  private static final String AWS_SECRET_KEY;

  // AWS Session Token.
  private static final String AWS_SESSION_TOKEN;

  // AWS BasicSessionCredentials object prepared using AWS Access Key, AWS Secret Key, and AWS Session Token.
  private static final BasicSessionCredentials AWS_CREDENTIALS;

  // HalifaxDine SQS URL Name.
  private static final String HALIFAX_DINE_SQS_URL_NAME;

  // Place new order after every interval.
  private static final int ORDERS_INTERVAL_MILLISECONDS;

  static {
    AWS_ACCESS_KEY = "ASIARRXYYGMU3UZI67FR";
    AWS_SECRET_KEY = "mfZn2o+wsVV4gIB6F+SzJWgUQs88zJvbI1Z1sMy8";
    AWS_SESSION_TOKEN = "FwoGZXIvYXdzENz//////////wEaDPeOh9mlMgxMl4XI4yK/AWU9bKmWicSw9QWx3DROP8IaHLjhKda4RwbJIWE6cKsj1GxE+74fDdMrwtrgZorxWHmwexDoNKgvkp1A7xpOJclApAPh3HJJ7IJK4DnXEQg+8Kv/c/xYkKNTHiBGuahuoOfvideqk5mVaYOsbmQFYJ49HojUwu8WbDNGkejLqKIhlXEKRW+2UWl9+kKgNxxPD2eekGI8/K+yGv63SRWHoesc57xdCP58kw/q2gitkKnr11ROQUpW5cjPeqsXlkQEKJfLhI0GMi0Uf4mQlSzGClVutY9HcugDiRNE8QCnZwnYSzFGfsoWZeI4VNNzAviieCQAJwE=";
    AWS_CREDENTIALS = new BasicSessionCredentials(AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_SESSION_TOKEN);
    HALIFAX_DINE_SQS_URL_NAME = "HalifaxDineSQS";
    ORDERS_INTERVAL_MILLISECONDS = 4 * 60 * 1000; // 4 minutes
  }

  /**
   * Prepares an order {@code OrderModel} with each order containing menu items {@code MenuItemModel} and
   * quantity {@code quantity} for each item. Each order can have minimum of 1 dish and maximum of 3 dishes
   * if number of items in the menu is greater than or equal to 3 otherwise the order can have items
   * same as the number of dishes in the menu. Also, each dish can have minimum of 1 quantity and maximum of 3.
   * Lastly, same dish cannot be repeated in the menu.
   *
   * @return random orders prepared with menu items and quantities.
   */
  private OrderModel getRandomFoodOrder() {
    final List<MenuItemModel> halifaxDineMenu = MenuHelper.getMenu();
    final OrderModel order = new OrderModel(new ArrayList<>(), new ArrayList<>());

    final int minItemsInOrder = 1;
    final int maxItemsInOrder = Math.min(halifaxDineMenu.size(), 3);
    final int totalItemsInOrder = new Random().nextInt(maxItemsInOrder) + minItemsInOrder;

    final int minQuantityOfOrderItem = 1;
    final int maxQuantityOfOrderItem = 3;

    final List<Integer> itemsOrderedAlready = new ArrayList<>();
    for (int i = 1; i <= totalItemsInOrder; ++i) {
      int randomMenuItemIndex = new Random().nextInt(halifaxDineMenu.size());
      if (itemsOrderedAlready.contains(randomMenuItemIndex)) {
        i--;
        continue;
      }
      itemsOrderedAlready.add(randomMenuItemIndex);
      int randomQuantity = new Random().nextInt(maxQuantityOfOrderItem) + minQuantityOfOrderItem;
      order.addInMenuItemModels(halifaxDineMenu.get(randomMenuItemIndex));
      order.addInQuantities(randomQuantity);
    }

    return order;
  }

  /**
   * Prepares a {@code String} message of the order and assigns an order id {@code UUID} to it.
   *
   * @return {@code String} message of the order
   */
  private String getFoodOrderMessage() {
    final OrderModel order = getRandomFoodOrder();
    final StringBuilder orderSB = new StringBuilder();
    orderSB.append("Here is the order with order id: ").append(UUID.randomUUID().toString()).append("\n");
    final List<MenuItemModel> menuItemModels = order.getMenuItemModels();
    final List<Integer> quantities = order.getQuantities();

    for (int i = 0; i < menuItemModels.size(); ++i) {
      orderSB.append("Dish name: ").append(menuItemModels.get(i).getDishName()).append(" | ");
      orderSB.append("Dish price: ").append(menuItemModels.get(i).getDishPrice()).append(" | ");
      orderSB.append("Dish quantity: ").append(quantities.get(i)).append("\n");
      orderSB.append("Dish description: ").append(menuItemModels.get(i).getDishDescription()).append("\n\n");
    }

    return orderSB.toString();
  }

  /**
   * Creates an Amazon SQS client builder with credentials and region provided.
   *
   * @return {@code AmazonSQS} client builder object.
   */
  private AmazonSQS createAmazonSQSClientBuilder() {
    return AmazonSQSClientBuilder.standard()
        .withCredentials(new AWSStaticCredentialsProvider(AWS_CREDENTIALS))
        .withRegion(Regions.US_EAST_1)
        .build();
  }

  /**
   * Creates new orders at duration of every {@code ORDERS_INTERVAL_MILLISECONDS}.
   * At every {@code ORDERS_INTERVAL_MILLISECONDS}, minimum of 1 and maximum of 5 orders are created in SQS.
   */
  public void processOrder() {
    System.out.print("\n<+========== HalifaxDine Simulator ==========+>\n\n");

    final AmazonSQS amazonSQSClientBuilder = createAmazonSQSClientBuilder();
    final GetQueueUrlRequest queueUrlRequest = new GetQueueUrlRequest().withQueueName(HALIFAX_DINE_SQS_URL_NAME);
    final String queueUrl = amazonSQSClientBuilder.getQueueUrl(queueUrlRequest).getQueueUrl();

    int orderBatch = 0;
    while (true) {
      orderBatch++;
      System.out.print("<+========== Order Batch: " + orderBatch + " ==========+>\n");
      final int minOrdersInBatch = 1;
      final int maxOrdersInBatch = 5;
      final int totalOrdersInBatch = new Random().nextInt(maxOrdersInBatch) + minOrdersInBatch;
      final StringBuilder foodOrderMessageSB = new StringBuilder();
      for (int i = 1; i <= totalOrdersInBatch; ++i) {
        final String foodOrderMessage = getFoodOrderMessage();
        foodOrderMessageSB.append(foodOrderMessage);
      }
      System.out.print(foodOrderMessageSB.toString());
      final SendMessageRequest halifaxDineMsgRequest = new SendMessageRequest()
          .withQueueUrl(queueUrl)
          .withMessageBody(foodOrderMessageSB.toString());
      final SendMessageResult sendMessageResult = amazonSQSClientBuilder.sendMessage(halifaxDineMsgRequest);
      System.out.print("---------- Order from batch " + orderBatch + " posted: " + sendMessageResult.getMessageId() + "\n\n");
      try {
        System.out.print("Waiting for new orders...\n\n");
        Thread.sleep(ORDERS_INTERVAL_MILLISECONDS);
      } catch (final InterruptedException e) {
        System.out.print("\nHalifaxDineProgram: " + e.getMessage() + "\n");
        e.printStackTrace();
      }
    }
  }
}