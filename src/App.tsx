import Router from './router/Router'
import { AlertProvider } from './contexts/AlertContext'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <AlertProvider>
        <Router />
      </AlertProvider>
    </ThemeProvider>
  )
}

export default App
