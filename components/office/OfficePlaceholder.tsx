// T-50 (BR-96, BR-100): grey placeholder blocks where the next office page will be. The side menu and
// the top bar stay. A screen reader hears "Loading page" from the page-move bar's live region, so
// this text is not a live region of its own.
export function OfficePlaceholder() {
  return (
    <div className="placeholder-page" aria-busy="true" data-testid="office-placeholder">
      <span className="sr-only">Loading page</span>
      <div className="stack" aria-hidden="true">
        <span className="ph ph-title" />
        <span className="ph ph-line" />
      </div>
      <span className="ph ph-tabs" aria-hidden="true" />
      <div className="ph-row" aria-hidden="true">
        <span className="ph ph-stat" />
        <span className="ph ph-stat" />
        <span className="ph ph-stat" />
      </div>
      <span className="ph ph-card" aria-hidden="true" />
      <span className="ph ph-card" aria-hidden="true" />
    </div>
  );
}
