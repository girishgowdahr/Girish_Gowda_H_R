package com.girish.registry.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.OffsetDateTime;

@Entity
@Table(name = "module_state", schema = "core")
public class ModuleState {

    @Id
    @Column(name = "module_id", length = 64)
    private String moduleId;

    @Column(name = "display_name", nullable = false, length = 128)
    private String displayName;

    @Column(length = 64)
    private String icon;

    @Column(name = "nav_group", nullable = false, length = 64)
    private String navGroup;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(nullable = false, length = 32)
    private String status;

    @Column(nullable = false, length = 32)
    private String visibility;

    @Column(name = "avatar_theme_id", length = 64)
    private String avatarThemeId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "feature_flags")
    private String featureFlags;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public ModuleState() {
    }

    public ModuleState(String moduleId, String displayName, String icon, String navGroup,
                       int sortOrder, String status, String visibility, String avatarThemeId,
                       String featureFlags, OffsetDateTime updatedAt) {
        this.moduleId = moduleId;
        this.displayName = displayName;
        this.icon = icon;
        this.navGroup = navGroup;
        this.sortOrder = sortOrder;
        this.status = status;
        this.visibility = visibility;
        this.avatarThemeId = avatarThemeId;
        this.featureFlags = featureFlags;
        this.updatedAt = updatedAt;
    }

    public String getModuleId() {
        return moduleId;
    }

    public void setModuleId(String moduleId) {
        this.moduleId = moduleId;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getNavGroup() {
        return navGroup;
    }

    public void setNavGroup(String navGroup) {
        this.navGroup = navGroup;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getVisibility() {
        return visibility;
    }

    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }

    public String getAvatarThemeId() {
        return avatarThemeId;
    }

    public void setAvatarThemeId(String avatarThemeId) {
        this.avatarThemeId = avatarThemeId;
    }

    public String getFeatureFlags() {
        return featureFlags;
    }

    public void setFeatureFlags(String featureFlags) {
        this.featureFlags = featureFlags;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
