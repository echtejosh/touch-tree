import React from 'react';
import { useQuery } from 'presentation/hooks';
import GetDurationAccessUseCase from 'application/usecases/GetDurationAccessUseCase';
import Container from 'infrastructure/services/Container';
import { SelectDecorator, SelectDecoratorOption } from 'presentation/components/form/fields/SelectDecorator';

interface AccessDurationSelectProps {
    value?: string | number;

    onChange(value: string): void;
}

export default function AccessDurationSelect({
    onChange,
    value,
}: AccessDurationSelectProps) {
    const getDurationAccessUseCase = Container.resolve(GetDurationAccessUseCase);

    const { data: tokens } = useQuery(getDurationAccessUseCase.handle, [GetDurationAccessUseCase.name]);

    return (
        <SelectDecorator
            label='Access duration'
            onChange={onChange}
            options={tokens as SelectDecoratorOption<string>[] || []}
            value={value?.toString()}
        />
    );
}
