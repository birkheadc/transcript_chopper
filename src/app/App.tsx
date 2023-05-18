import * as React from 'react';
import '../styles/reset.css';
import '../styles/vars.css';
import '../styles/shared.css';
import '../styles/inputRange.css';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainNav from '../components/features/nav/mainNav/MainNav';
import WelcomePage from '../components/features/welcome/welcomePage/WelcomePage';
import ChopPage from '../components/features/chop/chopPage/ChopPage';
import FlashcardFormatter from '../components/features/chop/chopper/flashcardFormatter/FlashcardFormatter';

const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';

interface AppProps {

}
/**
 * 
 * @param {} props
 * @returns {JSX.Element | null}
 */
function App(props: AppProps): JSX.Element | null {
  
  return (
    <BrowserRouter basename={PUBLIC_PATH}>
      <MainNav />
        <Routes>
          <Route path={ '/welcome' } element={ <WelcomePage /> } ></Route>
          <Route path={ '/' } element={ <ChopPage /> } ></Route>
          <Route path={ '*' } element={ <Navigate replace={true} to={{ pathname: '/welcome' }} /> } ></Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;