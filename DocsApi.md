# API Documentation - POLABDC

## Base URL
```
http://localhost:5000/api
```

## Table of Contents
1. [Authentication](#authentication)
2. [Calendar & Leave Management](#calendar--leave-management)
3. [Dashboard](#dashboard)
4. [Finance](#finance)
5. [Medications](#medications)
6. [Patients](#patients)
7. [Payments](#payments)
8. [Users](#users)
9. [Visits](#visits)
10. [AI Services](#ai-services)

---

## Authentication

### 1. Login
**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "username": "dokter01",
  "password": "password123",
  "role": "DOKTER" // or "PERAWAT"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "uuid",
      "username": "dokter01",
      "email": "dokter@example.com",
      "fullName": "Dr. John Doe",
      "role": "DOKTER",
      "phone": "08123456789",
      "specialization": "Orthodontist",
      "isActive": true
    },
    "token": "jwt_token_here"
  }
}
```

**Validation Rules:**
- `username`: minimum 3 characters
- `password`: minimum 6 characters
- `role`: must be either "DOKTER" or "PERAWAT"

---

### 2. Register Nurse
**Endpoint:** `POST /auth/register`

**Description:** Register new nurse account

**Request Body:**
```json
{
  "username": "perawat01",
  "email": "perawat@example.com",
  "password": "password123",
  "fullName": "Jane Smith",
  "phone": "08123456789",
  "specialization": "General Care"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": "uuid",
      "username": "perawat01",
      "email": "perawat@example.com",
      "fullName": "Jane Smith",
      "role": "PERAWAT",
      "phone": "08123456789",
      "specialization": "General Care",
      "isActive": true
    },
    "token": "jwt_token_here"
  }
}
```

---

### 3. Register Doctor
**Endpoint:** `POST /auth/register-doctor`

**Description:** Register new doctor account

**Request Body:**
```json
{
  "username": "dokter02",
  "email": "dokter2@example.com",
  "password": "password123",
  "fullName": "Dr. Sarah Wilson",
  "phone": "08123456789",
  "specialization": "Pediatric Dentistry"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registrasi dokter berhasil",
  "data": {
    "user": {
      "id": "uuid",
      "username": "dokter02",
      "email": "dokter2@example.com",
      "fullName": "Dr. Sarah Wilson",
      "role": "DOKTER",
      "phone": "08123456789",
      "specialization": "Pediatric Dentistry",
      "isActive": true
    },
    "token": "jwt_token_here"
  }
}
```

---

### 4. Forgot Password
**Endpoint:** `POST /auth/forgot-password`

**Description:** Request password reset link via email

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Link reset password telah dikirim ke email Anda",
  "data": null
}
```

---

### 5. Reset Password
**Endpoint:** `POST /auth/reset-password`

**Description:** Reset password using token from email

**Request Body:**
```json
{
  "email": "user@example.com",
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password berhasil direset",
  "data": null
}
```

---

### 6. Change Password
**Endpoint:** `PUT /auth/change-password`

**Description:** Change password for authenticated user

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password berhasil diubah",
  "data": null
}
```

---

### 7. Get Current User
**Endpoint:** `GET /auth/me`

**Description:** Get authenticated user information

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Data user berhasil diambil",
  "data": {
    "id": "uuid",
    "username": "dokter01",
    "email": "dokter@example.com",
    "fullName": "Dr. John Doe",
    "role": "DOKTER",
    "phone": "08123456789",
    "specialization": "Orthodontist",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Calendar & Leave Management

### 1. Get All Leave Requests
**Endpoint:** `GET /calendar/leaves`

**Description:** Get all leave requests (Doctor only)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "approvedBy": "uuid",
      "startDate": "2024-01-15",
      "endDate": "2024-01-17",
      "leaveType": "SICK",
      "reason": "Flu and fever",
      "status": "APPROVED",
      "rejectionReason": null,
      "approvedAt": "2024-01-14T10:30:00.000Z",
      "createdAt": "2024-01-14T08:00:00.000Z",
      "updatedAt": "2024-01-14T10:30:00.000Z",
      "requester": {
        "id": "uuid",
        "fullName": "Jane Smith",
        "email": "jane@example.com",
        "role": "PERAWAT"
      },
      "approver": {
        "id": "uuid",
        "fullName": "Dr. John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

---

### 2. Get My Leave Requests
**Endpoint:** `GET /calendar/my-leaves`

**Description:** Get leave requests for authenticated user

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "startDate": "2024-01-15",
      "endDate": "2024-01-17",
      "leaveType": "ANNUAL",
      "reason": "Family vacation",
      "status": "PENDING",
      "createdAt": "2024-01-10T09:00:00.000Z",
      "requester": {
        "id": "uuid",
        "fullName": "Jane Smith",
        "email": "jane@example.com",
        "role": "PERAWAT"
      }
    }
  ]
}
```

---

### 3. Get Pending Leave Requests
**Endpoint:** `GET /calendar/pending-leaves`

**Description:** Get pending leave requests from nurses (Doctor only)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "startDate": "2024-02-01",
      "endDate": "2024-02-03",
      "leaveType": "EMERGENCY",
      "reason": "Family emergency",
      "status": "PENDING",
      "createdAt": "2024-01-28T14:30:00.000Z",
      "requester": {
        "id": "uuid",
        "fullName": "Jane Smith",
        "email": "jane@example.com",
        "role": "PERAWAT"
      }
    }
  ]
}
```

---

### 4. Create Leave Request
**Endpoint:** `POST /calendar/leave`

**Description:** Create new leave request

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "startDate": "2024-02-15",
  "endDate": "2024-02-17",
  "leaveType": "SICK",
  "reason": "Medical treatment needed"
}
```

**Leave Types:**
- `SICK`: Sick leave
- `ANNUAL`: Annual leave
- `EMERGENCY`: Emergency leave
- `UNPAID`: Unpaid leave

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "startDate": "2024-02-15",
    "endDate": "2024-02-17",
    "leaveType": "SICK",
    "reason": "Medical treatment needed",
    "status": "PENDING",
    "createdAt": "2024-01-20T10:00:00.000Z",
    "requester": {
      "id": "uuid",
      "fullName": "Jane Smith",
      "email": "jane@example.com",
      "role": "PERAWAT"
    }
  },
  "message": "Pengajuan cuti berhasil dibuat dan menunggu persetujuan dokter"
}
```

**Note:** 
- Doctor's leave requests are auto-approved
- Nurse's leave requests require doctor approval

---

### 5. Update Leave Request
**Endpoint:** `PUT /calendar/leave/:id`

**Description:** Update pending leave request (only by requester)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "startDate": "2024-02-16",
  "endDate": "2024-02-18",
  "leaveType": "SICK",
  "reason": "Updated: Medical treatment and recovery"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "startDate": "2024-02-16",
    "endDate": "2024-02-18",
    "leaveType": "SICK",
    "reason": "Updated: Medical treatment and recovery",
    "status": "PENDING",
    "updatedAt": "2024-01-21T11:00:00.000Z"
  },
  "message": "Pengajuan cuti berhasil diubah"
}
```

---

### 6. Delete Leave Request
**Endpoint:** `DELETE /calendar/leave/:id`

