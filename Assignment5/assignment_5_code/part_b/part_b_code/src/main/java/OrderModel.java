import java.util.List;

/**
 * {@code OrderModel} class is a Model class that acts as an order.
 * {@code OrderModel} class contains list of menu items and quantities ordered.
 *
 * @author Dhrumil Amish Shah (B00857606 | dh416386@dal.ca)
 */
public final class OrderModel {
  // Menu items list.
  private final List<MenuItemModel> menuItemModels;

  // Quantities list.
  private final List<Integer> quantities;

  /**
   * Constructs {@code OrderModel} class objects.
   *
   * @param menuItemModels menu items list.
   * @param quantities     quantities list.
   */
  public OrderModel(final List<MenuItemModel> menuItemModels,
                    final List<Integer> quantities) {
    this.menuItemModels = menuItemModels;
    this.quantities = quantities;
  }

  /**
   * Adds the menu item in the menu items list.
   *
   * @param menuItemModel menu item to add in menu items list.
   */
  public void addInMenuItemModels(final MenuItemModel menuItemModel) {
    menuItemModels.add(menuItemModel);
  }

  /**
   * Gets the list of menu items.
   *
   * @return menu items list.
   */
  public List<MenuItemModel> getMenuItemModels() {
    return menuItemModels;
  }

  /**
   * Adds the quantity in the quantity list.
   *
   * @param quantity quantity to add in quantities list.
   */
  public void addInQuantities(final Integer quantity) {
    quantities.add(quantity);
  }

  /**
   * Gets the list of quantities.
   *
   * @return quantities list.
   */
  public List<Integer> getQuantities() {
    return quantities;
  }
}