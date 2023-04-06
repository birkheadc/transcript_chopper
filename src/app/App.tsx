import * as React from 'react';
import '../styles/reset.css';
import '../styles/vars.css';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainNav from '../components/features/nav/mainNav/MainNav';
import WelcomePage from '../components/features/welcome/welcomePage/WelcomePage';
import ChopPage from '../components/features/chop/chopPage/ChopPage';

interface AppProps {

}
/**
 * 
 * @param {} props
 * @returns {JSX.Element | null}
 */
function App(props: AppProps): JSX.Element | null {
  return (
    <BrowserRouter>
      <MainNav />
      <Routes>
        <Route path={ '/welcome' } element={ <WelcomePage /> } ></Route>
        <Route path={ '/' } element={ <ChopPage /> } ></Route>
        <Route path={ '*' } element={ <WelcomePage /> } ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;