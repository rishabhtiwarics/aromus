export default function AuthField({ field, form, label, icon, type = 'text', placeholder }) {
  const error = form.touched[field.name] && form.errors[field.name];

  return (
    <label className={`auth-field${error ? ' has-error' : ''}`}>
      <span>{label}</span>
      <div>
        <i className={`bi ${icon}`} aria-hidden="true" />
        <input {...field} type={type} placeholder={placeholder} />
      </div>
      {error && <small>{form.errors[field.name]}</small>}
    </label>
  );
}
