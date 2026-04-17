export default function Loader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex-center" style={{ flexDirection: 'column', gap: '1rem', padding: '2rem' }} role="status" aria-live="polite">
      <div 
        style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(255, 255, 255, 0.1)',
          borderTopColor: 'var(--accent-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
        aria-label="Loading spinner"
      />
      <p style={{ color: 'var(--text-secondary)' }}>{text}</p>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
