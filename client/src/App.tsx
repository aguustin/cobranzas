import { BrowserRouter, matchPath, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Nav from './components/nav/nav'
import Sidebar from './components/sidebar/sidebar'
import Dashboard from './components/admin/dashboard'
import Products from './components/products/products'
import Finances from './components/tienda/finances'
import Sells from './components/tienda/sells'
import Lists from './components/tienda/list'
import Stocki from './components/tienda/stock'
import LoginManager from './components/forms/loginManager'
import RegisterManager from './components/forms/registerManager'
import { ContextBodyProvider } from './context'
import EditStoreForm from './components/tienda/editStore'
import StoreResume from './components/tienda/storeResume'
import StoreStatistics from './components/tienda/storeStatistics'
import EditProductForm from './components/products/editProduct'
import ProductStatistics from './components/products/productStatistics'
import CashierSystem from './components/users/cashierLS'
import BoxesList from './components/users/boxesList'

function AppRoutes() {
  const location = useLocation();
  const hideNavOnPaths = ['/login', '/signIn', '/recover_password', '/recover_password/:token'];
  const shouldHideNav = hideNavOnPaths.some(path =>
    matchPath({ path, end: true }, location.pathname)
  );
    return (
    <>
        <ContextBodyProvider>
          {!shouldHideNav && <Nav/>}
          <div className="app-layout">
            {!shouldHideNav && <Sidebar/>}
            <main className="content">
              <Routes>
                <Route path='/signIn' element={<RegisterManager/>}/>
                <Route path='/login' element={<LoginManager/>}/>
                <Route path='/' element={<Dashboard/>}/>
                <Route path='/products/:storeId' element={<Products/>}/>
                <Route path='/edit_product/:storeId/:productId' element={<EditProductForm/>}></Route>
                <Route path='/statistics_product/:storeId/:productId' element={<ProductStatistics/>}></Route>
                <Route path='/a' element={<Finances/>}/>
                <Route path='/store_list' element={<Lists/>}/>
                <Route path='/store_resume/:storeId' element={<StoreResume/>} />
                <Route path='/edit_store/:storeId' element={<EditStoreForm/>}></Route>
                <Route path='/store_statistics/:storeId/:storeName' element={<StoreStatistics/>}></Route>
                <Route path='/cashiers_form/:storeId' element={<CashierSystem/>}/>
                <Route path='/boxes_list/:storeId' element={<BoxesList/>}/>
                <Route path='/a' element={<Sells/>}/>
                <Route path='/a' element={<Stocki/>}/>
              </Routes>
            </main>
          </div>
        </ContextBodyProvider>
    </>
  )
}

function App() {

  return (
    <>
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
    </>
  )
}

export default App
