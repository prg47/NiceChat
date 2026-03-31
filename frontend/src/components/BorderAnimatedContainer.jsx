function BorderAnimatedContainer({ children }) {
  return (
    <div
      className="animate-[border-spin_4s_linear_infinite] rounded-xl p-[2px]"
      style={{ background: "conic-gradient(from var(--border-angle), #6366f1, #ec4899, #f59e0b, #6366f1)" }}
    >
      <div className="rounded-[10px] bg-white dark:bg-zinc-900 px-6 py-4">
        {children}
      </div>
    </div>
  );
}

export default BorderAnimatedContainer;