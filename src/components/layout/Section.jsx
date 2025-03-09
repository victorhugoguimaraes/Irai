export function Section({ title, children, action }) {
  return (
    <section className="section-card">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
} 