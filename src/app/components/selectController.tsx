import { bgColor, textColor } from "@/utils/color";
import { useTheme } from "next-themes";
import { Control, Controller, FieldError, FieldValues } from "react-hook-form";

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectControllerProps {
  name: string;
  control: Control<FieldValues | any>;
  options: SelectOption[];
  defaultValue?: string | number;
  placeholder?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  rules?: Record<string, any>;
  error?: FieldError;
  label?: string;
}

const SelectController = ({
  name,
  control,
  options,
  defaultValue = "",
  placeholder = "Select an option",
  id,
  className = "",
  disabled = false,
  required = false,
  rules = {},
  error,
  label,
}: SelectControllerProps) => {
  const { theme } = useTheme();
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-1">
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
          <select
            {...field}
            id={id || name}
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
              error ? "border-red-500" : "border-gray-300"
            } ${className}`}
          >
            <option
              value=""
              disabled
              className={`${bgColor(theme)} ${textColor(theme)}}`}
            >
              {placeholder}
            </option>
            {options.map((option: any) => (
              <option
                key={option.id}
                value={option.id}
                disabled={option.disabled}
                className={`${bgColor(theme)} ${textColor(theme)}}`}
              >
                {option?.firstname}
              </option>
            ))}
          </select>
        )}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export default SelectController;