**Description:** Delete pending leave request (only by requester)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Pengajuan cuti berhasil dihapus"
}
```

---

### 7. Approve Leave Request
**Endpoint:** `POST /calendar/leave/:id/approve`

**Description:** Approve leave request (Doctor only)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "APPROVED",
    "approvedBy": "uuid",
    "approvedAt": "2024-01-22T09:30:00.000Z",
    "requester": {
      "fullName": "Jane Smith"
    },
    "approver": {
      "fullName": "Dr. John Doe"
    }
  },
  "message": "Pengajuan cuti Jane Smith berhasil disetujui"
}
```

---

### 8. Reject Leave Request
**Endpoint:** `POST /calendar/leave/:id/reject`

**Description:** Reject leave request (Doctor only)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "rejectionReason": "Insufficient staff during requested period"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "REJECTED",
    "approvedBy": "uuid",
    "approvedAt": "2024-01-22T09:45:00.000Z",
    "rejectionReason": "Insufficient staff during requested period",
    "requester": {
      "fullName": "Jane Smith"
    }
  },
  "message": "Pengajuan cuti Jane Smith berhasil ditolak"
}
```

---

### 9. Get Calendar Events
**Endpoint:** `GET /calendar/events`

**Description:** Get all calendar events (leaves and visits) within date range

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `startDate` (required): Start date (YYYY-MM-DD)
- `endDate` (required): End date (YYYY-MM-DD)

**Example:**
```
GET /calendar/events?startDate=2024-01-01&endDate=2024-01-31
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Cuti - Jane Smith",
      "description": "Family vacation",
      "startDate": "2024-01-15",
      "endDate": "2024-01-17",
      "startTime": "00:00",
      "endTime": "23:59",
      "type": "LEAVE",
      "status": "APPROVED",
      "userId": "uuid",
      "userName": "Jane Smith",
      "patientName": null,
      "color": "bg-yellow-100"
    },
    {
      "id": "uuid",
      "title": "Kunjungan - Ahmad Rizki",
      "description": "Tooth extraction",
      "startDate": "2024-01-20",
      "endDate": "2024-01-20",
      "startTime": "10:00",
      "endTime": "10:30",
      "type": "VISIT",
      "status": "COMPLETED",
      "patientName": "Ahmad Rizki",
      "userName": "Jane Smith",
      "color": "bg-blue-100"
    }
  ]
}
```

---

### 10. Get My Calendar Events
**Endpoint:** `GET /calendar/my-events`

**Description:** Get calendar events for authenticated user

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `startDate` (required): Start date (YYYY-MM-DD)
- `endDate` (required): End date (YYYY-MM-DD)

**Response:** Same structure as "Get Calendar Events"

---

## Dashboard

### 1. Doctor Dashboard Summary
**Endpoint:** `GET /doctor/dashboard/summary`

**Description:** Get dashboard summary for doctor

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Doctor only

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Summary berhasil diambil",
  "data": {
    "totalVisits": 150,
    "todayVisits": 8,
    "monthlyVisits": 45,
    "profile": {
      "id": "uuid",
      "username": "dokter01",
      "fullName": "Dr. John Doe",
      "email": "john@example.com",
      "phone": "08123456789",
      "specialization": "Orthodontist",
      "education": "DDS, University of Indonesia",
      "experience": "10 years",
      "sipNumber": "SIP-001-2020",
      "sipStartDate": "2020-01-01",
      "sipEndDate": "2025-12-31",
      "profilePhoto": "/uploads/profiles/photo.jpg",
      "isActive": true,
      "createdAt": "2020-01-01T00:00:00.000Z"
    },
    "schedules": [
      {
        "day": "Senin",
        "start": "08:00",
        "end": "17:00",
        "location": "POLADC"
      },
      {
        "day": "Selasa",
        "start": "08:00",
        "end": "17:00",
        "location": "POLADC"
      }
    ],
    "practiceStatus": "ACTIVE",
    "sipRemaining": {
      "percentage": 65,
      "years": 1,
      "months": 8,
      "days": 610
    }
  }
}
```

---

### 2. Nurse Dashboard Summary
**Endpoint:** `GET /nurse/dashboard/summary`

**Description:** Get dashboard summary for nurse

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Nurse only

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Summary berhasil diambil",
  "data": {
    "totalVisits": 200,
    "todayVisits": 12,
    "monthlyVisits": 65,
    "profile": {
      "id": "uuid",
      "username": "perawat01",
      "fullName": "Jane Smith",
      "email": "jane@example.com",
      "phone": "08123456789",
      "specialization": "General Care",
      "education": "Bachelor of Nursing",
      "experience": "5 years",
      "profilePhoto": "/uploads/profiles/photo.jpg",
      "isActive": true,
      "createdAt": "2021-06-01T00:00:00.000Z"
    },
    "schedules": [
      {
        "day": "Senin",
        "start": "08:00",
        "end": "16:00",
        "location": "POLADC"
      }
    ]
  }
}
```

---

## Finance

### 1. Get Finance Reports
**Endpoint:** `GET /doctor/finance/reports`

**Description:** Get all finance reports for doctor

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Doctor only

**Query Parameters:**
- `search` (optional): Search by name

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Data laporan keuangan berhasil diambil",
  "data": {
    "reports": [
      {
        "id": "uuid",
        "userId": "uuid",
        "tipe": "BHP",
        "nama": "Bahan Habis Pakai - Januari",
        "prosedur": "Scaling",
        "potongan": 50000,
        "bhpHarga": 200000,
        "bhpKomisi": 15,
        "farmasiHarga": 0,
        "farmasiKomisi": 0,
        "paketHarga": 0,
        "paketKomisi": 0,
        "labHarga": 0,
        "labKomisi": 0,
        "createdAt": "2024-01-31T10:00:00.000Z",
        "updatedAt": "2024-01-31T10:00:00.000Z"
      }
    ],
    "total": {
      "potongan": 150000,
      "bhpHarga": 500000,
      "farmasiHarga": 300000,
      "paketHarga": 1000000,
      "labHarga": 200000
    }
  }
}
```

---

### 2. Create Finance Report
**Endpoint:** `POST /doctor/finance/reports`

**Description:** Create new finance report

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Doctor only

**Request Body:**
```json
{
  "tipe": "BHP",
  "nama": "Bahan Habis Pakai - Februari",
  "prosedur": "Filling",
  "potongan": 30000,
  "bhpHarga": 150000,
  "bhpKomisi": 12,
  "farmasiHarga": 50000,
  "farmasiKomisi": 10,
  "paketHarga": 0,
  "paketKomisi": 0,
  "labHarga": 0,
  "labKomisi": 0
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Laporan keuangan berhasil ditambahkan",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "tipe": "BHP",
    "nama": "Bahan Habis Pakai - Februari",
    "prosedur": "Filling",
    "potongan": 30000,
    "bhpHarga": 150000,
    "bhpKomisi": 12,
    "farmasiHarga": 50000,
    "farmasiKomisi": 10,
    "paketHarga": 0,
    "paketKomisi": 0,
    "labHarga": 0,
    "labKomisi": 0,
    "createdAt": "2024-02-01T09:00:00.000Z",
    "updatedAt": "2024-02-01T09:00:00.000Z"
  }
}
```

---

### 3. Get Procedures
**Endpoint:** `GET /doctor/finance/procedures`

**Description:** Get all procedures for doctor

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Doctor only

