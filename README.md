# CarePlus Diagnostic Clinic

Full-stack clinic booking project with a static Bootstrap frontend, Express API, MongoDB database, JWT authentication, customer appointment booking, payment tracking, and an admin dashboard.

## Run Locally

1. Start MongoDB on your machine.
2. Open PowerShell in `Backend`.
3. Copy `.env.example` to `.env` and edit values if needed.
4. Run:

```powershell
npm install
npm start
```

Open:

```text
http://localhost:5000/
```

Default admin:

```text
admin@careplus.com
admin123
```

## Main Features

- Customer registration and login
- JWT protected customer dashboard
- Service selection and appointment booking
- Appointment date, contact details, address and notes
- Payment record creation with transaction ID
- Admin dashboard for viewing and updating appointment status
- MongoDB models with validation
- Central API error handling
- Responsive mobile and tablet layout

## Useful API Endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/services`
- `POST /api/appointments`
- `GET /api/appointments/my`
- `PUT /api/appointments/:id/cancel`
- `POST /api/payment/pay`
- `GET /api/admin/appointments`
- `PUT /api/admin/appointment/:id`
