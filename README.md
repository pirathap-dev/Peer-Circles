## Project Structure

- `frontend/` - Frontend application
- `backend/` - Backend/API
- `database/` - Database-related files and scripts
- `docs/` - Project and sprint documentation
- `testing/` - Testing-related files and documentation

## Admin and event maps

Configure admin sign-in on the backend with `ADMIN_USERNAME` and
`ADMIN_PASSWORD`. Keep these credentials out of frontend configuration and
source control. Apply `database/migrations/011_add_event_coordinates.sql` to
existing databases to enable saved event map pins. Event maps use Leaflet and
OpenStreetMap tiles; no Google Maps API key is required. Map tiles and Leaflet
assets require an internet connection.

## Database setup

PostgreSQL is the database for this project. The complete schema is maintained
in `database/schema.sql`; database SQL and migrations belong under `database/`.

To add friend requests and friend management to an existing database, apply
`database/migrations/012_create_friend_relationships.sql`. Users can search
public profiles by name, accept or reject requests, cancel sent requests, and
remove friends. Private one-to-one messages remain available independently of
friend status, subject to each user's private-message setting.

## Deploy backend and build Android APK

The Express API can be deployed from `backend/` to Vercel using the serverless
entry point in `backend/api/`. Configure `DATABASE_URL` and `JWT_SECRET` as
Vercel project environment variables; do not put database credentials in the
APK or frontend environment. Apply the SQL migrations in `database/migrations/`
to Neon before testing the deployed API.

Set `EXPO_PUBLIC_API_URL` in the EAS `preview` environment to the deployed API
base URL ending in `/api`, then build the installable APK from `frontend/`:

```powershell
vercel --cwd backend
eas env:create --environment preview --name EXPO_PUBLIC_API_URL --value https://<your-api-domain>/api
eas build --platform android --profile apk
```

To create a fresh database from PowerShell, create the database first, then run
the schema and optional sample data:

```powershell
createdb -h localhost -p 5433 -U postgres community_support
psql -h localhost -p 5433 -U postgres -d community_support -f database/schema.sql
psql -h localhost -p 5433 -U postgres -d community_support -f database/seed.sql
```

`schema.sql` drops and recreates the project tables, so run it only against a
new or disposable database. The backend can connect using
`DATABASE_URL=postgresql://postgres:postgres@localhost:5433/community_support`.