**Query Parameters:**
- `search` (optional): Search by name

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Data prosedur berhasil diambil",
  "data": {
    "procedures": [
      {
        "id": "uuid",
        "userId": "uuid",
        "name": "Teeth Whitening",
        "code": "PROC-0001",
        "quantity": 5,
        "salePrice": 500000,
        "avgComm": 15,
        "totalSale": 2500000,
        "totalComm": 375000,
        "createdAt": "2024-01-15T10:00:00.000Z",
        "updatedAt": "2024-01-15T10:00:00.000Z"
      }
    ],
    "total": {
      "totalSale": 5000000,
      "totalComm": 750000
    }
  }
}
```

---

### 4. Create Procedure
**Endpoint:** `POST /doctor/finance/procedures`

**Description:** Create new procedure

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Doctor only

**Request Body:**
```json
{
  "name": "Root Canal Treatment",
  "code": "PROC-0002",
  "quantity": 3,
  "salePrice": 1500000,
  "avgComm": "12.5"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Prosedur berhasil ditambahkan",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "name": "Root Canal Treatment",
    "code": "PROC-0002",
    "quantity": 3,
    "salePrice": 1500000,
    "avgComm": 12.5,
    "totalSale": 4500000,
    "totalComm": 562500,
    "createdAt": "2024-02-01T10:30:00.000Z",
    "updatedAt": "2024-02-01T10:30:00.000Z"
  }
}
```

---

### 5. Get Packages
**Endpoint:** `GET /doctor/finance/packages`

**Description:** Get all packages for doctor

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Doctor only

**Query Parameters:**
- `search` (optional): Search by name

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Data paket berhasil diambil",
  "data": {
    "packages": [
      {
        "id": "uuid",
        "userId": "uuid",
        "name": "Complete Dental Checkup Package",
        "sku": "PKG-0001",
        "quantity": 10,
        "salePrice": 750000,
        "avgComm": 18,
        "totalSale": 7500000,
        "totalComm": 1350000,
        "createdAt": "2024-01-10T09:00:00.000Z",
        "updatedAt": "2024-01-10T09:00:00.000Z"
      }
    ],
    "total": {
      "totalSale": 15000000,
      "totalComm": 2700000
    }
  }
}
```

---

### 6. Create Package
**Endpoint:** `POST /doctor/finance/packages`

**Description:** Create new package

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Doctor only

**Request Body:**
```json
{
  "name": "Orthodontic Consultation Package",
  "sku": "PKG-0002",
  "quantity": 5,
  "salePrice": 1200000,
  "avgComm": "20"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Paket berhasil ditambahkan",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "name": "Orthodontic Consultation Package",
    "sku": "PKG-0002",
    "quantity": 5,
    "salePrice": 1200000,
    "avgComm": 20,
    "totalSale": 6000000,
    "totalComm": 1200000,
    "createdAt": "2024-02-01T11:00:00.000Z",
    "updatedAt": "2024-02-01T11:00:00.000Z"
  }
}
```

---

## Medications

### 1. Get Medications by Visit
**Endpoint:** `GET /medications/visit/:visitId`

**Description:** Get all medications for a specific visit

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Daftar obat berhasil diambil",
  "data": [
    {
      "id": "uuid",
      "visitId": "uuid",
      "patientId": "uuid",
      "name": "Amoxicillin 500mg",
      "quantity": "3x1 tablet",
      "instructions": "Take after meals for 7 days",
      "createdAt": "2024-01-20T10:30:00.000Z",
      "updatedAt": "2024-01-20T10:30:00.000Z"
    },
    {
      "id": "uuid",
      "visitId": "uuid",
      "patientId": "uuid",
      "name": "Paracetamol 500mg",
      "quantity": "3x1 tablet",
      "instructions": "Take when needed for pain",
      "createdAt": "2024-01-20T10:35:00.000Z",
      "updatedAt": "2024-01-20T10:35:00.000Z"
    }
  ]
}
```

---

### 2. Create Medication
**Endpoint:** `POST /medications`

**Description:** Add new medication to a visit

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "visitId": "uuid",
  "patientId": "uuid",
  "name": "Ibuprofen 400mg",
  "quantity": "3x1 tablet",
  "instructions": "Take after meals, avoid if stomach upset"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Obat berhasil ditambahkan",
  "data": {
    "id": "uuid",
    "visitId": "uuid",
    "patientId": "uuid",
    "name": "Ibuprofen 400mg",
    "quantity": "3x1 tablet",
    "instructions": "Take after meals, avoid if stomach upset",
    "createdAt": "2024-01-20T11:00:00.000Z",
    "updatedAt": "2024-01-20T11:00:00.000Z"
  }
}
```

---

### 3. Update Medication
**Endpoint:** `PUT /medications/:id`

**Description:** Update existing medication

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "name": "Ibuprofen 600mg",
  "quantity": "2x1 tablet",
  "instructions": "Take after meals for 5 days"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Obat berhasil diupdate",
  "data": {
    "id": "uuid",
    "visitId": "uuid",
    "patientId": "uuid",
    "name": "Ibuprofen 600mg",
    "quantity": "2x1 tablet",
    "instructions": "Take after meals for 5 days",
    "createdAt": "2024-01-20T11:00:00.000Z",
    "updatedAt": "2024-01-20T11:30:00.000Z"
  }
}
```

---

### 4. Delete Medication
**Endpoint:** `DELETE /medications/:id`

**Description:** Delete medication

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Obat berhasil dihapus",
  "data": null
}
```

---

## Patients

### 1. Get All Patients
**Endpoint:** `GET /doctor/patients`

**Description:** Get all patients with pagination and search

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Items per page
- `search` (optional): Search by name, patient number, medical record number, or phone

**Example:**
```
GET /doctor/patients?page=1&limit=10&search=ahmad
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Daftar pasien berhasil diambil",
  "data": {
    "patients": [
      {
        "id": "uuid",
        "patientNumber": "P-202401-0001",
        "medicalRecordNumber": "RM-202401-0001",
        "fullName": "Ahmad Rizki",
        "dateOfBirth": "1990-05-15",
        "gender": "L",
        "phone": "08123456789",
        "email": "ahmad@example.com",
        "address": "Jl. Sudirman No. 123, Jakarta",
        "bloodType": "O",
        "allergies": "Penicillin",
        "medicalHistory": "Diabetes Type 2",
        "createdAt": "2024-01-15T09:00:00.000Z",
        "lastVisit": "2024-01-20T10:00:00.000Z",
        "lastVisitId": "uuid",
        "lastVisitNumber": "V-20240120-1234567",
        "chiefComplaint": "Tooth pain",
        "lastDiagnosis": "Dental caries",
        "lastServiceName": "Tooth Filling"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

---

### 2. Get Patient by ID
**Endpoint:** `GET /doctor/patients/:id`

**Description:** Get detailed patient information

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Detail pasien berhasil diambil",
  "data": {
    "id": "uuid",
    "patientNumber": "P-202401-0001",
    "medicalRecordNumber": "RM-202401-0001",
    "fullName": "Ahmad Rizki",
    "dateOfBirth": "1990-05-15",
    "gender": "L",
    "phone": "08123456789",
    "email": "ahmad@example.com",
    "address": "Jl. Sudirman No. 123, Jakarta",
    "bloodType": "O",
    "allergies": "Penicillin",
    "medicalHistory": "Diabetes Type 2, Previous tooth extraction (2023)",
    "createdAt": "2024-01-15T09:00:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z",
    "visits": [
      {
        "id": "uuid",
        "visitNumber": "V-20240120-1234567",
        "visitDate": "2024-01-20T10:00:00.000Z",
        "queueNumber": 5,
        "status": "COMPLETED",
        "chiefComplaint": "Tooth pain on upper right molar",
        "bloodPressure": "120/80",
        "notes": "Patient complained of severe pain",
        "totalCost": 350000,
        "nurse": {
          "fullName": "Jane Smith"
        }
      }
    ],
    "_count": {
      "visits": 15
    }
  }
}
```

