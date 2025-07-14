import * as Hf from 'react-hook-form-mui';
import { useState } from 'react';
import { FieldValues, Path, PathValue, UseFormProps, UseFormReturn } from 'react-hook-form-mui';
import { Override } from '../../../shared/types';

/**
 *
 */
export interface UseFormDecoratorProps<T extends FieldValues> extends UseFormProps<T> {
    /**
     *
     */
    model?: T | null;
}

export type UseFormShape<T extends FieldValues> = Override<UseFormReturn<T>, {
    /**
     *
     */
    form: UseFormReturn<T>;

    /**
     *
     * @param values
     */
    setValues(values: Partial<Record<Path<T>, PathValue<T, Path<T>>>>): void;

    /**
     *
     * @param filter
     */
    getValues(filter?: false): T;
    getValues(filter: true): Partial<T>;
}>;

export default function useFormDecorator<T extends FieldValues>(props?: UseFormDecoratorProps<T>): UseFormShape<T> {
    const [, _refresh] = useState(false);
    const form = Hf.useForm<T>(props);

    /**
     *
     * @param values
     */
    function setValues(values: Partial<Record<Path<T>, PathValue<T, Path<T>>>>): void {
        Object
            .entries(values)
            .forEach(([k, v]) => form.setValue(k as Path<T>, v as PathValue<T, Path<T>>));
        _refresh((prev) => !prev);
    }

    function getValues(): T;
    function getValues(filter: true): Partial<T>;

    /**
     *
     * @param filter
     */
    function getValues(filter = false): T | Partial<T> {
        const values = form.getValues();

        if (!filter) {
            return values;
        }

        return Object.fromEntries(Object.entries(values)
            .filter(([, value]) => value !== undefined)) as Partial<T>;
    }

    return {
        ...form,
        setValues,
        getValues,
        form,
    };
}
