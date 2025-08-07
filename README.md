# 🔸 YASHBLOG

YASHBLOG is a **full-stack modern blogging platform** featuring secure authentication, rich text editing, real-time interactions, and a beautiful responsive UI. The project is split into two main folders: a frontend built with **Next.js 15** and **React 19**, and a backend built with **Express.js** and **MongoDB**.

## 🌐 Live Demo

- **Frontend:** [Coming Soon - Deploy on Vercel](https://yashblog.vercel.app)
- **Backend (API):** [Coming Soon - Deploy on Render](https://yashblog-api.onrender.com)

---

## 📁 Project Structure

```
YASHBLOG-main/
│
├── Backend/                  → Express.js backend
│   ├── controllers/          → Route logic (user, post, comment)
│   ├── middleware/           → Auth, validation, security middleware
│   ├── models/               → Mongoose models (User, Post, Comment)
│   ├── routes/               → API route files
│   ├── tests/                → Unit & integration tests
│   ├── .env                  → Environment variables
│   └── server.js             → App entry point
│
└── Frontend/                 → Next.js frontend
    ├── app/                  → App router pages & layouts
    ├── components/           → Reusable UI components
    ├── lib/                  → API utilities, hooks & helpers
    ├── redux/                → Redux state management
    ├── public/               → Static assets
    ├── .env.local            → Environment variables
    └── tailwind.config.js    → TailwindCSS configuration
```

---

## 🚀 Tech Stack

### Frontend

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router
- **React:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4.x](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Rich Text Editor:** [Tiptap](https://tiptap.dev/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Server State:** [TanStack Query](https://tanstack.com/query)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Animations:** [Motion](https://motion.dev/) + Custom CSS animations
- **Icons:** [Lucide React](https://lucide.dev/)
- **Toast Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Date Utilities:** [date-fns](https://date-fns.org/)

### Backend

- **Server:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
- **Authentication:** JWT (HTTP-only cookies)
- **Password Hashing:** [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- **Validation:** [express-validator](https://express-validator.github.io/)
- **Security:** [express-rate-limit](https://www.npmjs.com/package/express-rate-limit), CORS, Security headers
- **Environment:** [dotenv](https://www.npmjs.com/package/dotenv)
- **Testing:** [Jest](https://jestjs.io/) + [Supertest](https://www.npmjs.com/package/supertest)

---

## 🔐 Authentication & Security

- **JWT-based authentication** with HTTP-only cookies
- **Secure password hashing** using bcryptjs with salt rounds
- **Rate limiting** on authentication and API endpoints
- **Input validation & sanitization** for all user inputs
- **CORS protection** with credential support
- **Security headers** (CSP, XSS protection, etc.)
- **Protected routes** using middleware and React route guards
- **URL validation** for profile pictures with trusted domain whitelist

---

## 📦 API Endpoints

### Auth Routes

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/api/user/register` | Register new user              |
| POST   | `/api/user/login`    | Login user & set HTTP cookie   |
| POST   | `/api/user/logout`   | Logout user & clear cookie     |
| GET    | `/api/user/current`  | Get current authenticated user |

### User Routes (🔐 Protected)

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| GET    | `/api/user/profile`    | Get user profile     |
| PUT    | `/api/user/profile`    | Update user profile  |
| GET    | `/api/user/:id/posts`  | Get posts by user    |
| PUT    | `/api/user/follow/:id` | Follow/unfollow user |

### Post Routes

| Method | Endpoint               | Description                  |
| ------ | ---------------------- | ---------------------------- |
| GET    | `/api/post`            | Get all published posts      |
| GET    | `/api/post/:slug`      | Get single post by slug      |
| POST   | `/api/post`            | Create new post (🔐)         |
| PUT    | `/api/post/:slug`      | Update post (🔐 Author only) |
| DELETE | `/api/post/:slug`      | Delete post (🔐 Author only) |
| PUT    | `/api/post/:slug/like` | Like/unlike post (🔐)        |

### Comment Routes (🔐 Protected)

| Method | Endpoint                    | Description             |
| ------ | --------------------------- | ----------------------- |
| GET    | `/api/comment/post/:postId` | Get comments by post    |
| POST   | `/api/comment`              | Create new comment      |
| PUT    | `/api/comment/:id`          | Update comment (Author) |
| DELETE | `/api/comment/:id`          | Delete comment (Author) |

---

## 💡 Features

### ✅ Completed Features

- **User Authentication System**

  - Secure registration & login
  - Protected routes & middleware
  - Profile management with avatar support
  - Follow/unfollow functionality

- **Blog Management**

  - Rich text editor with Tiptap
  - Create, edit, delete posts
  - Slug-based URLs for SEO
  - Post categories and tagging
  - Draft/published status

- **Interactive Features**

  - Like/unlike posts with optimistic updates
  - Comment system with nested replies
  - Real-time view tracking
  - Post sharing functionality

- **User Interface**

  - Responsive design for all devices
  - Beautiful animations and transitions
  - Dark/light theme support
  - Search and filtering capabilities
  - Loading states and error handling

- **Performance & SEO**
  - Server-side rendering with Next.js
  - Optimized images and assets
  - Database indexing for fast queries
  - SEO-friendly URLs and metadata

### 🔜 Upcoming Features

- **Advanced Editor Features**

  - Image upload and management
  - Code syntax highlighting
  - Table support
  - Media embeds (YouTube, Twitter)

- **Social Features**

  - User profiles with bio and social links
  - Post bookmarking
  - User notifications
  - Email subscriptions

- **Content Management**
  - Advanced search with filters
  - Content moderation
  - Analytics dashboard
  - RSS feed generation

---

## ⚙️ Environment Variables

### Backend `.env`

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/yashblog

# JWT Secrets
JWT_SECRET=your_super_long_jwt_secret_here
REFRESH_TOKEN_SECRET=your_super_long_refresh_secret_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env.local`

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# App Configuration
NEXT_PUBLIC_APP_NAME=YASHBLOG
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/YASHDEV42/YASHBLOG.git
   cd YASHBLOG-main
   ```

2. **Backend Setup**

   ```bash
   cd Backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend Setup** (in a new terminal)

   ```bash
   cd Frontend
   npm install
   cp .env.example .env.local
   # Edit .env.local with your configuration
   npm run dev
   ```

4. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

### Scripts

#### Backend

```bash
npm run dev          # Development with nodemon
npm start            # Production server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

#### Frontend

```bash
npm run dev          # Development server
npm run build        # Production build
npm start            # Start production server
npm run lint         # ESLint check
npm run type-check   # TypeScript check
```

---

## 🧪 Testing

The project includes comprehensive testing setup:

- **Unit Tests** for validation middleware
- **Integration Tests** for API endpoints
- **Authentication Tests** for login/register flows
- **Component Tests** (coming soon)

Run tests with:

```bash
cd Backend
npm test
```

---

## ☁️ Deployment

### Recommended Deployment Stack

- **Frontend:** [Vercel](https://vercel.com/) (Automatic Next.js optimization)
- **Backend:** [Render](https://render.com/) (Free tier with persistent storage)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas) (Free tier available)

### Deployment Configuration

1. **Environment Variables**: Set up production environment variables
2. **Database**: Use MongoDB Atlas for production
3. **CORS**: Update FRONTEND_URL to production domain
4. **Security**: Use strong JWT secrets and enable security headers

---

## 🔒 Security Features

- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive validation for all inputs
- **XSS Protection**: Content sanitization and security headers
- **CSRF Protection**: SameSite cookie configuration
- **SQL Injection Prevention**: MongoDB with Mongoose ODM
- **Password Security**: bcryptjs with salt rounds
- **Secure Headers**: Content Security Policy and other security headers

---

## 📈 Performance Optimizations

- **Database Indexing**: Strategic indexes for fast queries
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting with Next.js
- **Caching**: HTTP-only cookies and smart cache strategies
- **Bundle Optimization**: Tree shaking and minification

---

## 🎨 Design System

- **Typography**: Responsive text scaling with Tailwind
- **Colors**: Consistent color palette with CSS variables
- **Components**: Reusable components with variant support
- **Animations**: Smooth transitions and micro-interactions
- **Icons**: Lucide React icon library
- **Responsive**: Mobile-first responsive design

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🧑‍💻 Author

**Made with ❤️ by [YASHDEV42](https://github.com/YASHDEV42)**

- GitHub: [@YASHDEV42](https://github.com/YASHDEV42)
- Portfolio: [Coming Soon](https://yashdev.dev)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful component library
- [Tiptap](https://tiptap.dev/) for the rich text editor
- [MongoDB](https://www.mongodb.com/) for the database solution

---

## 📊 Project Stats

- **Lines of Code**: ~5,000+
- **Components**: 20+
- **API Endpoints**: 15+
- **Test Coverage**: 80%+
- **Performance Score**: 95+ (Lighthouse)

---

**YASHBLOG - Where stories come to life! ✨**