---

### 3. Get Patient Records
**Endpoint:** `GET /doctor/patients/:id/records`

**Description:** Get patient's medical records (visit history)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Rekam medis berhasil diambil",
  "data": {
    "patient": {
      "id": "uuid",
      "patientNumber": "P-202401-0001",
      "medicalRecordNumber": "RM-202401-0001",
      "fullName": "Ahmad Rizki",
      "dateOfBirth": "1990-05-15",
      "gender": "L",
      "phone": "08123456789",
      "medicalHistory": "Diabetes Type 2"
    }
  }
}
```

---

### 4. Create Patient
**Endpoint:** `POST /doctor/patients`

**Description:** Create new patient or return existing if phone number matches

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "fullName": "Budi Santoso",
  "dateOfBirth": "1985-08-20",
  "gender": "L",
  "phone": "08198765432",
  "email": "budi@example.com",
  "address": "Jl. Thamrin No. 45, Jakarta",
  "bloodType": "A",
  "allergies": "None",
  "medicalHistory": "Hypertension"
}
```

**Validation Rules:**
- `fullName`: minimum 3 characters
- `dateOfBirth`: valid date format
- `gender`: "L" (Male) or "P" (Female)
- `phone`: minimum 10 digits
- `email`: valid email format (optional)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Pasien berhasil ditambahkan",
  "data": {
    "id": "uuid",
    "patientNumber": "P-202402-0010",
    "medicalRecordNumber": "RM-202402-0010",
    "fullName": "Budi Santoso",
    "dateOfBirth": "1985-08-20",
    "gender": "L",
    "phone": "08198765432",
    "email": "budi@example.com",
    "address": "Jl. Thamrin No. 45, Jakarta",
    "bloodType": "A",
    "allergies": "None",
    "medicalHistory": "Hypertension",
    "createdAt": "2024-02-01T09:00:00.000Z",
    "updatedAt": "2024-02-01T09:00:00.000Z"
  }
}
```

---

### 5. Update Patient Medical History
**Endpoint:** `PUT /doctor/patients/:id/medical-history`

**Description:** Update patient's medical history

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "medicalHistory": "Diabetes Type 2, Hypertension, Previous tooth extraction (2023), Root canal treatment (2024-01)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Riwayat medis berhasil diupdate",
  "data": {
    "id": "uuid",
    "patientNumber": "P-202401-0001",
    "medicalRecordNumber": "RM-202401-0001",
    "fullName": "Ahmad Rizki",
    "medicalHistory": "Diabetes Type 2, Hypertension, Previous tooth extraction (2023), Root canal treatment (2024-01)",
    "updatedAt": "2024-02-01T10:30:00.000Z"
  }
}
```

---

## Payments

### 1. Get All Payments
**Endpoint:** `GET /payments`

**Description:** Get all payments with search functionality

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `search` (optional): Search by payment number, visit number, or patient name

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Daftar pembayaran berhasil diambil",
  "data": [
    {
      "id": "uuid",
      "visitId": "uuid",
      "paymentNumber": "PAY-202401-0001",
      "paymentDate": "2024-01-20T11:00:00.000Z",
      "paymentMethod": "CASH",
      "amount": 350000,
      "paidAmount": 400000,
      "changeAmount": 50000,
      "status": "PAID",
      "referenceNumber": null,
      "notes": null,
      "createdAt": "2024-01-20T11:00:00.000Z",
      "visit": {
        "id": "uuid",
        "visitNumber": "V-20240120-1234567",
        "visitDate": "2024-01-20T10:00:00.000Z",
        "patient": {
          "id": "uuid",
          "patientNumber": "P-202401-0001",
          "medicalRecordNumber": "RM-202401-0001",
          "fullName": "Ahmad Rizki"
        }
      }
    }
  ]
}
```

---

### 2. Get Payment by ID
**Endpoint:** `GET /payments/:id`

**Description:** Get detailed payment information

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Detail pembayaran berhasil diambil",
  "data": {
    "id": "uuid",
    "visitId": "uuid",
    "paymentNumber": "PAY-202401-0001",
    "paymentDate": "2024-01-20T11:00:00.000Z",
    "paymentMethod": "TRANSFER",
    "amount": 500000,
    "paidAmount": 500000,
    "changeAmount": 0,
    "status": "PAID",
    "referenceNumber": "TRF20240120001",
    "notes": "Bank BCA transfer",
    "createdAt": "2024-01-20T11:00:00.000Z",
    "visit": {
      "id": "uuid",
      "visitNumber": "V-20240120-1234567",
      "visitDate": "2024-01-20T10:00:00.000Z",
      "patient": {
        "id": "uuid",
        "patientNumber": "P-202401-0001",
        "medicalRecordNumber": "RM-202401-0001",
        "fullName": "Ahmad Rizki",
        "phone": "08123456789"
      }
    }
  }
}
```

---

### 3. Get Payments by Visit
**Endpoint:** `GET /payments/visit/:visitId`

**Description:** Get all payments for a specific visit

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Daftar pembayaran berhasil diambil",
  "data": [
    {
      "id": "uuid",
      "visitId": "uuid",
      "paymentNumber": "PAY-202401-0001",
      "paymentDate": "2024-01-20T11:00:00.000Z",
      "paymentMethod": "CASH",
      "amount": 350000,
      "paidAmount": 350000,
      "changeAmount": 0,
      "status": "PAID",
      "referenceNumber": null,
      "notes": null,
      "createdAt": "2024-01-20T11:00:00.000Z",
      "updatedAt": "2024-01-20T11:00:00.000Z"
    }
  ]
}
```

---

### 4. Create Payment
**Endpoint:** `POST /payments`

**Description:** Create new payment for a visit

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "visitId": "uuid",
  "paymentMethod": "CASH",
  "amount": 350000,
  "paidAmount": 400000,
  "referenceNumber": "",
  "notes": "Full payment"
}
```

**Payment Methods:**
- `CASH`: Cash payment
- `TRANSFER`: Bank transfer
- `CARD`: Credit/Debit card
- `QRIS`: QRIS payment

