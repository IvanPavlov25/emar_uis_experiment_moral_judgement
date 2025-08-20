import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { join } from '../lib/api';
import { FACULTIES, AcademicUnitRaw } from '../types/models';

interface FormData {
  academic_unit: AcademicUnitRaw | '';
  consent: boolean;
}

export default function ConsentFaculty() {
  const navigate = useNavigate();
  const { control, handleSubmit, watch } = useForm<FormData>({
    defaultValues: { academic_unit: '', consent: false },
  });

  const consent = watch('consent');

  const onSubmit = async (values: FormData) => {
    const res = await join(Number(values.academic_unit) as AcademicUnitRaw);
    navigate(`/waiting?pid=${encodeURIComponent(res.participant_id)}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm">
        Este estudio es anónimo y con fines académicos. Puedes retirarte en cualquier momento.
      </p>
      <label className="block">
        <span className="block mb-1">Facultad</span>
        <Controller
          name="academic_unit"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <select
              {...field}
              className="border p-2 w-full"
            >
              <option value="" disabled>
                Seleccione su facultad…
              </option>
              {FACULTIES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          )}
        />
      </label>
      <label className="flex items-center space-x-2">
        <Controller
          name="consent"
          control={control}
          render={({ field: { value, onChange, onBlur, name, ref } }) => (
            <input
              type="checkbox"
              checked={value}
              onChange={onChange}
              onBlur={onBlur}
              name={name}
              ref={ref}
            />
          )}
        />
        <span>Acepto participar</span>
      </label>
      <button
      type="submit"
      disabled={!consent}
      className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
    >
      Continuar
    </button>
    </form>
  );
}
