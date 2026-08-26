export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">Habit Tracker</h1>
          <p className="text-sm text-[#86868B] mt-1">Build streaks that last</p>
        </div>
        {children}
      </div>
    </div>
  );
}
