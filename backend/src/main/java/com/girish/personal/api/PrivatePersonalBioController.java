package com.girish.personal.api;

import com.girish.personal.domain.PersonalBio;
import com.girish.personal.infra.PersonalBioRepository;
import com.girish.security.domain.AppUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/v1/private/personal-bio")
public class PrivatePersonalBioController {

    private final PersonalBioRepository personalBioRepository;

    public PrivatePersonalBioController(PersonalBioRepository personalBioRepository) {
        this.personalBioRepository = personalBioRepository;
    }

    @GetMapping
    @Transactional
    public ResponseEntity<Map<String, Object>> getPersonalBio() {
        AppUser user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<PersonalBio> items = personalBioRepository.findByUserIdOrderByCategoryAscSortOrderAsc(user.getId());
        if (items.isEmpty()) {
            items = initializeDefaultTemplate(user.getId());
        }

        Map<String, List<PersonalBio>> grouped = new LinkedHashMap<>();
        for (PersonalBio item : items) {
            grouped.computeIfAbsent(item.getCategory(), k -> new ArrayList<>()).add(item);
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "categories", grouped
        ));
    }

    @PutMapping("/batch")
    @Transactional
    public ResponseEntity<Map<String, Object>> updateBioBatch(@RequestBody List<BioFieldUpdateDto> updates) {
        AppUser user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        OffsetDateTime now = OffsetDateTime.now();
        List<PersonalBio> saved = new ArrayList<>();

        for (BioFieldUpdateDto update : updates) {
            Optional<PersonalBio> existingOpt = personalBioRepository.findByUserIdAndCategoryAndFieldKey(
                    user.getId(), update.category(), update.fieldKey()
            );

            if (existingOpt.isPresent()) {
                PersonalBio existing = existingOpt.get();
                existing.setFieldValue(update.fieldValue());
                existing.setUpdatedAt(now);
                saved.add(personalBioRepository.save(existing));
            } else {
                PersonalBio newField = new PersonalBio(
                        UUID.randomUUID(),
                        user.getId(),
                        update.category(),
                        update.fieldKey(),
                        update.fieldLabel() != null ? update.fieldLabel() : update.fieldKey(),
                        update.fieldValue(),
                        update.fieldType() != null ? update.fieldType() : "text",
                        update.isCustom(),
                        update.sortOrder(),
                        now,
                        now
                );
                saved.add(personalBioRepository.save(newField));
            }
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Personal bio updated successfully.",
                "updatedCount", saved.size()
        ));
    }

    @PostMapping("/custom-field")
    @Transactional
    public ResponseEntity<Map<String, Object>> addCustomField(@RequestBody CustomFieldDto dto) {
        AppUser user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (dto.category() == null || dto.fieldLabel() == null || dto.fieldLabel().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Category and Field Label are required."));
        }

        String fieldKey = "custom_" + UUID.randomUUID().toString().substring(0, 8);
        OffsetDateTime now = OffsetDateTime.now();

        PersonalBio customField = new PersonalBio(
                UUID.randomUUID(),
                user.getId(),
                dto.category(),
                fieldKey,
                dto.fieldLabel().trim(),
                dto.fieldValue() != null ? dto.fieldValue().trim() : "",
                dto.fieldType() != null ? dto.fieldType() : "text",
                true,
                99,
                now,
                now
        );

        PersonalBio saved = personalBioRepository.save(customField);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "field", saved
        ));
    }

    @DeleteMapping("/{category}/{fieldKey}")
    @Transactional
    public ResponseEntity<Map<String, Object>> deleteField(@PathVariable String category,
                                                           @PathVariable String fieldKey) {
        AppUser user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<PersonalBio> fieldOpt = personalBioRepository.findByUserIdAndCategoryAndFieldKey(user.getId(), category, fieldKey);
        if (fieldOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        PersonalBio field = fieldOpt.get();
        if (field.isCustom()) {
            personalBioRepository.delete(field);
        } else {
            field.setFieldValue("");
            field.setUpdatedAt(OffsetDateTime.now());
            personalBioRepository.save(field);
        }

        return ResponseEntity.ok(Map.of("success", true, "message", "Field removed or cleared."));
    }

    @GetMapping("/search")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> searchBio(@RequestParam("q") String query) {
        AppUser user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<PersonalBio> results = personalBioRepository.searchByUserIdAndQuery(user.getId(), query != null ? query.trim() : "");
        return ResponseEntity.ok(Map.of(
                "success", true,
                "count", results.size(),
                "results", results
        ));
    }

    private AppUser getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof AppUser user) {
            return user;
        }
        return null;
    }

    private List<PersonalBio> initializeDefaultTemplate(UUID userId) {
        OffsetDateTime now = OffsetDateTime.now();
        List<PersonalBio> template = new ArrayList<>();

        // Category A: Basic Information
        template.add(new PersonalBio(UUID.randomUUID(), userId, "BASIC", "fullName", "Full Name", "", "text", false, 1, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "BASIC", "dob", "Date of Birth", "", "date", false, 2, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "BASIC", "age", "Age", "", "number", false, 3, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "BASIC", "gender", "Gender", "", "text", false, 4, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "BASIC", "bloodGroup", "Blood Group", "", "text", false, 5, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "BASIC", "nationality", "Nationality", "", "text", false, 6, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "BASIC", "languagesKnown", "Languages Known", "", "text", false, 7, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "BASIC", "personalDescription", "Personal Description", "", "textarea", false, 8, now, now));

        // Category B: Contact Information
        template.add(new PersonalBio(UUID.randomUUID(), userId, "CONTACT", "personalEmail", "Personal Email", "", "email", false, 1, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "CONTACT", "phoneNumber", "Phone Number", "", "tel", false, 2, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "CONTACT", "alternateContact", "Alternate Contact", "", "tel", false, 3, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "CONTACT", "currentAddress", "Current Address", "", "textarea", false, 4, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "CONTACT", "permanentAddress", "Permanent Address", "", "textarea", false, 5, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "CONTACT", "emergencyContact", "Emergency Contact", "", "text", false, 6, now, now));

        // Category C: Education
        template.add(new PersonalBio(UUID.randomUUID(), userId, "EDUCATION", "schoolDetails", "School Details (SSLC / High School)", "", "textarea", false, 1, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "EDUCATION", "undergraduateDetails", "Undergraduate Details (BCA / Degree)", "", "textarea", false, 2, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "EDUCATION", "postgraduateDetails", "Postgraduate Details (MCA / Master's)", "", "textarea", false, 3, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "EDUCATION", "university", "University / Board", "", "text", false, 4, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "EDUCATION", "academicYear", "Academic Year", "", "text", false, 5, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "EDUCATION", "cgpaPercentage", "CGPA / Percentage", "", "text", false, 6, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "EDUCATION", "certifications", "Academic Certifications", "", "textarea", false, 7, now, now));

        // Category D: Professional Information
        template.add(new PersonalBio(UUID.randomUUID(), userId, "PROFESSIONAL", "careerStatus", "Current Career Status", "", "text", false, 1, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "PROFESSIONAL", "workExperience", "Work Experience", "", "textarea", false, 2, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "PROFESSIONAL", "previousEmployment", "Previous Employment", "", "textarea", false, 3, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "PROFESSIONAL", "technicalSkills", "Technical Skills", "", "textarea", false, 4, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "PROFESSIONAL", "professionalCerts", "Professional Certifications", "", "textarea", false, 5, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "PROFESSIONAL", "careerGoals", "Career Goals", "", "textarea", false, 6, now, now));

        // Category E: Personal Interests
        template.add(new PersonalBio(UUID.randomUUID(), userId, "INTERESTS", "hobbies", "Hobbies", "", "textarea", false, 1, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "INTERESTS", "fitnessInterests", "Fitness Interests (Gym, Calisthenics, Running)", "", "textarea", false, 2, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "INTERESTS", "sports", "Sports", "", "text", false, 3, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "INTERESTS", "favouriteActivities", "Favourite Activities", "", "textarea", false, 4, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "INTERESTS", "personalGoals", "Personal Goals", "", "textarea", false, 5, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "INTERESTS", "travelInterests", "Travel Interests", "", "textarea", false, 6, now, now));

        // Category F: Important Personal Records
        template.add(new PersonalBio(UUID.randomUUID(), userId, "RECORDS", "importantDates", "Important Dates & Anniversaries", "", "textarea", false, 1, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "RECORDS", "personalNotes", "Confidential Personal Notes", "", "textarea", false, 2, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "RECORDS", "privateDocuments", "Private Documents Reference", "", "textarea", false, 3, now, now));
        template.add(new PersonalBio(UUID.randomUUID(), userId, "RECORDS", "otherInfo", "Other Important Information", "", "textarea", false, 4, now, now));

        return personalBioRepository.saveAll(template);
    }

    public record BioFieldUpdateDto(String category, String fieldKey, String fieldLabel, String fieldValue,
                                    String fieldType, boolean isCustom, int sortOrder) {}

    public record CustomFieldDto(String category, String fieldLabel, String fieldValue, String fieldType) {}
}
