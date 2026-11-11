# API Error Catalogue (RFC 9457 Problem Details)

All error responses from the GIRISH API adhere to RFC 9457 `application/problem+json`.

## Common Error Types

| HTTP Status | Title | Type URI | Description |
|---|---|---|---|
| `400` | Bad Request | `urn:girish:error:bad-request` | Malformed payload or syntax error. |
| `401` | Unauthorized | `urn:girish:error:unauthorized` | Missing, invalid, or expired session. |
| `403` | Forbidden | `urn:girish:error:forbidden` | Authenticated principal lacks permission. |
| `404` | Not Found | `urn:girish:error:not-found` | Resource does not exist or belongs to another owner (anti-enumeration). |
| `422` | Unprocessable Content | `urn:girish:error:validation-failed` | Bean validation or business invariant failed. |
| `423` | Locked | `urn:girish:error:vault-locked` | Vault unlock or step-up authentication required. |
| `429` | Too Many Requests | `urn:girish:error:rate-limited` | Rate limit exceeded. Response includes `Retry-After`. |
| `500` | Internal Server Error | `urn:girish:error:internal-error` | Generic internal error without stack trace leakage. |
