import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Nav from './components/nav/nav'
import Sidebar from './components/sidebar/sidebar'
import Dashboard from './components/admin/dashboard'
import Products from './components/tienda/products'
import Finances from './components/tienda/finances'
import Sells from './components/tienda/sells'
import Lists from './components/tienda/list'
import Stocki from './components/tienda/stock'

function App() {

  return (
    <>
      <BrowserRouter>
          <Nav/>
          <div className="app-layout">
            <Sidebar/>
            <main className="content">
              <Routes>
                <Route path='/' element={<Dashboard/>}/>
                <Route path='/a' element={<Products/>}/>
                <Route path='/a' element={<Finances/>}/>
                <Route path='/a' element={<Lists/>}/>
                <Route path='/a' element={<Sells/>}/>
                <Route path='/a' element={<Stocki/>}/>
              </Routes>
            </main>
          </div>
      </BrowserRouter>
    </>
  )
}

export default App
