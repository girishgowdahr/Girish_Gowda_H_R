package com.girish.portfolio.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "experience", schema = "portfolio")
public class Experience {

    @Id
    private UUID id;

    @Column(name = "role_title", nullable = false, length = 128)
    private String roleTitle;

    @Column(name = "company_name", nullable = false, length = 128)
    private String companyName;

    @Column(name = "employment_type", length = 64)
    private String employmentType;

    @Column(length = 128)
    private String location;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "is_current", nullable = false)
    private boolean isCurrent;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "JSONB")
    private String highlights;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "JSONB")
    private String technologies;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(name = "is_published", nullable = false)
    private boolean isPublished;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public Experience() {
    }

    public Experience(UUID id, String roleTitle, String companyName, String employmentType,
                      String location, LocalDate startDate, LocalDate endDate, boolean isCurrent,
                      String description, String highlights, String technologies, int sortOrder,
                      boolean isPublished, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.roleTitle = roleTitle;
        this.companyName = companyName;
        this.employmentType = employmentType;
        this.location = location;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isCurrent = isCurrent;
        this.description = description;
        this.highlights = highlights;
        this.technologies = technologies;
        this.sortOrder = sortOrder;
        this.isPublished = isPublished;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getRoleTitle() {
        return roleTitle;
    }

    public void setRoleTitle(String roleTitle) {
        this.roleTitle = roleTitle;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public boolean isCurrent() {
        return isCurrent;
    }

    public void setCurrent(boolean current) {
        isCurrent = current;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getHighlights() {
        return highlights;
    }

    public void setHighlights(String highlights) {
        this.highlights = highlights;
    }

    public String getTechnologies() {
        return technologies;
    }

    public void setTechnologies(String technologies) {
        this.technologies = technologies;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public boolean isPublished() {
        return isPublished;
    }

    public void setPublished(boolean published) {
        isPublished = published;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
