import { getCountries } from '@/app/_lib/data-service';

async function SelectCountry({ defaultCountry, name, id, className }) {
  const countries = await getCountries();

  // Only the country name is submitted; the server looks up its flag
  return (
    <select
      name={name}
      id={id}
      defaultValue={defaultCountry ?? ''}
      className={className}
    >
      <option value=''>Select country...</option>
      {countries.map((c) => (
        <option key={c.names.common} value={c.names.common}>
          {c.names.common}
        </option>
      ))}
    </select>
  );
}

export default SelectCountry;
