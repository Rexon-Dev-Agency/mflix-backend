mflix-backend/
├─ src/
│  ├─ config/
│  │  └─ firebase.ts           # Firebase Admin SDK (Firestore, Auth)
│  ├─ routes/
│  │  ├─ authRoutes.ts         # Signup/Login routes
│  │  ├─ userRoutes.ts         # User profile, watchlist, preferences
│  │  ├─ movieRoutes.ts        # Proxy/search movies from external API
│  │  ├─ reviewRoutes.ts       # Reviews CRUD
│  │  └─ streamRoutes.ts       # Streaming URLs / watch progress
│  ├─ controllers/
│  │  ├─ authController.ts
│  │  ├─ userController.ts
│  │  ├─ movieController.ts
│  │  ├─ reviewController.ts
│  │  └─ streamController.ts
│  ├─ services/
│  │  └─ externalMovieAPI.ts   # Axios/fetch wrappers for external movie API
│  ├─ middleware/
│  │  └─ verifyFirebaseToken.ts # Auth middleware
│  ├─ handlers/
│  │  └─ errorHandler.ts       # Centralized error handling
│  ├─ utils/
│  │  └─ helpers.ts            # Any helpers, e.g., caching
│  ├─ app.ts                   # Express app setup
│  └─ server.ts                # Server startup
├─ package.json
├─ tsconfig.json
└─ README.md
Mflix Backend structure