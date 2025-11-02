import { FormEvent, useCallback, useMemo, useRef, useState } from "react";

type Primitive = string | number | boolean | null | undefined | File | Date;
type FieldValues = Record<string, Primitive | Primitive[]>;

type ValidateResult = boolean | string | undefined;

type ValidateFunction<TFieldValues extends FieldValues> = <
  TFieldName extends keyof TFieldValues
>(
  value: TFieldValues[TFieldName] | undefined,
  formValues: TFieldValues
) => ValidateResult;

type ValidationConfig<TFieldValues extends FieldValues> =
  | ValidateFunction<TFieldValues>
  | Record<string, ValidateFunction<TFieldValues>>;

export interface RegisterOptions<TFieldValues extends FieldValues> {
  required?: boolean | string;
  pattern?: {
    value: RegExp;
    message: string;
  };
  minLength?: {
    value: number;
    message: string;
  };
  validate?: ValidationConfig<TFieldValues>;
}

export interface FieldError {
  type: string;
  message?: string;
}

interface InternalFieldConfig<TFieldValues extends FieldValues> {
  name: keyof TFieldValues;
  options: RegisterOptions<TFieldValues>;
}

export interface UseFormProps<TFieldValues extends FieldValues> {
  defaultValues?: Partial<TFieldValues>;
}

export interface UseFormReturn<TFieldValues extends FieldValues> {
  register: (
    name: keyof TFieldValues,
    options?: RegisterOptions<TFieldValues>
  ) => {
    name: string;
    onChange: (event: unknown) => void;
    onBlur: () => void;
    ref: (element: HTMLInputElement | null) => void;
    defaultValue: TFieldValues[keyof TFieldValues] | undefined;
  };
  handleSubmit: (
    onValid: (values: TFieldValues) => void | Promise<void>
  ) => (event?: FormEvent<HTMLFormElement>) => Promise<void>;
  reset: (values?: Partial<TFieldValues>) => void;
  watch: (
    name?: keyof TFieldValues
  ) => TFieldValues[keyof TFieldValues] | TFieldValues | undefined;
  formState: {
    errors: Partial<Record<keyof TFieldValues, FieldError>>;
    touchedFields: Partial<Record<keyof TFieldValues, boolean>>;
    isSubmitting: boolean;
    isSubmitted: boolean;
    isValid: boolean;
  };
}

function extractValue(eventOrValue: unknown) {
  if (
    eventOrValue &&
    typeof eventOrValue === "object" &&
    "target" in eventOrValue
  ) {
    const { target } = eventOrValue as { target: HTMLInputElement };
    if (target.type === "checkbox") {
      return target.checked;
    }
    return target.value;
  }
  return eventOrValue;
}

