# Print Commerce Platform

End-to-end commerce system for printing and flex businesses: catalogs, orders, wallets, invoices, and payment workflows.

## Stack

- React.js (storefront + admin dashboard)
- Node.js, Express.js
- MongoDB
- Cloudinary / S3 for media
- Docker Compose for local and production deploys

## Highlights

- Product and service catalogs for print and flex work
- Order creation, tracking, and reprint/complaint flows
- Wallet top-ups with UPI/bank payment details
- Invoice generation
- Admin tools for users, credentials, banners, and operations

## Local setup

1. Copy `.env.example` to `.env` and fill in MongoDB, JWT, email, Twilio, and storage values.
2. `docker compose up --build`
3. Client portal: `http://localhost:3000`
4. Admin panel: `http://localhost:3001`

Do not commit real environment files. Production hosts, registry credentials, and API keys stay in local env files.

## License

MIT. See [LICENSE](LICENSE).
