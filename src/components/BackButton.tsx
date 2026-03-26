interface BackButtonProps {
  onClick: () => void;
}

const BackButton = ({ onClick }: BackButtonProps) => {
  return (
    <button onClick={onClick} className="back-button fixed top-4 right-4 z-50 shadow-md">
      ← Volver a Inicio
    </button>
  );
};

export default BackButton;
