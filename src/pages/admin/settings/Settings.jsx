import { useState, useEffect } from 'react';
import NumInput from './components/NumInput';
import { GET, PUT } from '../../../services/httpMethods';
import { ENDPOINT } from '../../../services/httpEndpoint';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Settings = () => {
  const [rounds, setRounds] = useState(5);
  const [timer, setTimer] = useState(12);
  const [firstName, setFirst] = useState(400);
  const [lastName, setLast] = useState(400);
  const [speedBonus, setSpeed] = useState(200);
  const [threshold, setThresh] = useState(6);
  const [loading, setLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await GET(ENDPOINT.SETTINGS.GET);
      const categories = response.data?.data?.categories;
      if (categories) {
        const getValue = (arr, key) => {
          const item = arr?.find((s) => s.key === key);
          return item?.value;
        };
        const shotClock = categories.shot_clock || [];
        const scoring = categories.scoring || [];

        setRounds(getValue(shotClock, 'game.rounds_per_session') ?? 5);
        setTimer(getValue(shotClock, 'game.base_timer') ?? 12);
        setFirst(getValue(scoring, 'scoring.first_name_correct') ?? 400);
        setLast(getValue(scoring, 'scoring.last_name_correct') ?? 400);
        setSpeed(getValue(scoring, 'scoring.speed_bonus') ?? 200);
        setThresh(getValue(scoring, 'scoring.bonus_threshold') ?? 6);
      }
    } catch (e) {
      console.error('Failed to load settings', e);
      toast.error('Failed to load settings', { position: 'top-right', autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        settings: [
          { key: 'game.rounds_per_session', value: rounds },
          { key: 'game.base_timer', value: timer },
          { key: 'scoring.first_name_correct', value: firstName },
          { key: 'scoring.last_name_correct', value: lastName },
          { key: 'scoring.speed_bonus', value: speedBonus },
          { key: 'scoring.bonus_threshold', value: threshold },
        ],
      };
      await PUT(ENDPOINT.SETTINGS.BULK, payload);
      toast.success('Settings saved successfully!', { position: 'top-right', autoClose: 3000 });
    } catch (e) {
      console.error('Save failed', e);
      toast.error(e.response?.data?.message || 'Failed to save settings', { position: 'top-right', autoClose: 3000 });
    }
  };

  return (
    <div style={{ fontFamily: 'var(--font-primary)' }}>
      <ToastContainer theme="light" />
      <h2 className="text-3xl font-bold text-[#111827] mb-1" style={{ fontFamily: 'var(--font-primary)' }}>
        Engine Configuration
      </h2>
      <p className="text-base sm:text-lg text-[#6b7280] mb-6">Manage difficulty tiers and system-wide behavior.</p>

      {loading && <div className="text-center text-gray-500 py-6">Loading settings...</div>}

      {!loading && (
        <>
          <div className="flex flex-col lg:flex-row gap-4 xl:gap-6">
            {/* Shot Clock */}
            <div className="bg-[#f6eeeb] rounded-2xl p-6 flex-1 shadow-sm">
              <h3 className="text-xl lg:text-2xl font-semibold text-[#111827] mb-5" style={{ fontFamily: 'var(--font-secondary)' }}>
                Shot Clock Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm lg:text-base font-medium text-[#140601] mb-1.5">Rounds per Session</label>
                  <NumInput value={rounds} onChange={setRounds} min={1} max={20} hint="Average game length ~2.5 mins" />
                </div>
                <div>
                  <label className="block text-sm lg:text-base font-medium text-[#140601] mb-1.5">Base Timer (seconds)</label>
                  <NumInput value={timer} onChange={setTimer} min={5} max={30} hint="Min: 5s, Max: 30s" />
                </div>
              </div>
            </div>

            {/* Scoring Rules */}
            <div className="bg-[#f6eeeb] rounded-2xl p-6 flex-1 shadow-sm">
              <h3 className="text-xl lg:text-2xl font-semibold text-[#111827] mb-5" style={{ fontFamily: 'var(--font-secondary)' }}>
                Scoring Rules
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm lg:text-base font-medium text-[#140601] mb-1.5">First Name Correct</label>
                  <NumInput value={firstName} onChange={setFirst} min={0} hint="" />
                </div>
                <div>
                  <label className="block text-sm lg:text-base font-medium text-[#140601] mb-1.5">Last Name Correct</label>
                  <NumInput value={lastName} onChange={setLast} min={0} hint="" />
                </div>
                <div>
                  <label className="block text-sm lg:text-base font-medium text-[#140601] mb-1.5">Speed Bonus</label>
                  <NumInput value={speedBonus} onChange={setSpeed} min={0} hint="" />
                </div>
                <div>
                  <label className="block text-sm lg:text-base font-medium text-[#140601] mb-1.5">Bonus Threshold</label>
                  <NumInput value={threshold} onChange={setThresh} min={1} hint="Bonus awarded if ≥ 6s remaining" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end">
            <button
              onClick={handleSave}
              className="bg-[#ff6b2d] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#e05520] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Settings;