export function useForm<TFieldValues extends FieldValues = FieldValues>(
  props: UseFormProps<TFieldValues> = {}
): UseFormReturn<TFieldValues> {
  const valuesRef = useRef<TFieldValues>({
    ...(props.defaultValues as TFieldValues),
  });
  const fieldConfigsRef = useRef<
    Map<keyof TFieldValues, InternalFieldConfig<TFieldValues>>
  >(new Map());

  const [errors, setErrors] = useState<
    Partial<Record<keyof TFieldValues, FieldError>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof TFieldValues, boolean>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateField = useCallback(
    <TFieldName extends keyof TFieldValues>(
      name: TFieldName,
      value: TFieldValues[TFieldName] | undefined
    ): FieldError | undefined => {
      const config = fieldConfigsRef.current.get(name);
      if (!config) {
        return undefined;
      }

      const { options } = config;
      const messageFor = (
        defaultMessage: string,
        customMessage?: string | boolean
      ) => (typeof customMessage === "string" ? customMessage : defaultMessage);

      if (options.required) {
        const isEmpty =
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0);
        if (isEmpty) {
          return {
            type: "required",
            message: messageFor("Campo obrigatório", options.required),
          };
        }
      }

      if (options.pattern?.value && typeof value === "string") {
        if (!options.pattern.value.test(value)) {
          return {
            type: "pattern",
            message:
              options.pattern.message ||
              "Valor inválido para o formato definido",
          };
        }
      }

      if (
        options.minLength?.value !== undefined &&
        typeof value === "string" &&
        value.length < options.minLength.value
      ) {
        return {
          type: "minLength",
          message:
            options.minLength.message ||
            `Informe ao menos ${options.minLength.value} caracteres`,
        };
      }

      if (options.validate) {
        const validators =
          typeof options.validate === "function"
            ? { validate: options.validate }
            : options.validate;

        for (const key of Object.keys(validators)) {
          const validator = validators[key];
          const result = validator(value, valuesRef.current);
          if (result === false) {
            return {
              type: key,
              message: "Valor inválido",
            };
          }
          if (typeof result === "string") {
            return {
              type: key,
              message: result,
            };
          }
        }
      }

      return undefined;
    },
    []
  );

  const setFieldError = useCallback(
    (name: keyof TFieldValues, error?: FieldError) => {
      setErrors((prev) => {
        const next = { ...prev };
        if (error) {
          next[name] = error;
        } else {
          delete next[name];
        }
        return next;
      });
    },
    []
  );

  const register = useCallback<UseFormReturn<TFieldValues>["register"]>(
    (name, options = {}) => {
      fieldConfigsRef.current.set(name, { name, options });

      if (!(name in valuesRef.current) && props.defaultValues) {
        const defaultValue = props.defaultValues[name];
        if (defaultValue !== undefined) {
          valuesRef.current[name] =
            defaultValue as TFieldValues[keyof TFieldValues];
        }
      }

      return {
        name: name as string,
        defaultValue: valuesRef.current[name],
        onChange: (event: unknown) => {
          const newValue = extractValue(
            event
          ) as TFieldValues[keyof TFieldValues];
          valuesRef.current[name] = newValue;
          const error = validateField(name, newValue);
          setFieldError(name, error);
        },
        onBlur: () => {
          setTouched((prev) => ({ ...prev, [name]: true }));
          const error = validateField(name, valuesRef.current[name]);
          setFieldError(name, error);
        },
        ref: (element: HTMLInputElement | null) => {
          if (element && valuesRef.current[name] !== undefined) {
            element.value = String(valuesRef.current[name] ?? "");
          }
        },
      };
    },
    [props.defaultValues, setFieldError, validateField]
  );

  const handleSubmit = useCallback<UseFormReturn<TFieldValues>["handleSubmit"]>(
    (onValid) => {
      return async (event?: FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        const currentValues = valuesRef.current;
        const foundErrors: Partial<Record<keyof TFieldValues, FieldError>> = {};

        for (const [name] of fieldConfigsRef.current) {
          const value = currentValues[name];
          const error = validateField(name, value);
          if (error) {
            foundErrors[name] = error;
          }
        }

        setErrors(foundErrors);
        setTouched((prev) => ({ ...prev }));
        setIsSubmitted(true);

        if (Object.keys(foundErrors).length > 0) {
          return;
        }

        try {
          setIsSubmitting(true);
          await onValid({ ...(currentValues as TFieldValues) });
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [validateField]
  );

  const reset = useCallback<UseFormReturn<TFieldValues>["reset"]>(
    (values) => {
      valuesRef.current = {
        ...(values
          ? (values as TFieldValues)
          : (props.defaultValues as TFieldValues)),
      } as TFieldValues;
      setErrors({});
      setTouched({});
      setIsSubmitted(false);
    },
    [props.defaultValues]
  );

  const watch = useCallback<UseFormReturn<TFieldValues>["watch"]>(
    (name?: keyof TFieldValues) => {
      if (name) {
        return valuesRef.current[name];
      }
      return { ...(valuesRef.current as TFieldValues) };
    },
    []
  );

  const formState = useMemo(
    () => ({
      errors,
      touchedFields: touched,
      isSubmitting,
      isSubmitted,
      isValid: Object.keys(errors).length === 0,
    }),
    [errors, touched, isSubmitting, isSubmitted]
  );

  return {
    register,
    handleSubmit,
    reset,
    watch,
    formState,
  };
}

export type SubmitHandler<TFieldValues extends FieldValues> = (
  values: TFieldValues
) => void | Promise<void>;
