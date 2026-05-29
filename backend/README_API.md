# ScribeSpace Backend - API reference

Base URL (default): `http://localhost:5000`

## Auth
- `POST /api/auth/register`
  - Body: `{ "name": "string", "email": "string", "password": "string" }`
- `POST /api/auth/login`
  - Body: `{ "email": "string", "password": "string" }`
  - Returns: `{ token, user }`

## Notes
- Protected routes require header: `Authorization: Bearer <token>`

