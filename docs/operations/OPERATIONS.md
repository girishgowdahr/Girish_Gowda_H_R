# Operations and Maintenance Runbook

## Overview
This runbook provides baseline procedures for deployment, backups, restores, and disaster recovery for the GIRISH platform.

## Database Backup Protocol
1. Dump PostgreSQL schema and data using `pg_dump`.
2. Encrypt dump client-side with offline backup key (age/libsodium) prior to remote transmission.
3. Transmit encrypted ciphertext archive to secondary storage account.
4. Record backup metadata in `core.backup_record`.

## Disaster Recovery & Restore Drill
- Quarterly test restoring database and object stores into a clean staging environment.
- Verify data integrity via SHA-256 checksums and conduct test vault unlock with Recovery Key.
