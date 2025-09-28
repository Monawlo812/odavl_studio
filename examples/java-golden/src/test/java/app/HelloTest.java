package app;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class HelloTest {
  @Test
  void ok() { assertEquals("hello", Hello.greet()); }
}
