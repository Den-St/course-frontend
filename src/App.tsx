import { BrowserRouter } from 'react-router-dom'
import { RoutesSwitch } from './routes/router'
import { AuthWrapper } from './components/AuthWrapper/AuthWrapper'
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthWrapper>
        <RoutesSwitch />
      </AuthWrapper>
    </BrowserRouter>
  )
}

export default App
