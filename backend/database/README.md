# Duo Pet database

Start local infrastructure from the repository root:

```text
docker compose up -d
```

The foundation migration is mounted into PostgreSQL initialization and creates users, partnerships, invite tokens, species, pets, and pet stats. The current in-memory services remain as a development fallback until the repository layer is connected to `DATABASE_URL`.
