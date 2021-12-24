import java.util.ArrayList;
import java.util.List;

/**
 * {@code MenuHelper} class is a helper class that prepares a menu for HalifaxDine.
 * HalifaxDine is a pizza company that serves delicious pizzas.
 *
 * @author Dhrumil Amish Shah (B00857606 | dh416386@dal.ca)
 */
public final class MenuHelper {

  /**
   * Prepares a list of {@code MenuItemModel} dishes with each dish containing dish name, dish description and dish price.
   * [Citation] Menu item source: https://gstreetpizza.ca/wp-content/uploads/2021/09/Menu-Digital-Web.pdf
   *
   * @return a list of {@code MenuItemModel} items.
   */
  public static List<MenuItemModel> getMenu() {
    final List<MenuItemModel> menuList = new ArrayList<>();
    menuList.add(new MenuItemModel("G-STREET",
        "Our signature pizza, simple/spicy. Tomato sauce base, beef pepperoni fresh jalapenos, " +
            "shredded mozzarella, topped with freshly grated parmesan and a sprinkle of oregano.",
        15.0));
    menuList.add(new MenuItemModel("MARGHERITA",
        "Tomato sauce base, fior di latte, fresh basil, finished with an extra virgin olive oil drizzle " +
            "and fresh parmesan.",
        14.0));
    menuList.add(new MenuItemModel("FUN GUY",
        "Tomato sauce base, shredded mozzarella, loaded with cremini and porabello mushrooms, " +
            "finished with fresh parmesan, a sprinkle of oregano and black truffle sea salt.",
        14.99));
    menuList.add(new MenuItemModel("GARLIC FINGERS",
        "House made roasted garlic confit spread, shredded mozzarella, finished with sea salt.",
        12.99));
    menuList.add(new MenuItemModel("PLAIN JANE",
        "Tomato sauce base, shredded mozzarella and provolone, finished with a sprinkle of oregano and sea salt.",
        12.45));
    menuList.add(new MenuItemModel("BBQ CHICKEN",
        "Bbq sauce base, marinated grilled chicken breast, shredded mozzarella, " +
            "onions, tomatoes. Finished with fresh parm and a chipotle bbq swirl.",
        18.00));
    menuList.add(new MenuItemModel("THAT WORKS",
        "Tomato sauce base, packed with beef pepperoni, beef salami, beef bacon, green pepper, " +
            "cremini and portabello mushrooms, onions and tomatoes with shredded mozzarella. Finished with fresh " +
            "parm, asprinkle of oregano and a honey drizzle.",
        18.45));
    menuList.add(new MenuItemModel("VEGAN PEPPERONI",
        "Tomato sauce base, beet pepperoni, vegan mozzarella",
        14.00));
    return menuList;
  }
}