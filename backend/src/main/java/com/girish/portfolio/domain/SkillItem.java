package com.girish.portfolio.domain;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "skill_item", schema = "portfolio")
public class SkillItem {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private SkillCategory category;

    @Column(nullable = false, length = 64)
    private String name;

    @Column(length = 32)
    private String proficiency;

    @Column(name = "years_of_experience", precision = 3, scale = 1)
    private BigDecimal yearsOfExperience;

    @Column(length = 64)
    private String icon;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(name = "is_featured", nullable = false)
    private boolean isFeatured;

    public SkillItem() {
    }

    public SkillItem(UUID id, SkillCategory category, String name, String proficiency,
                     BigDecimal yearsOfExperience, String icon, int sortOrder, boolean isFeatured) {
        this.id = id;
        this.category = category;
        this.name = name;
        this.proficiency = proficiency;
        this.yearsOfExperience = yearsOfExperience;
        this.icon = icon;
        this.sortOrder = sortOrder;
        this.isFeatured = isFeatured;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public SkillCategory getCategory() {
        return category;
    }

    public void setCategory(SkillCategory category) {
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProficiency() {
        return proficiency;
    }

    public void setProficiency(String proficiency) {
        this.proficiency = proficiency;
    }

    public BigDecimal getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(BigDecimal yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public boolean isFeatured() {
        return isFeatured;
    }

    public void setFeatured(boolean featured) {
        isFeatured = featured;
    }
}