**Payment Status (Auto-calculated):**
- `PENDING`: paidAmount = 0
- `PARTIAL`: 0 < paidAmount < amount
- `PAID`: paidAmount >= amount
- `REFUNDED`: Manual status update

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Pembayaran berhasil dibuat",
  "data": {
    "id": "uuid",
    "visitId": "uuid",
    "paymentNumber": "PAY-202402-0015",
    "paymentDate": "2024-02-01T14:00:00.000Z",
    "paymentMethod": "CASH",
    "amount": 350000,
    "paidAmount": 400000,
    "changeAmount": 50000,
    "status": "PAID",
    "referenceNumber": "",
    "notes": "Full payment",
    "createdAt": "2024-02-01T14:00:00.000Z",
    "visit": {
      "id": "uuid",
      "visitNumber": "V-20240201-1234567",
      "visitDate": "2024-02-01T10:00:00.000Z",
      "patient": {
        "id": "uuid",
        "patientNumber": "P-202401-0005",
        "medicalRecordNumber": "RM-202401-0005",
        "fullName": "Siti Nurhaliza"
      }
    }
  }
}
```

---

### 5. Update Payment
**Endpoint:** `PUT /payments/:id`

**Description:** Update existing payment

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "paymentMethod": "TRANSFER",
  "amount": 350000,
  "paidAmount": 350000,
  "referenceNumber": "TRF20240201001",
  "notes": "Bank Mandiri transfer"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Pembayaran berhasil diupdate",
  "data": {
    "id": "uuid",
    "visitId": "uuid",
    "paymentNumber": "PAY-202402-0015",
    "paymentDate": "2024-02-01T14:30:00.000Z",
    "paymentMethod": "TRANSFER",
    "amount": 350000,
    "paidAmount": 350000,
    "changeAmount": 0,
    "status": "PAID",
    "referenceNumber": "TRF20240201001",
    "notes": "Bank Mandiri transfer",
    "createdAt": "2024-02-01T14:00:00.000Z",
    "visit": {
      "id": "uuid",
      "visitNumber": "V-20240201-1234567",
      "visitDate": "2024-02-01T10:00:00.000Z",
      "patient": {
        "id": "uuid",
        "patientNumber": "P-202401-0005",
        "medicalRecordNumber": "RM-202401-0005",
        "fullName": "Siti Nurhaliza"
      }
    }
  }
}
```

---

## Users

### 1. Get All Users
**Endpoint:** `GET /users`

**Description:** Get all users (Doctor only)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Doctor only

**Query Parameters:**
- `role` (optional): Filter by role ("DOKTER" or "PERAWAT")

**Example:**
```
GET /users?role=PERAWAT
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Daftar user berhasil diambil",
  "data": [
    {
      "id": "uuid",
      "username": "perawat01",
      "email": "jane@example.com",
      "fullName": "Jane Smith",
      "role": "PERAWAT",
      "phone": "08123456789",
      "specialization": "General Care",
      "isActive": true,
      "createdAt": "2023-06-15T09:00:00.000Z"
    },
    {
      "id": "uuid",
      "username": "dokter02",
      "email": "sarah@example.com",
      "fullName": "Dr. Sarah Wilson",
      "role": "DOKTER",
      "phone": "08198765432",
      "specialization": "Pediatric Dentistry",
      "isActive": true,
      "createdAt": "2023-08-20T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Get User by ID
**Endpoint:** `GET /users/:id`

**Description:** Get detailed user information (Doctor only)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Doctor only

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Detail user berhasil diambil",
  "data": {
    "id": "uuid",
    "username": "perawat01",
    "email": "jane@example.com",
    "fullName": "Jane Smith",
    "role": "PERAWAT",
    "phone": "08123456789",
    "specialization": "General Care",
    "isActive": true,
    "createdAt": "2023-06-15T09:00:00.000Z",
    "_count": {
      "visitsAsNurse": 145,
      "schedules": 52,
      "leaveRequests": 8
    }
  }
}
```

---

### 3. Create User
**Endpoint:** `POST /users`

**Description:** Create new user (Doctor only)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Doctor only

**Request Body:**
```json
{
  "username": "perawat02",
  "email": "nurse2@example.com",
  "password": "password123",
  "fullName": "Maria Garcia",
  "phone": "08187654321",
  "role": "PERAWAT",
  "specialization": "Emergency Care"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User berhasil dibuat",
  "data": {
    "id": "uuid",
    "username": "perawat02",
    "email": "nurse2@example.com",
    "fullName": "Maria Garcia",
    "role": "PERAWAT",
    "phone": "08187654321",
    "specialization": "Emergency Care",
    "isActive": true,
    "createdAt": "2024-02-01T10:00:00.000Z"
  }
}
```

---

### 4. Update User
**Endpoint:** `PUT /users/:id`

**Description:** Update user information (Doctor only)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Doctor only

**Request Body:**
```json
{
  "fullName": "Maria Garcia RN",
  "phone": "08187654321",
  "specialization": "ICU Specialist",
  "isActive": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User berhasil diupdate",
  "data": {
    "id": "uuid",
    "username": "perawat02",
    "email": "nurse2@example.com",
    "fullName": "Maria Garcia RN",
    "role": "PERAWAT",
    "phone": "08187654321",
    "specialization": "ICU Specialist",
    "isActive": true,
    "updatedAt": "2024-02-01T11:00:00.000Z"
  }
}
```

---

### 5. Delete User
**Endpoint:** `DELETE /users/:id`

**Description:** Delete user (Doctor only)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Doctor only

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User berhasil dihapus",
  "data": null
}
```

---

### 6. Toggle User Status
**Endpoint:** `PATCH /users/:id/toggle-status`

**Description:** Activate/deactivate user (Doctor only)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Doctor only

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Status user berhasil diubah",
  "data": {
    "id": "uuid",
    "username": "perawat02",
    "fullName": "Maria Garcia RN",
    "isActive": false
  }
}
```

---

### 7. Get My Profile
**Endpoint:** `GET /users/profile`

**Description:** Get authenticated user's profile (Doctor only)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Doctor only

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profil berhasil diambil",
  "data": {
    "id": "uuid",
    "username": "dokter01",
    "email": "john@example.com",
    "fullName": "Dr. John Doe",
    "role": "DOKTER",
    "phone": "08123456789",
    "specialization": "Orthodontist",
    "education": "DDS, University of Indonesia",
    "experience": "10 years",
    "sipNumber": "SIP-001-2020",
    "sipStartDate": "2020-01-01",
    "sipEndDate": "2025-12-31",
    "profilePhoto": "/uploads/profiles/photo.jpg",
    "isActive": true,
    "createdAt": "2020-01-01T00:00:00.000Z"
  }
}
```

---

### 8. Update My Profile
**Endpoint:** `PUT /users/profile`

**Description:** Update authenticated user's profile (Doctor only)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Doctor only

**Request Body:**
```json
{
  "fullName": "Dr. John Doe DDS",
  "email": "john.doe@example.com",
  "phone": "08123456789",
  "specialization": "Orthodontist & Cosmetic Dentistry",
  "education": "DDS, University of Indonesia; Fellowship in Orthodontics",
  "experience": "12 years",
  "sipNumber": "SIP-001-2020",
  "sipStartDate": "2020-01-01",
  "sipEndDate": "2025-12-31",
  "profilePhoto": "/uploads/profiles/new-photo.jpg"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profil berhasil diupdate",
  "data": {
    "id": "uuid",
    "username": "dokter01",
    "email": "john.doe@example.com",
    "fullName": "Dr. John Doe DDS",
    "role": "DOKTER",
    "phone": "08123456789",
    "specialization": "Orthodontist & Cosmetic Dentistry",
    "education": "DDS, University of Indonesia; Fellowship in Orthodontics",
    "experience": "12 years",
    "sipNumber": "SIP-001-2020",
    "sipStartDate": "2020-01-01",
    "sipEndDate": "2025-12-31",
    "profilePhoto": "/uploads/profiles/new-photo.jpg",
    "isActive": true,
    "updatedAt": "2024-02-01T14:00:00.000Z"
  }
}
```

---

### 9. Delete My Account
**Endpoint:** `DELETE /users/account`

**Description:** Delete authenticated user's account (Doctor only)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Doctor only

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Akun berhasil dihapus",
  "data": null
}
```

