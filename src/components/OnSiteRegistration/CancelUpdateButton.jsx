import "./CancelUpdateButton.css";

export function CancelUpdateButton({ onClick, children }) {
  return (
    <button type="button" onClick={onClick} className="registration-cancel-button">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="m9 9 6 6m0-6-6 6" />
      </svg>
      <span>{children}</span>
    </button>
  );
}
