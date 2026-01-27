# VidhiVidhan 🚀

VidhiVidhan is a full-stack **MERN-based Event Management System** designed to streamline event operations, client handling, and invoicing for administrators. The platform provides a centralized dashboard to manage events, clients, invoices, and administrative activities efficiently.

---

## ✨ Features

* **Admin Dashboard**

  * Centralized overview of events, clients, invoices, and recent activities
  * Clean and responsive UI for quick decision-making

* **Event Management**

  * Create, update, view, and delete events
  * Maintain structured event details for better organization

* **Client Management**

  * Manage a complete list of clients
  * Associate clients with events and invoices

* **Invoice Generator**

  * Create professional invoices dynamically
  * Auto-calculate totals and taxes
  * Generate downloadable **PDF invoices**
  * Send invoices directly to clients

* **Activity Log**

  * Track admin actions such as event creation, invoice generation, and updates
  * Improves transparency and accountability

* **Admin Profile**

  * Manage admin details securely
  * Profile customization support

---

## 🛠 Tech Stack

**Frontend**

* React.js
* CSS / Modular styling
* Axios

**Backend**

* Node.js
* Express.js
* RESTful APIs

**Database**

* MongoDB

**Other Tools & Libraries**

* PDF generation for invoices
* JWT-based authentication (if implemented)

---

## 📂 Project Structure

```
VidhiVidhan/
├── client/        # React frontend
├── server/        # Node & Express backend
├── models/        # MongoDB schemas
├── routes/        # API routes
├── controllers/   # Business logic
└── README.md
```

---

## ⚙️ Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/lakshya2106/VidhiVidhan.git
```

2. **Install dependencies**

```bash
cd VidhiVidhan
npm install
cd client
npm install
```

3. **Environment Variables**
   Create a `.env` file in the server directory and add:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

4. **Run the application**

```bash
# Backend
npm run server

# Frontend
cd client
npm start
```

---

## 🚀 Future Enhancements

* Role-based access control
* Email notifications for invoices
* Event analytics and reports
* Payment gateway integration

---

## 👤 Author

**Lakshyaraj Purbia**
GitHub: [https://github.com/lakshya2106](https://github.com/lakshya2106)

---

## 📜 License

This project is licensed under the MIT License.
