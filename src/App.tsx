import Router from './router/Router'
import { AlertProvider } from './contexts/AlertContext'

function App() {
  return (
    <AlertProvider>
      <Router />
    </AlertProvider>
  )
}

export default App
