import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import type { ValueInputProps } from './types'

const RANGE_LABELS = { date: ['From', 'To'], number: ['Min', 'Max'] } as const

/** Two side-by-side TextFields for the "between" operator — Min/Max for numbers, From/To for dates. */
export function RangeValueInput({ field, condition, onChange }: ValueInputProps) {
  const isDate = field.type === 'date'
  const [low, high] = Array.isArray(condition.value) ? condition.value : ['', '']
  const [lowLabel, highLabel] = RANGE_LABELS[isDate ? 'date' : 'number']
  const adornment = !isDate && field.rendererKey === 'currency'
    ? <InputAdornment position="start">$</InputAdornment>
    : undefined

  return (
    <Box display="flex" gap={1}>
      <TextField
        size="small"
        sx={{ flex: 1 }}
        type={isDate ? 'date' : 'number'}
        label={lowLabel}
        value={low ?? ''}
        onChange={(e) => onChange([e.target.value, high ?? ''])}
        InputLabelProps={isDate ? { shrink: true } : undefined}
        InputProps={{ startAdornment: adornment }}
      />
      <TextField
        size="small"
        sx={{ flex: 1 }}
        type={isDate ? 'date' : 'number'}
        label={highLabel}
        value={high ?? ''}
        onChange={(e) => onChange([low ?? '', e.target.value])}
        InputLabelProps={isDate ? { shrink: true } : undefined}
        InputProps={{ startAdornment: adornment }}
      />
    </Box>
  )
}
