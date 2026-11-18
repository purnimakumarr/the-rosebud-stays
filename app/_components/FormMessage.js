import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

// Inline feedback for a form or list: friendly error text from a server
// action, or a success note. Announced to screen readers when it appears.
function FormMessage({ error, success }) {
  if (!error && !success) return null;

  const isError = Boolean(error);
  const Icon = isError ? ExclamationTriangleIcon : CheckCircleIcon;

  return (
    <p
      role={isError ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm sm:text-base ${
        isError
          ? 'border-accent-500/50 bg-accent-500/10 text-accent-100'
          : 'border-leaf-400/50 bg-leaf-400/10 text-leaf-300'
      }`}
    >
      <Icon className='h-5 w-5 shrink-0 mt-0.5' aria-hidden='true' />
      <span>{error ?? success}</span>
    </p>
  );
}

export default FormMessage;