---

### 10. Get Nurse Profile
**Endpoint:** `GET /nurse/profile`

**Description:** Get authenticated nurse's profile

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Nurse only

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profil berhasil diambil",
  "data": {
    "id": "uuid",
    "username": "perawat01",
    "email": "jane@example.com",
    "fullName": "Jane Smith",
    "role": "PERAWAT",
    "phone": "08123456789",
    "specialization": "General Care",
    "education": "Bachelor of Nursing",
    "experience": "5 years",
    "sipNumber": "SIPP-123-2022",
    "sipStartDate": "2022-06-01",
    "sipEndDate": "2027-05-31",
    "profilePhoto": "/uploads/profiles/jane.jpg",
    "isActive": true,
    "createdAt": "2022-06-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 11. Update Nurse Profile
**Endpoint:** `PUT /nurse/profile`

**Description:** Update authenticated nurse's profile

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Nurse only

**Request Body:**
```json
{
  "fullName": "Jane Smith RN",
  "email": "jane.smith@example.com",
  "phone": "08123456789",
  "specialization": "Emergency & Critical Care",
  "education": "Bachelor of Nursing, Critical Care Certification",
  "experience": "6 years",
  "sipNumber": "SIPP-123-2022",
  "sipStartDate": "2022-06-01",
  "sipEndDate": "2027-05-31",
  "profilePhoto": "/uploads/profiles/jane-updated.jpg"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profil berhasil diupdate",
  "data": {
    "id": "uuid",
    "username": "perawat01",
    "email": "jane.smith@example.com",
    "fullName": "Jane Smith RN",
    "role": "PERAWAT",
    "phone": "08123456789",
    "specialization": "Emergency & Critical Care",
    "education": "Bachelor of Nursing, Critical Care Certification",
    "experience": "6 years",
    "sipNumber": "SIPP-123-2022",
    "sipStartDate": "2022-06-01",
    "sipEndDate": "2027-05-31",
    "profilePhoto": "/uploads/profiles/jane-updated.jpg",
    "isActive": true,
    "updatedAt": "2024-02-01T15:00:00.000Z"
  }
}
```

---

### 12. Get Profile Completion
**Endpoint:** `GET /nurse/profile/completion`

**Description:** Get profile completion percentage for nurse

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Nurse only

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Kelengkapan profil berhasil diambil",
  "data": {
    "percentage": 90,
    "filledFields": 9,
    "totalFields": 10,
    "missingFields": 1
  }
}
```

---

### 13. Get Current Shift Status
**Endpoint:** `GET /nurse/profile/shift-status`

**Description:** Get current shift status for nurse

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Nurse only

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Status shift berhasil diambil",
  "data": {
    "status": "On Duty",
    "shift": {
      "patientName": "Ahmad Rizki",
      "complaint": "Tooth pain",
      "startTime": "10:00",
      "endTime": "10:30",
      "location": "POLADC"
    },
    "remainingTime": {
      "hours": 0,
      "minutes": 15,
      "formatted": "15 menit"
    }
  }
}
```

---

### 14. Get Account Status
**Endpoint:** `GET /nurse/profile/account-status`

**Description:** Get account status for nurse

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Nurse only

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Status akun berhasil diambil",
  "data": {
    "isActive": true,
    "isVerified": true,
    "completionPercentage": 90,
    "shiftStatus": "On Duty"
  }
}
```

---

### 15. Get License Info
**Endpoint:** `GET /nurse/profile/license`

**Description:** Get license (SIP) information for nurse

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Nurse only

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Informasi lisensi berhasil diambil",
  "data": {
    "hasLicense": true,
    "sipNumber": "SIPP-123-2022",
    "startDate": "2022-06-01",
    "endDate": "2027-05-31",
    "status": "ACTIVE",
    "remaining": {
      "percentage": 68,
      "years": 3,
      "months": 4,
      "days": 1216,
      "formatted": "3 tahun 4 bulan"
    }
  }
}
```

**License Status:**
- `ACTIVE`: More than 90 days remaining
- `EXPIRING_SOON`: 1-90 days remaining
- `EXPIRED`: Past expiration date
- `INACTIVE`: No license information

---

### 16. Delete Nurse Account
**Endpoint:** `DELETE /nurse/account`

**Description:** Delete authenticated nurse's account

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Nurse only

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Akun berhasil dihapus",
  "data": null
}
```

---

## Visits

### 1. Get All Visits
**Endpoint:** `GET /doctor/visits`

**Description:** Get all visits with pagination and filters

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Items per page
- `status` (optional): Filter by status
- `search` (optional): Search by visit number, patient name, patient number, or medical record number

**Visit Status:**
- `WAITING`: Waiting in queue
- `IN_PROGRESS`: Currently being treated
- `COMPLETED`: Treatment completed
- `CANCELLED`: Visit cancelled

**Example:**
```
GET /doctor/visits?page=1&limit=10&status=COMPLETED&search=ahmad
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Daftar kunjungan berhasil diambil",
  "data": {
    "visits": [
      {
        "id": "uuid",
        "visitNumber": "V-20240120-1234567",
        "visitDate": "2024-01-20T10:00:00.000Z",
        "queueNumber": 5,
        "status": "COMPLETED",
        "chiefComplaint": "Tooth pain on upper right molar",
        "bloodPressure": "120/80",
        "notes": "Patient complained of severe pain",
        "totalCost": 350000,
        "createdAt": "2024-01-20T09:30:00.000Z",
        "updatedAt": "2024-01-20T11:00:00.000Z",
        "patient": {
          "id": "uuid",
          "patientNumber": "P-202401-0001",
          "medicalRecordNumber": "RM-202401-0001",
          "fullName": "Ahmad Rizki",
          "phone": "08123456789",
          "gender": "L",
          "dateOfBirth": "1990-05-15"
        },
        "nurse": {
          "id": "uuid",
          "fullName": "Jane Smith"
        }
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 10,
      "totalPages": 15
    }
  }
}
```

---

### 2. Get Visit by ID
**Endpoint:** `GET /doctor/visits/:id`

**Description:** Get detailed visit information

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Detail kunjungan berhasil diambil",
  "data": {
    "id": "uuid",
    "visitNumber": "V-20240120-1234567",
    "visitDate": "2024-01-20T10:00:00.000Z",
    "queueNumber": 5,
    "status": "COMPLETED",
    "chiefComplaint": "Tooth pain on upper right molar",
    "bloodPressure": "120/80",
    "notes": "Patient complained of severe pain, X-ray shows cavity",
    "totalCost": 350000,
    "createdAt": "2024-01-20T09:30:00.000Z",
    "updatedAt": "2024-01-20T11:00:00.000Z",
    "patient": {
      "id": "uuid",
      "patientNumber": "P-202401-0001",
      "medicalRecordNumber": "RM-202401-0001",
      "fullName": "Ahmad Rizki",
      "dateOfBirth": "1990-05-15",
      "gender": "L",
      "phone": "08123456789",
      "email": "ahmad@example.com",
      "address": "Jl. Sudirman No. 123, Jakarta",
      "bloodType": "O",
      "allergies": "Penicillin",
      "medicalHistory": "Diabetes Type 2"
    },
    "nurse": {
      "id": "uuid",
      "fullName": "Jane Smith"
    },
    "payments": [
      {
        "id": "uuid",
        "paymentNumber": "PAY-202401-0001",
        "paymentDate": "2024-01-20T11:00:00.000Z",
        "paymentMethod": "CASH",
        "amount": 350000,
        "paidAmount": 400000,
        "changeAmount": 50000,
        "status": "PAID"
      }
    ]
  }
}
```

