package com.girish.avatar.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.OffsetDateTime;

@Entity
@Table(name = "avatar_theme", schema = "core")
public class AvatarTheme {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 128)
    private String name;

    @Column(name = "outfit_id", nullable = false, length = 64)
    private String outfitId;

    @Column(name = "pose_id", nullable = false, length = 64)
    private String poseId;

    @Column(name = "scene_id", nullable = false, length = 64)
    private String sceneId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "config")
    private String config;

    @Column(name = "is_default", nullable = false)
    private boolean isDefault;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public AvatarTheme() {
    }

    public AvatarTheme(String id, String name, String outfitId, String poseId, String sceneId,
                       String config, boolean isDefault, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.outfitId = outfitId;
        this.poseId = poseId;
        this.sceneId = sceneId;
        this.config = config;
        this.isDefault = isDefault;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOutfitId() {
        return outfitId;
    }

    public void setOutfitId(String outfitId) {
        this.outfitId = outfitId;
    }

    public String getPoseId() {
        return poseId;
    }

    public void setPoseId(String poseId) {
        this.poseId = poseId;
    }

    public String getSceneId() {
        return sceneId;
    }

    public void setSceneId(String sceneId) {
        this.sceneId = sceneId;
    }

    public String getConfig() {
        return config;
    }

    public void setConfig(String config) {
        this.config = config;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean aDefault) {
        isDefault = aDefault;
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
