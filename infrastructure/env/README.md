# Environment Configuration Guidelines

- **NEVER** commit real `.env` or `.env.local` files containing secrets to version control.
- Use `.env.example` as a template for variable names.
- Secrets in production should be injected via environment variables or a managed secret provider.