---

### 3. Get Visit by Visit Number
**Endpoint:** `GET /doctor/visits/number/:visitNumber`

**Description:** Get visit details by visit number

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Example:**
```
GET /doctor/visits/number/V-20240120-1234567
```

**Response:** Same structure as "Get Visit by ID"

---

### 4. Get Visit by Medical Record Number
**Endpoint:** `GET /doctor/visits/medical-record/:medicalRecordNumber`

**Description:** Get visit details by patient's medical record number

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Example:**
```
GET /doctor/visits/medical-record/RM-202401-0001
```

**Response:** Same structure as "Get Visit by ID"

---

### 5. Create Visit
**Endpoint:** `POST /doctor/visits`

**Description:** Create new visit (register patient visit)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "patient": {
    "id": "uuid",
    "fullName": "Ahmad Rizki",
    "dateOfBirth": "1990-05-15",
    "gender": "L",
    "phone": "08123456789",
    "email": "ahmad@example.com",
    "address": "Jl. Sudirman No. 123, Jakarta",
    "bloodType": "O",
    "allergies": "Penicillin",
    "medicalHistory": "Diabetes Type 2"
  },
  "visit": {
    "visitDate": "2024-02-01T10:00:00.000Z",
    "chiefComplaint": "Regular checkup",
    "bloodPressure": "120/80",
    "notes": "Annual dental checkup",
    "status": "WAITING"
  }
}
```

**Notes:**
- If `patient.id` is provided, the system will use existing patient
- If `patient.id` is not provided but phone number matches existing patient, the system will use that patient
- If patient doesn't exist, a new patient will be created
- Medical record number is auto-generated if patient doesn't have one
- Visit number and queue number are auto-generated
- Visit date can be in the past (up to 30 days) or future

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Kunjungan berhasil dibuat",
  "data": {
    "id": "uuid",
    "patientId": "uuid",
    "nurseId": "uuid",
    "visitNumber": "V-20240201-9876543",
    "visitDate": "2024-02-01T10:00:00.000Z",
    "queueNumber": 1,
    "status": "WAITING",
    "chiefComplaint": "Regular checkup",
    "bloodPressure": "120/80",
    "notes": "Annual dental checkup",
    "totalCost": 0,
    "createdAt": "2024-02-01T09:00:00.000Z",
    "updatedAt": "2024-02-01T09:00:00.000Z",
    "patient": {
      "id": "uuid",
      "patientNumber": "P-202401-0001",
      "medicalRecordNumber": "RM-202401-0001",
      "fullName": "Ahmad Rizki",
      "dateOfBirth": "1990-05-15",
      "gender": "L",
      "phone": "08123456789",
      "email": "ahmad@example.com",
      "address": "Jl. Sudirman No. 123, Jakarta",
      "bloodType": "O",
      "allergies": "Penicillin",
      "medicalHistory": "Diabetes Type 2"
    },
    "nurse": {
      "id": "uuid",
      "fullName": "Jane Smith"
    }
  }
}
```

---

### 6. Get Queue
**Endpoint:** `GET /doctor/visits/queue`

**Description:** Get current visit queue (WAITING and IN_PROGRESS visits from 7 days ago to 7 days ahead)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `search` (optional): Search by visit number, patient name, patient number, or medical record number

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Daftar antrian berhasil diambil",
  "data": [
    {
      "id": "uuid",
      "visitNumber": "V-20240201-1111111",
      "visitDate": "2024-02-01T09:00:00.000Z",
      "queueNumber": 1,
      "status": "IN_PROGRESS",
      "chiefComplaint": "Tooth extraction",
      "bloodPressure": "130/85",
      "notes": null,
      "totalCost": 0,
      "createdAt": "2024-02-01T08:30:00.000Z",
      "patient": {
        "id": "uuid",
        "patientNumber": "P-202401-0010",
        "medicalRecordNumber": "RM-202401-0010",
        "fullName": "Budi Santoso",
        "phone": "08198765432"
      },
      "nurse": {
        "id": "uuid",
        "fullName": "Jane Smith"
      }
    },
    {
      "id": "uuid",
      "visitNumber": "V-20240201-2222222",
      "visitDate": "2024-02-01T10:00:00.000Z",
      "queueNumber": 2,
      "status": "WAITING",
      "chiefComplaint": "Dental checkup",
      "bloodPressure": null,
      "notes": null,
      "totalCost": 0,
      "createdAt": "2024-02-01T09:15:00.000Z",
      "patient": {
        "id": "uuid",
        "patientNumber": "P-202401-0015",
        "medicalRecordNumber": "RM-202401-0015",
        "fullName": "Siti Nurhaliza",
        "phone": "08176543210"
      },
      "nurse": {
        "id": "uuid",
        "fullName": "Maria Garcia"
      }
    }
  ]
}
```

---

### 7. Update Visit Status
**Endpoint:** `PATCH /doctor/visits/:id/status`

**Description:** Update visit status

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "status": "IN_PROGRESS"
}
```

**Valid Status Transitions:**
- `WAITING` → `IN_PROGRESS`, `CANCELLED`
- `IN_PROGRESS` → `COMPLETED`, `CANCELLED`
- `COMPLETED` → No transitions allowed
- `CANCELLED` → No transitions allowed

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Status kunjungan berhasil diupdate",
  "data": {
    "id": "uuid",
    "visitNumber": "V-20240201-2222222",
    "status": "IN_PROGRESS",
    "updatedAt": "2024-02-01T10:05:00.000Z",
    "patient": {
      "fullName": "Siti Nurhaliza"
    }
  }
}
```

---

### 8. Get Completed Visits
**Endpoint:** `GET /doctor/visits/completed`

**Description:** Get all completed visits with pagination

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Items per page
- `search` (optional): Search by visit number, patient name, patient number, or medical record number

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Daftar kunjungan selesai berhasil diambil",
  "data": {
    "visits": [
      {
        "id": "uuid",
        "visitNumber": "V-20240120-1234567",
        "visitDate": "2024-01-20T10:00:00.000Z",
        "queueNumber": 5,
        "status": "COMPLETED",
        "chiefComplaint": "Tooth pain",
        "bloodPressure": "120/80",
        "notes": "Treatment completed successfully",
        "totalCost": 350000,
        "createdAt": "2024-01-20T09:30:00.000Z",
        "updatedAt": "2024-01-20T11:00:00.000Z",
        "patient": {
          "id": "uuid",
          "patientNumber": "P-202401-0001",
          "medicalRecordNumber": "RM-202401-0001",
          "fullName": "Ahmad Rizki",
          "dateOfBirth": "1990-05-15",
          "gender": "L",
          "phone": "08123456789"
        }
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

### 9. Update Visit
**Endpoint:** `PUT /doctor/visits/:id`

**Description:** Update visit information

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "visitDate": "2024-02-01T11:00:00.000Z",
  "chiefComplaint": "Updated: Tooth pain and sensitivity",
  "bloodPressure": "125/82",
  "notes": "Patient also mentioned sensitivity to cold"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Kunjungan berhasil diupdate",
  "data": {
    "id": "uuid",
    "visitNumber": "V-20240201-2222222",
    "visitDate": "2024-02-01T11:00:00.000Z",
    "queueNumber": 2,
    "status": "WAITING",
    "chiefComplaint": "Updated: Tooth pain and sensitivity",
    "bloodPressure": "125/82",
    "notes": "Patient also mentioned sensitivity to cold",
    "totalCost": 0,
    "updatedAt": "2024-02-01T10:30:00.000Z",
    "patient": {
      "id": "uuid",
      "patientNumber": "P-202401-0015",
      "medicalRecordNumber": "RM-202401-0015",
      "fullName": "Siti Nurhaliza"
    },
    "nurse": {
      "id": "uuid",
      "fullName": "Maria Garcia"
    }
  }
}
```

