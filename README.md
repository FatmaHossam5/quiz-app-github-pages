# QuizWiz - Interactive Quiz Application

A modern, feature-rich quiz application built with React, TypeScript, and Redux. QuizWiz provides a comprehensive platform for creating, managing, and taking quizzes with separate interfaces for instructors and students.

## 🚀 **Features**

### **For Instructors**
- ✅ **Quiz Management** - Create, edit, and manage quizzes
- ✅ **Question Bank** - Comprehensive question management system
- ✅ **Group Management** - Organize students into groups
- ✅ **Real-time Results** - View and analyze quiz results
- ✅ **Student Management** - Add and manage student accounts

### **For Students**
- ✅ **Quiz Taking** - Interactive quiz interface
- ✅ **Join by Code** - Easy quiz access via unique codes
- ✅ **Progress Tracking** - View completed and upcoming quizzes
- ✅ **Results Dashboard** - Detailed performance analytics

## 🎯 **Demo Accounts**

To help you explore the platform, we've provided demo accounts for both user roles:

### **Instructor Account**
- **Email**: `instructor@demo.com`
- **Password**: `12345678`
- **Features**: Full access to quiz creation, question management, student management, and results analysis

### **Student Account**
- **Email**: `student@demo.com`
- **Password**: `12345678`
- **Features**: Quiz taking, progress tracking, and results viewing

> 💡 **Pro Tip**: Use these demo accounts to experience both sides of the platform. Log out and switch between accounts to explore different user roles!

## 🛠️ **Tech Stack**

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Authentication**: JWT with cookie storage

## 📁 **Project Structure**

```
src/
├── Components/          # Feature components
│   ├── Groups/         # Group management
│   ├── Login/          # Authentication
│   ├── Questions/      # Question management
│   ├── Quizzes/        # Quiz management
│   ├── Students/       # Student management
│   └── StudentComponents/ # Student-specific components
├── Shared/             # Reusable components
│   ├── AuthLayout/     # Authentication layout
│   ├── MasterLayout/   # Main application layout
│   ├── Modal/          # Modal components
│   └── ProtectedRoute/ # Route protection
├── Redux/              # State management
│   ├── Slices/         # Redux slices
│   └── Store.ts        # Store configuration
├── services/           # API services
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
└── assets/             # Static assets
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn

### **Installation**

1. **Clone the repository**
```bash
git clone <repository-url>
cd quiz-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

## 🔧 **Available Scripts**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🎯 **Key Improvements Made**

### **1. TypeScript Enhancement**
- ✅ Comprehensive type definitions
- ✅ Replaced `any` types with proper interfaces
- ✅ Enhanced IntelliSense support

### **2. API Layer Refactoring**
- ✅ Centralized API service layer
- ✅ Consistent error handling
- ✅ Automatic token management

### **3. Custom Hooks**
- ✅ Authentication hooks
- ✅ Data fetching hooks
- ✅ Proper state management

### **4. Error Handling**
- ✅ Error boundary implementation
- ✅ User-friendly error messages
- ✅ Development error details

## 📋 **User Roles**

### **Instructor Dashboard**
- Quiz creation and management
- Question bank management
- Student group organization
- Results analysis and reporting

### **Student Interface**
- Quiz participation
- Progress tracking
- Performance analytics
- Easy quiz access via codes

## 🔐 **Authentication**

The application uses JWT-based authentication with role-based access control:

- **Instructors**: Full access to quiz management features
- **Students**: Limited access to quiz-taking features
- **Protected Routes**: Automatic redirection based on user roles

## 🎨 **Design System**

- **Colors**: Custom color palette with primary and secondary colors
- **Typography**: Consistent font sizing and spacing
- **Components**: Reusable UI components with consistent styling
- **Responsive**: Mobile-first responsive design

## 📊 **State Management**

Redux Toolkit is used for state management with the following slices:

- **AuthSlice**: User authentication and authorization
- **UpcomingQuizzesSlice**: Upcoming quiz management
- **CompletedQuizzesSlice**: Completed quiz tracking
- **GroupSlice**: Group management
- **StudentsSlice**: Student data management

## 🔄 **API Integration**

The application integrates with a RESTful API for:

- User authentication and authorization
- Quiz CRUD operations
- Question management
- Group and student management
- Results and analytics

## 🚀 **Future Enhancements**

See [IMPROVEMENTS_SUMMARY.md](./IMPROVEMENTS_SUMMARY.md) for detailed improvement plans:

- **Testing Framework**: Comprehensive test coverage
- **Performance Optimization**: Lazy loading and code splitting
- **Accessibility**: WCAG compliance
- **Real-time Features**: WebSocket integration
- **PWA Support**: Offline functionality

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 **License**

This project is licensed under the MIT License.

## 👥 **Team**

Developed with ❤️ by the QuizWiz team.

---

For detailed technical improvements and recommendations, see [IMPROVEMENTS_SUMMARY.md](./IMPROVEMENTS_SUMMARY.md).
