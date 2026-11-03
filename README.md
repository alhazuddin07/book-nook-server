# 📚 BookNook – A Small Online Library

**BookNook** is a modern online library management application where users can explore books, borrow their favorite reads, and manage their personal book collections. It provides a simple and user-friendly experience for discovering, borrowing, and sharing knowledge.

## 🌐 Live Demo

- **Live Website:** [Add your live website URL]
- **Frontend Repository:** [Add frontend GitHub URL]
- **Backend Repository:** [Add backend GitHub URL]

## ✨ Features

### 👤 Authentication
- User registration and login with email and password.
- Google authentication.
- Secure authentication using Better Auth.
- Protected routes for authenticated users.
- User profile with name and profile image.
- Logout functionality.

### 📖 Book Management
- Browse all available books.
- View detailed information about individual books.
- Add new books to the library.
- Edit and delete books added by the logged-in user.
- Explore newly added books.
- Categorize books into Fiction, Science, History, Kids, and Others.

### 📚 Borrowing System
- Borrow books through an interactive modal.
- View personal borrowed books.
- Return borrowed books.
- Automatically update available book copies.
- Prevent duplicate active borrowing of the same book.

### 🎨 User Experience
- Responsive design for mobile, tablet, and desktop.
- Clean and modern interface.
- Loading states and toast notifications.
- Custom error and not-found pages.
- Easy navigation between pages.

## 🛠️ Technologies Used

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Better Auth
- Embla Carousel
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB
- Better Auth JWT / JWT verification

### Tools & Services
- Git & GitHub
- Vercel
- imgbb (Image Hosting)

## 📂 Project Structure

```text
BookNook/
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── books/
│   │   ├── add-book/
│   │   ├── my-books/
│   │   ├── my-borrows/
│   │   ├── profile/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── home/
│   │   ├── shared/
│   │   └── ui/
│   ├── lib/
│   └── public/
│
└── backend/
    ├── index.js
    ├── package.json
    └── .env
```

*The folder structure may vary depending on your implementation.*

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Navigate to the Frontend

```bash
cd frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
```

Add any additional OAuth credentials required for Google authentication.

### 5. Start the Frontend

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:3000
```

### 6. Set Up the Backend

Open another terminal:

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Configure any additional environment variables required by your backend.

Start the backend:

```bash
npm run dev
```

Backend will run at:

```text
http://localhost:5000
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/books` | Get all books |
| GET | `/books/:id` | Get a single book |
| POST | `/books` | Add a new book |
| PATCH | `/books/:id` | Update a book |
| DELETE | `/books/:id` | Delete a book |
| POST | `/borrows` | Borrow a book |
| GET | `/borrows` | Get borrowed books |
| DELETE | `/borrows/:id` | Return a borrowed book |

**Note:** Protected endpoints require valid authentication.

## 🔐 Security

- Protected pages require user authentication.
- Backend routes validate authentication tokens.
- Users can manage only their own book listings.
- Borrowing operations prevent duplicate active borrows.
- Sensitive credentials are stored in environment variables.

## 📸 Screenshots

Add screenshots of your application here:

| Home Page | All Books |
|---|---|
| Add your home page screenshot | Add your books page screenshot |

| Book Details | My Borrows |
|---|---|
| Add your details page screenshot | Add your borrowed books screenshot |

## 🚀 Future Improvements

- Book reviews and ratings.
- Advanced book search and filtering.
- Reading lists and favorites.
- Book availability notifications.
- Admin dashboard and analytics.

## 👨‍💻 Developer

**Alhaz Uddin**

Junior Web Developer

- GitHub: [Your GitHub Profile](https://github.com/your-username)
- LinkedIn: [Your LinkedIn Profile](https://www.linkedin.com/in/your-username/)

---

⭐ If you find this project interesting, feel free to explore the repository and share your feedback!

**BookNook – Discover, Borrow, Read & Share.**
