import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import type { ValueInputProps } from './types'

const HTML_TYPE: Record<string, 'text' | 'number' | 'date'> = {
  string: 'text',
  number: 'number',
  date:   'date',
}

/** Single TextField whose HTML type follows field.type — text, number, or date. */
export function SingleValueInput({ field, condition, onChange, error }: ValueInputProps) {
  const htmlType = HTML_TYPE[field.type] ?? 'text'
  const isDate = htmlType === 'date'
  const value = typeof condition.value === 'string' || typeof condition.value === 'number' ? condition.value : ''
  const placeholder = isDate
    ? undefined
    : field.placeholder ?? (htmlType === 'text' ? `Enter ${field.label.toLowerCase()}` : undefined)

  return (
    <TextField
      size="small"
      fullWidth
      type={htmlType}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      error={Boolean(error)}
      helperText={error ?? undefined}
      InputLabelProps={isDate ? { shrink: true } : undefined}
      InputProps={{
        startAdornment: htmlType === 'number' && field.rendererKey === 'currency'
          ? <InputAdornment position="start">$</InputAdornment>
          : undefined,
      }}
    />
  )
}
