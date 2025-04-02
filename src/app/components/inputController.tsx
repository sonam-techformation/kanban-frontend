import { Control, Controller, FieldError, FieldValues } from "react-hook-form";

interface InputControllerProps {
  name: string;
  control: Control<FieldValues | any>;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  rules?: Record<string, any>;
  error?: FieldError;
  label?: string;
}

const InputController = ({
  name,
  control,
  defaultValue = "",
  type = "text",
  placeholder = "",
  id,
  className = "",
  disabled = false,
  required = false,
  rules = {},
  error,
  label,
}: InputControllerProps) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium  mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={{
          required: required ? `${label || "This field"} is required` : false,
          ...rules,
        }}
        render={({ field }) => (
          <input
            {...field}
            type={type}
            placeholder={placeholder}
            id={id || name}
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
              error ? "border-red-500" : "border-gray-300"
            } ${className}`}
          />
        )}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export default InputController;
