/**
 * {@code MenuItemModel} class is a Model class that acts as a menu item.
 * {@code MenuItemModel} class acts as a single entity in a list of menu items.
 *
 * @author Dhrumil Amish Shah (B00857606 | dh416386@dal.ca)
 */
public final class MenuItemModel {
  // Dish name.
  private final String dishName;

  // Dish description.
  private final String dishDescription;

  // Dish price.
  private final double dishPrice;

  /**
   * Constructs {@code MenuItemModel} class objects.
   *
   * @param dishName        name of the dish.
   * @param dishDescription description of the dish.
   * @param dishPrice       price of the dish.
   */
  public MenuItemModel(final String dishName,
                       final String dishDescription,
                       final double dishPrice) {
    this.dishName = dishName;
    this.dishDescription = dishDescription;
    this.dishPrice = dishPrice;
  }

  /**
   * Gets the name of the dish.
   *
   * @return name of the dish.
   */
  public String getDishName() {
    return dishName;
  }

  /**
   * Gets the description of the dish.
   *
   * @return description of the dish.
   */
  public String getDishDescription() {
    return dishDescription;
  }

  /**
   * Gets the price of the dish.
   *
   * @return price of the dish.
   */
  public double getDishPrice() {
    return dishPrice;
  }
}