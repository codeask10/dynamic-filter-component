import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'
import type { Option } from '@/types'
import type { ValueInputProps } from './types'

const BOOLEAN_OPTIONS: Option[] = [
  { label: 'True', value: 'true' },
  { label: 'False', value: 'false' },
]

/** Dropdown for select, multi-select (with chips), and boolean (True/False) fields — one Select, three flavors. */
export function ChoiceValueInput({ field, condition, onChange }: ValueInputProps) {
  const isMulti = field.type === 'multi-select'
  const isBoolean = field.type === 'boolean'
  const options = isBoolean
    ? BOOLEAN_OPTIONS
    : field.type === 'select' || field.type === 'multi-select' ? field.options : []

  if (isMulti) {
    const current = Array.isArray(condition.value) ? condition.value.map(String) : []

    function handleMultiChange(e: SelectChangeEvent<string[]>) {
      const next = e.target.value
      onChange(typeof next === 'string' ? next.split(',') : next)
    }

    return (
      <Select
        multiple
        fullWidth
        size="small"
        displayEmpty
        value={current}
        onChange={handleMultiChange}
        renderValue={(selected) =>
          selected.length === 0 ? (
            <Box component="span" sx={{ color: 'text.disabled' }}>Select {field.label}</Box>
          ) : (
            <Box display="flex" gap={0.5} flexWrap="wrap">
              {selected.map((val) => (
                <Chip key={val} label={options.find((o) => String(o.value) === val)?.label ?? val} size="small" />
              ))}
            </Box>
          )
        }
      >
        {options.map((opt) => (
          <MenuItem key={String(opt.value)} value={String(opt.value)} disabled={opt.disabled}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    )
  }

  const value = isBoolean
    ? condition.value === true ? 'true' : condition.value === false ? 'false' : ''
    : typeof condition.value === 'string' || typeof condition.value === 'number' ? String(condition.value) : ''

  return (
    <Select
      fullWidth
      size="small"
      displayEmpty
      value={value}
      onChange={(e) => onChange(isBoolean ? e.target.value === 'true' : e.target.value)}
    >
      <MenuItem value="" disabled>Select {field.label}</MenuItem>
      {options.map((opt) => (
        <MenuItem key={String(opt.value)} value={String(opt.value)} disabled={opt.disabled}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  )
}
