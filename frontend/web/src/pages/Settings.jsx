import { useState } from 'react'
import { Save } from 'lucide-react'

export default function Settings() {
  const [settings, setSettings] = useState({
    attendanceCutoff: '09:00',
    lateTime: '09:30',
    theme: 'dark',
    notificationsEnabled: true,
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="bg-[#08091C] min-h-screen text-white p-6">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400 mb-8">Manage your system settings</p>

        <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-8 space-y-10 shadow-xl">

          {/* Attendance Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Attendance Settings</h2>

            <div className="grid gap-6">
              {/* Cutoff */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Attendance Cutoff Time
                </label>
                <input
                  type="time"
                  name="attendanceCutoff"
                  value={settings.attendanceCutoff}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg 
                             focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
                />
              </div>

              {/* Late Threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Late Time Threshold
                </label>
                <input
                  type="time"
                  name="lateTime"
                  value={settings.lateTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg 
                             focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
                />
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="pt-4 border-t border-gray-800/70">
            <h2 className="text-xl font-semibold mb-4">Appearance</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
              <select
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg 
                           focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="pt-4 border-t border-gray-800/70">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>

            <label className="flex items-center gap-4 cursor-pointer select-none">
              {/* Toggle Switch */}
              <input
                type="checkbox"
                name="notificationsEnabled"
                checked={settings.notificationsEnabled}
                onChange={handleChange}
                className="hidden"
              />
              <div
                className={`w-12 h-6 rounded-full transition-all relative 
                 ${settings.notificationsEnabled ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-[2px] transition-all 
                  ${settings.notificationsEnabled ? 'left-6' : 'left-1'}`}
                ></div>
              </div>

              <span className="text-gray-300">Enable Notifications</span>
            </label>
          </div>

          {/* Saved Alert */}
          {saved && (
            <div className="p-4 bg-green-600/15 border border-green-500/40 rounded-lg text-green-300 
                            animate-fade-in">
              ✓ Settings saved successfully
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-6 py-3 
                      bg-gradient-to-r from-blue-600 to-blue-700 
                      hover:from-blue-700 hover:to-blue-800
                      rounded-lg font-medium 
                      transition-all shadow-md hover:shadow-blue-600/20 
                      hover:scale-[1.02] active:scale-95"
          >
            <Save size={20} />
            Save Settings
          </button>

        </div>
      </div>
    </div>
  )
}
