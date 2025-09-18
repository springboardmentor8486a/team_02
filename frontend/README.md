
# 🏛️ Civic Issue Reporting App

A comprehensive React-based civic engagement platform that empowers citizens to report, track, and resolve community issues through collaborative action between citizens, volunteers, and local authorities.

## ✨ Features

### 🔐 Authentication & User Management
- **Multi-step Registration**: 3-step signup process with validation
- **Social Login**: Google, Facebook, and Twitter integration with credential dialogs
- **Role-based Access**: Citizen, Volunteer, and Admin roles
- **Profile Management**: Complete profile editing with photo upload
- **Security Settings**: Password management and privacy controls

### 📱 Core Functionality
- **Issue Reporting**: Multi-step form with photo upload, location selection, and categories
- **Interactive Map**: Location selection with search, geolocation, and markers
- **Voting System**: Community voting on reported issues
- **Comment System**: Real-time commenting with user avatars
- **Issue Tracking**: Status updates and progress monitoring

### 🛠️ Admin Features
- **Enhanced Admin Panel**: User management, analytics, and zone management
- **User Administration**: Role changes, status management, search/filtering
- **Analytics Dashboard**: Comprehensive statistics and reporting
- **Zone Management**: Geographic zone assignment and coordination

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with proper breakpoints
- **Modern UI**: Beautiful interface with Tailwind CSS and Radix UI
- **Accessibility**: WCAG compliant components
- **Professional Design**: Consistent branding and smooth animations

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd civic-issue-reporting-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (Radix UI + Tailwind)
│   ├── auth-form.tsx    # Authentication forms
│   ├── dashboard.tsx    # User dashboard
│   ├── report-issue.tsx # Issue reporting form
│   ├── admin-panel.tsx  # Admin management
│   └── ...              # Other feature components
├── styles/              # Global styles
├── utils/               # Utility functions
└── supabase/            # Backend integration
```

## 🎯 Demo Credentials

For testing purposes, you can use these demo accounts:

- **Admin**: `admin@cleanstreet.com` / `password123`
- **Volunteer**: `volunteer@cleanstreet.com` / `password123`
- **Citizen**: `citizen@cleanstreet.com` / `password123`

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, Radix UI
- **State Management**: React Hooks, Context API
- **Backend**: Supabase (Authentication, Database, Storage)
- **Maps**: Interactive map component with geolocation
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📱 Features Overview

### For Citizens
- Report civic issues with photos and location
- Vote and comment on community issues
- Track progress of reported issues
- Manage profile and preferences

### For Volunteers
- View assigned issues
- Update issue status
- Coordinate with community members
- Access volunteer resources

### For Administrators
- Manage users and roles
- Monitor platform analytics
- Assign issues to volunteers
- Generate reports and insights

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@cleanstreet.org or create an issue in this repository.

---

**Built with ❤️ for better communities**
  