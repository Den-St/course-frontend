import { BrowserRouter } from 'react-router-dom'
import { RoutesSwitch } from './routes/router'
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <RoutesSwitch />
    </BrowserRouter>
  )
}

export default App
