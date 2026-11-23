/** a section's problems, by field (nested fields as "guardian.phone") */
export type Errors = Record<string, string>;

/** what every uGNET form section is given */
export type SectionProps<T> = {
  value: T;
  onChange: (value: T) => void;
  /** shown only once the student has tried to move on */
  errors: Errors;
};
