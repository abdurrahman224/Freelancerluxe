import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import SharedHeroBackground from '../../../components/SharedHeroBackground';
import { useAuth } from '../../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/overview', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const html = document.documentElement;
    const hadDark = html.classList.contains('theme-dark') || html.classList.contains('dark');
    if (hadDark) html.classList.remove('theme-dark', 'dark');
    return () => { if (hadDark) html.classList.add('theme-dark', 'dark'); };
  }, []);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e?.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      navigate('/admin/overview', { replace: true });
    } else {
      setError(result.error);
    }
  }

  return (
    <SharedHeroBackground>
      <div className="relative z-20 flex w-full flex-1 items-center justify-center px-4 py-12 mt-10 lg:mt-20 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-xl bg-[#F6EEEB] p-8 text-center shadow-lg border border-gray-200"
          style={{ fontFamily: 'var(--font-primary)' }}
        >
          <div className="mb-4">
            <span className="inline-block rounded-md bg-[#ff6b2d] px-3 py-1 text-xs font-bold text-white">
              Admin Panel
            </span>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-[#140601]">Sign in to continue</h2>
          <p className="mb-6 text-base sm:text-lg text-[#140601]/72">Leaderboard oversight & username moderation</p>

          <div className="mb-3 text-left">
            <label className="mb-1 block text-sm lg:text-base font-semibold text-[#333]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border bg-transparent px-3 py-2 outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6 text-left">
            <label className="mb-1 block text-sm lg:text-base font-semibold text-[#333]">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border bg-transparent px-3 py-2 pr-10 outline-none"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#333] transition-colors"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="mb-3 text-sm text-red-500 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#ff6b2d] py-3 font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Log In'}
          </button>
        </form>
      </div>
    </SharedHeroBackground>
  );
}
