package com.girish.registry;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ModuleRegistryControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/v1/public/modules should return 200 with only public enabled modules")
    void shouldReturnPublicModules() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/v1/public/modules")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(header().exists(HttpHeaders.ETAG))
                .andExpect(header().string(HttpHeaders.CACHE_CONTROL, containsString("public")))
                .andExpect(header().string(HttpHeaders.CACHE_CONTROL, containsString("max-age=60")))
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(2))))
                .andExpect(jsonPath("$[*].moduleId", hasItems("lobby", "portfolio")))
                .andExpect(jsonPath("$[*].moduleId", not(hasItems("personal-fitness", "personal-study", "personal-journal", "vault"))))
                .andExpect(jsonPath("$[?(@.moduleId == 'portfolio')].routes[0].path", notNullValue()))
                .andReturn();

        String etag = result.getResponse().getHeader(HttpHeaders.ETAG);

        // Verify conditional request returns 304 Not Modified
        mockMvc.perform(get("/api/v1/public/modules")
                        .header(HttpHeaders.IF_NONE_MATCH, etag)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotModified())
                .andExpect(header().string(HttpHeaders.ETAG, etag));
    }
}
