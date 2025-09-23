package app;



public class Hello {
  private static final String GREETING = "hello";
  private static final java.util.logging.Logger LOGGER = java.util.logging.Logger.getLogger(Hello.class.getName());
  public static void main(String[] args) {
    LOGGER.info(GREETING);
  }
}
