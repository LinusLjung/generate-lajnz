import { RcType } from './types';

type TypeType = RcType['types'][0];
type FieldKeyType = keyof TypeType;
type FieldValueType<T = TypeType> = T[keyof T] | null;

function getField(fields: TypeType, field: keyof TypeType): FieldValueType | null {
  return fields[field] ?? null;
}

function getTypeFields<T = FieldValueType[]>(config: RcType, type: keyof RcType['types'], filter?: never): T;
function getTypeFields<T = FieldValueType>(config: RcType, type: keyof RcType['types'], filter?: FieldKeyType): T;
function getTypeFields<T = FieldValueType[]>(config: RcType, type: keyof RcType['types'], filter?: FieldKeyType[]): T;
function getTypeFields(
  config: RcType,
  type: keyof RcType['types'],
  filter?: FieldKeyType | FieldKeyType[],
): FieldValueType | FieldValueType[] {
  const isSingleField = typeof filter === 'string';

  const fields = config.types[type];

  if (!fields) {
    return isSingleField ? null : filter?.map(() => null) ?? [];
  }

  if (filter == null) {
    return Object.values(fields);
  }

  return isSingleField ? getField(fields, filter) : filter.map((field) => getField(fields, field));
}

export type { FieldValueType as Fieldtype };

export default getTypeFields;
