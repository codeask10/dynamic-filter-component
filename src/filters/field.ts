import type { FieldType, FilterFieldConfig, Operator, Option, RendererKey, ValidationRule } from '@/types'
import { OPERATOR_MAP } from '@/services/operators'

const RENDERER_DEFAULTS: Record<FieldType, RendererKey> = {
  string:         'text',
  number:         'number',
  date:           'date',
  boolean:        'boolean',
  select:         'select',
  'multi-select': 'multi-select',
}

interface ScalarOpts {
  key: string
  label: string
  operators?: Operator[]
  validation?: ValidationRule[]
  placeholder?: string
  rendererKey?: RendererKey
}

interface ChoiceOpts extends ScalarOpts {
  options: Option[]
}

function scalar(
  type: Exclude<FieldType, 'select' | 'multi-select'>,
  opts: ScalarOpts,
): FilterFieldConfig {
  return {
    type,
    key:         opts.key,
    label:       opts.label,
    operators:   opts.operators  ?? [...OPERATOR_MAP[type]],
    validation:  opts.validation ?? [],
    placeholder: opts.placeholder,
    rendererKey: opts.rendererKey ?? RENDERER_DEFAULTS[type],
  }
}

function choice(type: 'select' | 'multi-select', opts: ChoiceOpts): FilterFieldConfig {
  return {
    type,
    key:         opts.key,
    label:       opts.label,
    options:     opts.options,
    operators:   opts.operators  ?? [...OPERATOR_MAP[type]],
    validation:  opts.validation ?? [],
    placeholder: opts.placeholder,
    rendererKey: opts.rendererKey ?? RENDERER_DEFAULTS[type],
  }
}

/** Configuration-driven field builder. Use in filter schema definitions. */
export const field = {
  text:        (opts: ScalarOpts): FilterFieldConfig => scalar('string',       opts),
  number:      (opts: ScalarOpts): FilterFieldConfig => scalar('number',       opts),
  date:        (opts: ScalarOpts): FilterFieldConfig => scalar('date',         opts),
  boolean:     (opts: ScalarOpts): FilterFieldConfig => scalar('boolean',      opts),
  select:      (opts: ChoiceOpts): FilterFieldConfig => choice('select',       opts),
  multiSelect: (opts: ChoiceOpts): FilterFieldConfig => choice('multi-select', opts),
}
