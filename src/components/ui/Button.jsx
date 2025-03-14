import '@assets/styles/ui/button.css';
function Button({ onClick, children, type = 'button', className = 'btn', to }) {
  return (
    <button to={to} type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
}

export default Button;
