package com.girish;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class GirishApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring ApplicationContext initializes cleanly
    }
}
