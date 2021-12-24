package assignment3.application;

/**
 * @author Dhrumil Amish Shah (B00857606 | dh416386@dal.ca)
 */
public class EventDrivenServerlessApplicationTest {
  public static void main(String[] args) {
    final String folderName = "tech";
    final EventDrivenServerlessApplication serverlessApplication = new EventDrivenServerlessApplication();
    serverlessApplication.execute(folderName);
  }
}