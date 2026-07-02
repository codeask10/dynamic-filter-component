import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import { UsersPage }        from './pages/UsersPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { OrdersPage }       from './pages/OrdersPage'

const TABS = [
  { label: 'Users',        Page: UsersPage },
  { label: 'Transactions', Page: TransactionsPage },
  { label: 'Orders',       Page: OrdersPage },
]

export function App() {
  const [activeTab, setActiveTab] = useState(0)
  const { Page } = TABS[activeTab]

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" bgcolor="background.default">
      <AppBar
        position="sticky"
        color="inherit"
        sx={{ bgcolor: 'background.paper', zIndex: (t) => t.zIndex.appBar }}
      >
        <Toolbar sx={{ gap: 2, minHeight: { xs: 56, sm: 64 } }}>
          <Box display="flex" alignItems="center" gap={1} sx={{ mr: 2 }}>
            <GridViewRoundedIcon sx={{ color: 'primary.main', fontSize: 22 }} />
            <Typography variant="subtitle1" color="text.primary" noWrap>
              DataGrid
            </Typography>
          </Box>

          <Tabs
            value={activeTab}
            onChange={(_, v: number) => setActiveTab(v)}
            textColor="primary"
            indicatorColor="primary"
            sx={{ flex: 1 }}
          >
            {TABS.map(({ label }) => (
              <Tab key={label} label={label} />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="xl"
        sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 4 }, flex: 1 }}
      >
        <Page />
      </Container>
    </Box>
  )
}
