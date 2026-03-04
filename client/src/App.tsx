import { BrowserRouter, matchPath, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Nav from './components/nav/nav'
import Sidebar from './components/sidebar/sidebar'
import Products from './components/products/products'
import Finances from './components/tienda/finances'
import Lists from './components/tienda/list'

import LoginManager from './components/forms/loginManager'
import RegisterManager from './components/forms/registerManager'
import { ContextBodyProvider } from './context'
import EditStoreForm from './components/tienda/editStore'
import StoreResume from './components/tienda/storeResume'
import StoreStatistics from './components/tienda/storeStatistics'
import EditProductForm from './components/products/editProduct'
import ProductStatistics from './components/products/productStatistics'
import CashierSystem from './components/cashiers/cashierLS'
import Boxes from './components/boxes/boxesSystem'
import NewSell from './components/sell/newSell'
import GetCashiers from './components/cashiers/getCashier'
import Stocki from './components/tienda/stock'
import ChoosePlan from './components/manager/choosePlan'
import CheckoutForm from './components/checkout/checkout'
import ClientList from './components/clients/clientsList'
import CashCount from './components/boxes/cashCount'
import BoxMovement from './components/boxes/boxesMovements'


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
                <Route path='/' element={<Lists/>}/>
                <Route path='/signIn' element={<RegisterManager/>}/>
                <Route path='/login' element={<LoginManager/>}/>
                <Route path='/products/:storeId' element={<Products/>}/>
                <Route path='/edit_product/:storeId/:productId' element={<EditProductForm/>}></Route>
                <Route path='/statistics_product/:storeId/:productId' element={<ProductStatistics/>}></Route>
                <Route path='/a' element={<Finances/>}/>
                <Route path='/store_list' element={<Lists/>}/>
                <Route path='/store_resume/:storeId' element={<StoreResume/>} />
                <Route path='/edit_store/:storeId' element={<EditStoreForm/>}></Route>
                <Route path='/store_statistics/:storeId/:storeName' element={<StoreStatistics/>}></Route>
                <Route path='/cashiers_form/:storeId' element={<CashierSystem/>}/>
                <Route path='/boxes_list/:storeId' element={<Boxes/>}/>
                <Route path='/new_sell/:storeId' element={<NewSell/>}/>
                <Route path='/stock/:storeId' element={<Stocki/>}/>
                <Route path='/get__store_cashiers/:storeId' element={<GetCashiers/>}/>
                <Route path='/subscription/:session' element={<ChoosePlan/>}/>
                <Route path='/checkout/:planId/:billingCycle' element={<CheckoutForm/>}/>
                <Route path='/clients_list/:storeId' element={<ClientList/>} />
                <Route path='/cash_count/:storeId' element={<CashCount/>} />
                <Route path='/boxes_movements/:storeId' element={<BoxMovement/>}/>
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
