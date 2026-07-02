import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary:    { main: '#2563EB', light: '#EFF6FF', dark: '#1D4ED8' },
    secondary:  { main: '#7C3AED' },
    success:    { main: '#059669', light: '#ECFDF5' },
    warning:    { main: '#D97706', light: '#FFFBEB' },
    error:      { main: '#DC2626', light: '#FEF2F2' },
    info:       { main: '#0891B2', light: '#ECFEFF' },
    background: { default: '#F1F5F9', paper: '#FFFFFF' },
    text:       { primary: '#0F172A', secondary: '#64748B', disabled: '#94A3B8' },
    divider:    '#E2E8F0',
  },

  typography: {
    fontFamily: '"Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h5:      { fontWeight: 700, fontSize: '1.375rem', letterSpacing: '-0.025em', lineHeight: 1.3 },
    h6:      { fontWeight: 600, fontSize: '1.125rem', letterSpacing: '-0.015em' },
    subtitle1: { fontWeight: 600, fontSize: '0.9375rem' },
    subtitle2: { fontWeight: 600, fontSize: '0.8125rem', color: '#64748B' },
    body1:   { fontSize: '0.9375rem', lineHeight: 1.6 },
    body2:   { fontSize: '0.875rem',  lineHeight: 1.6 },
    caption: { fontSize: '0.75rem',   lineHeight: 1.5, color: '#64748B' },
  },

  shape: { borderRadius: 10 },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*':          { scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent' },
        '*::-webkit-scrollbar': { width: 6, height: 6 },
        '*::-webkit-scrollbar-track': { background: 'transparent' },
        '*::-webkit-scrollbar-thumb': { background: '#CBD5E1', borderRadius: 3 },
        'html, body':    { height: '100%' },
        '#root':         { height: '100%', display: 'flex', flexDirection: 'column' },
      },
    },

    MuiButton: {
      defaultProps:  { disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8, fontSize: '0.875rem' },
        sizeSmall: { padding: '4px 12px' },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },

    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        outlined: { borderColor: '#E2E8F0' },
        root:     { backgroundImage: 'none' },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: { border: '1px solid #E2E8F0', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)' },
      },
    },

    MuiChip: {
      styleOverrides: {
        root:      { fontWeight: 500, borderRadius: 6 },
        sizeSmall: { height: 22, fontSize: '0.6875rem', padding: '0 2px' },
        label:     { paddingLeft: 8, paddingRight: 8 },
        labelSmall: { paddingLeft: 6, paddingRight: 6 },
      },
    },

    MuiTable: {
      styleOverrides: {
        root: { borderCollapse: 'separate', borderSpacing: 0 },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: { backgroundColor: '#F8FAFC' },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          color: '#64748B',
          fontWeight: 600,
          fontSize: '0.6875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          padding: '10px 16px',
          borderBottom: '1px solid #E2E8F0',
          whiteSpace: 'nowrap',
        },
        body: {
          fontSize: '0.875rem',
          padding: '12px 16px',
          color: '#0F172A',
          borderBottom: '1px solid #F1F5F9',
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 120ms ease',
          '&:hover:not(.MuiTableRow-head)': { backgroundColor: '#F8FAFC' },
          '&:last-child td': { borderBottom: 0 },
        },
      },
    },

    MuiTableContainer: {
      styleOverrides: {
        root: { overflow: 'auto' },
      },
    },

    MuiTablePagination: {
      styleOverrides: {
        root: { borderTop: '1px solid #E2E8F0', fontSize: '0.8125rem' },
        selectLabel: { fontSize: '0.8125rem', color: '#64748B' },
        displayedRows: { fontSize: '0.8125rem', color: '#64748B' },
      },
    },

    MuiSelect: {
      styleOverrides: {
        select: { fontSize: '0.875rem' },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94A3B8' },
          fontSize: '0.875rem',
        },
      },
    },

    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.75rem',
          padding: '3px 10px',
          borderColor: '#E2E8F0',
          '&.Mui-selected': { backgroundColor: '#EFF6FF', color: '#2563EB', borderColor: '#BFDBFE' },
        },
      },
    },

    MuiToggleButtonGroup: {
      styleOverrides: {
        root: { gap: 0 },
      },
    },

    MuiDivider: {
      styleOverrides: { root: { borderColor: '#E2E8F0' } },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 1px 0 0 #E2E8F0',
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          minHeight: 48,
          '&.Mui-selected': { fontWeight: 600 },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: { height: 3, borderRadius: '3px 3px 0 0' },
      },
    },

    MuiPopover: {
      styleOverrides: {
        paper: {
          boxShadow: '0 4px 24px -2px rgb(0 0 0 / 0.12), 0 2px 8px -2px rgb(0 0 0 / 0.08)',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
        },
      },
    },
  },
})
