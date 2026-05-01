export default function PrimaryButton({ text, onClick }) {
  return (
    <button onClick={onClick} type="button" className="btn btn-primary">
      {text}
    </button>
  );
}
