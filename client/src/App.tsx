import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Nav from './components/nav/nav'
import Sidebar from './components/sidebar/sidebar'
import Dashboard from './components/admin/dashboard'

function App() {

  return (
    <>
      <BrowserRouter>
          <Nav/>
          <Sidebar/>
          <Routes>
            <Route path='/' element={<Dashboard/>}/>
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