---

### 10. Update Visit Examination
**Endpoint:** `PUT /doctor/visits/:id/examination`

**Description:** Update visit examination details specifically

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "chiefComplaint": "Severe tooth pain on lower left molar",
  "bloodPressure": "130/85",
  "notes": "Patient indicates pain when chewing, X-ray recommended"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Detail pemeriksaan berhasil diupdate",
  "data": {
    "id": "uuid",
    "visitNumber": "V-20240201-2222222",
    "chiefComplaint": "Severe tooth pain on lower left molar",
    "bloodPressure": "130/85",
    "notes": "Patient indicates pain when chewing, X-ray recommended",
    "updatedAt": "2024-02-01T10:45:00.000Z",
    "patient": {
      "fullName": "Siti Nurhaliza"
    }
  }
}
```

---

### 11. Get Visit by Medical Record (Nurse)
**Endpoint:** `GET /nurse/visits/medical-record/:medicalRecordNumber`

**Description:** Get most recent completed visit by patient's medical record number (Nurse access)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Access:** Nurse only

**Example:**
```
GET /nurse/visits/medical-record/RM-202401-0001
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Berhasil mengambil data kunjungan",
  "data": {
    "id": "uuid",
    "visitNumber": "V-20240120-1234567",
    "visitDate": "2024-01-20T10:00:00.000Z",
    "queueNumber": 5,
    "status": "COMPLETED",
    "chiefComplaint": "Tooth pain on upper right molar",
    "bloodPressure": "120/80",
    "notes": "Treatment completed successfully",
    "totalCost": 350000,
    "createdAt": "2024-01-20T09:30:00.000Z",
    "updatedAt": "2024-01-20T11:00:00.000Z",
    "patient": {
      "id": "uuid",
      "patientNumber": "P-202401-0001",
      "medicalRecordNumber": "RM-202401-0001",
      "fullName": "Ahmad Rizki",
      "dateOfBirth": "1990-05-15",
      "gender": "L",
      "address": "Jl. Sudirman No. 123, Jakarta",
      "phone": "08123456789",
      "email": "ahmad@example.com",
      "allergies": "Penicillin",
      "medicalHistory": "Diabetes Type 2"
    },
    "medications": [
      {
        "id": "uuid",
        "visitId": "uuid",
        "patientId": "uuid",
        "name": "Amoxicillin 500mg",
        "quantity": "3x1 tablet",
        "instructions": "Take after meals for 7 days",
        "createdAt": "2024-01-20T10:30:00.000Z",
        "updatedAt": "2024-01-20T10:30:00.000Z"
      }
    ]
  }
}
```

---

## AI Services

### 1. Get Prediction
**Endpoint:** `GET /ai/predict`

**Description:** Get AI predictions from external AI service

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Prediction successful",
  "data": [
    {
      "date": "2024-02",
      "predicted_visits": 125,
      "confidence": 0.85
    },
    {
      "date": "2024-03",
      "predicted_visits": 132,
      "confidence": 0.82
    }
  ]
}
```

**Error Responses:**

Service Unavailable (503):
```json
{
  "status": "error",
  "message": "Layanan prediksi sedang tidak tersedia. Pastikan AI Service berjalan di http://localhost:8000",
  "data": []
}
```

Timeout (504):
```json
{
  "status": "error",
  "message": "Request timeout. AI Service membutuhkan waktu terlalu lama.",
  "data": []
}
```

---

### 2. Chat with Tika (AI Assistant)
**Endpoint:** `POST /ai/chat`

**Description:** Chat with Tika AI assistant

**Request Body:**
```json
{
  "message": "Apa saja layanan yang tersedia di klinik?",
  "user_name": "Ahmad"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "reply": "Di klinik kami tersedia berbagai layanan seperti konsultasi gigi, scaling, penambalan, pencabutan gigi, pemutihan gigi, dan pemasangan behel. Apakah ada layanan tertentu yang ingin Anda ketahui lebih lanjut?"
}
```

**Error Responses:**

Bad Request (400):
```json
{
  "status": "error",
  "reply": "Pesan tidak boleh kosong"
}
```

Service Unavailable (503):
```json
{
  "status": "error",
  "reply": "Maaf, Tika sedang offline. Pastikan AI Service berjalan di http://localhost:8000"
}
```

---

## Error Responses

### Common Error Codes

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    {
      "field": "email",
      "message": "Format email tidak valid"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Token tidak ditemukan"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Akses ditolak"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource tidak ditemukan"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Data Types & Enums

### UserRole
```typescript
enum UserRole {
  DOKTER = "DOKTER",
  PERAWAT = "PERAWAT"
}
```

### Gender
```typescript
enum Gender {
  L = "L",  // Laki-laki (Male)
  P = "P"   // Perempuan (Female)
}
```

### VisitStatus
```typescript
enum VisitStatus {
  WAITING = "WAITING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}
```

### LeaveType
```typescript
enum LeaveType {
  SICK = "SICK",
  ANNUAL = "ANNUAL",
  EMERGENCY = "EMERGENCY",
  UNPAID = "UNPAID"
}
```

### LeaveStatus
```typescript
enum LeaveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}
```

### PaymentMethod
```typescript
enum PaymentMethod {
  CASH = "CASH",
  TRANSFER = "TRANSFER",
  CARD = "CARD",
  QRIS = "QRIS"
}
```

### PaymentStatus
```typescript
enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  PARTIAL = "PARTIAL",
  REFUNDED = "REFUNDED"
}
```

---

## Rate Limiting & Best Practices

### Rate Limiting
- Not currently implemented
- Recommended: 100 requests per minute per user

### Best Practices
1. **Always include Authorization header** for protected endpoints
2. **Use pagination** for list endpoints to improve performance
3. **Validate input** on client side before sending requests
4. **Handle errors gracefully** using the standard error response format
5. **Use specific endpoints** rather than filtering on client side
6. **Cache static data** (e.g., enum values) on client side
7. **Implement retry logic** for network failures
8. **Use HTTPS** in production environment

---

## Changelog

### Version 1.0.1 (Current)
- Initial API documentation
- Authentication system
- Calendar & Leave management
- Dashboard for Doctor & Nurse
- Finance management
- Medication tracking
- Patient management
- Payment system
- User management
- Visit management
- AI services integration

---

**Last Updated:** December 24, 2025  
**API Version:** 1.0.1  
**Base URL:** http://localhost:5000/api
