import { getCountryCallingCode } from "react-phone-number-input";

export function CountrySelectWithCode({
  value,
  onChange,
  options,
  iconComponent: Icon,
  disabled,
  readOnly,
  className,
  ...rest
}) {
  const selectedOption = options.find(
    (option) => !option.divider && (option.value || undefined) === value,
  );

  const getOptionLabel = (option) => {
    if (!option.value) return option.label;
    return `${option.label} +${getCountryCallingCode(option.value)}`;
  };

  return (
    <div className="PhoneInputCountry">
      <select
        {...rest}
        className={`PhoneInputCountrySelect ${className || ""}`.trim()}
        disabled={disabled || readOnly}
        value={value || "ZZ"}
        onChange={(event) => {
          const selectedValue = event.target.value;
          onChange(selectedValue === "ZZ" ? undefined : selectedValue);
        }}
      >
        {options.map((option, index) => {
          if (option.divider) {
            return (
              <option key={`divider-${index}`} value="|" disabled>
                ----------------
              </option>
            );
          }

          return (
            <option key={option.value || "ZZ"} value={option.value || "ZZ"}>
              {getOptionLabel(option)}
            </option>
          );
        })}
      </select>

      {selectedOption && Icon && (
        <Icon
          aria-hidden="true"
          country={value}
          label={selectedOption.label}
        />
      )}

      <div className="PhoneInputCountrySelectArrow" />
    </div>
  );
}