import { useFormStatus } from 'react-dom';

export default function SubmitButton({ children, pendingLabel }) {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className='rounded-full bg-accent-500 px-8 py-4 text-primary-950 font-semibold uppercase tracking-wider shadow-glow hover:bg-accent-400 transition-all disabled:shadow-none disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300'
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
