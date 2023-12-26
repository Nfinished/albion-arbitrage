import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { useState, useEffect, useCallback } from "react";

type ValueType = string | number | boolean | Array<string | number | boolean>;

function useQueryParam<T extends ValueType>(
  paramName: string,
  fallbackValue: T,
): [T, (newValue: T) => void] {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Initialize the state with the current query parameter value or the fallback
  const initialValue = searchParams.has(paramName)
    ? convertToType<T>(searchParams.get(paramName), fallbackValue)
    : fallbackValue;
  const [value, setValue] = useState<T>(initialValue);

  // Update the state when the URL changes
  useEffect(() => {
    const queryValue = searchParams.get(paramName);
    if (queryValue !== undefined) {
      setValue(convertToType<T>(queryValue, fallbackValue));
    }
  }, [searchParams, paramName, fallbackValue]);

  // Function to set the new value in both state and URL
  const setQueryParam = useCallback(
    (newValue: T) => {
      if (newValue !== value) {
        setValue(newValue);
        const params = new URLSearchParams(searchParams);
        params.set(paramName, JSON.stringify(newValue));

        router.replace(`${pathname}?${params.toString()}}`);
      }
    },
    [value, router, paramName, searchParams, pathname],
  );

  return [value, setQueryParam];
}

// Helper function to convert the query parameter to the desired type
function convertToType<T extends ValueType>(value: any, fallbackValue: T): T {
  if (Array.isArray(fallbackValue)) {
    if (Array.isArray(value)) {
      return value.map((v) => convertSingleValue(v, fallbackValue[0])) as T;
    } else {
      return [convertSingleValue(value, fallbackValue[0])] as T;
    }
  } else {
    return convertSingleValue(value, fallbackValue);
  }
}

function convertSingleValue(value: any, singleFallbackValue: any) {
  if (typeof singleFallbackValue === "number") {
    return Number(value);
  } else if (typeof singleFallbackValue === "boolean") {
    return value === "true";
  } else {
    return value;
  }
}

export default useQueryParam;
