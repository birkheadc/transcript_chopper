import * as React from 'react';
import '../styles/reset.css';
import '../styles/vars.css';
import '../styles/shared.css';
import '../styles/inputRange.css';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainNav from '../components/nav/mainNav/MainNav';
import WelcomePage from '../components/welcome/welcomePage/WelcomePage';
import ChopperPage from '../components/chopper/chopperPage/ChopperPage';

const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';

interface AppProps {

}
/**
 * The main component that renders the app.
 * @returns {JSX.Element | null}
 */
function App(props: AppProps): JSX.Element | null {
  
  return (
    <BrowserRouter basename={PUBLIC_PATH}>
      <MainNav />
        <Routes>
          <Route path={ '/welcome' } element={ <WelcomePage /> } ></Route>
          <Route path={ '/' } element={ <ChopperPage /> } ></Route>
          <Route path={ '*' } element={ <Navigate replace={true} to={{ pathname: '/welcome' }} /> } ></Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;