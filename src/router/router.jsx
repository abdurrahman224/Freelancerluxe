import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import NotFound from '../pages/error/NotFound';

// Public Layout and Pages
import RootLayout from '../layout/public/RootLayout';
// Views
import HomeView from '../pages/public/public_Home/HomeView';
import GameView from '../pages/public/game/GameView';

// Auth Layout and Pages
import AuthLayout from '../layout/auth/AuthLayout';
// Views
import RegisterView from '../pages/auth/RegisterView';
import LoginView from '../pages/auth/LoginView';
import ResetPasswordView from '../pages/auth/ResetPasswordView';
import SetPasswordView from '../pages/auth/SetPasswordView';
// Admin
import AdminLogin from '../pages/admin/adminLogin/AdminLogin';
import AdminLayout from '../layout/admin/AdminLayout';
import Overview from '../pages/admin/overview/Overview';
import Management from '../pages/admin/management/Mangement';
import Leadboard from '../pages/admin/leaderboard/Leadboard';
import Settings from '../pages/admin/settings/Settings';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomeView />} />
      </Route>
      <Route path="/game" element={<GameView />} />

      <Route path="auth" element={<AuthLayout />}>
        {/* Auth related routes can be added here (register/reset/set-password remain under /auth) */}
        <Route path="register" element={<RegisterView />} />
        <Route path="reset-password" element={<ResetPasswordView />} />
        <Route path="set-password" element={<SetPasswordView />} />
      </Route>

     
      <Route path="/login" element={<LoginView />} />

      {/* adminLogin */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* admindashboard */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/overview" element={<Overview />} />
        <Route path="/admin/players" element={<Management />} />
        <Route path="/admin/leaderboard" element={<Leadboard />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </>
  )
);

export default router;
