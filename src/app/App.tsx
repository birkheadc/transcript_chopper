import * as React from 'react';
import '../styles/reset.css';
import '../styles/vars.css';
import '../styles/shared.css';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainNav from '../components/features/nav/mainNav/MainNav';
import WelcomePage from '../components/features/welcome/welcomePage/WelcomePage';
import ChopPage from '../components/features/chop/chopPage/ChopPage';
import Exporter from '../components/features/chop/chopper/exporter/Exporter';
import Finalizer from '../components/features/chop/chopper/finalizer/Finalizer';

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
      <div id='main-wrapper'>
        <Routes>
          <Route path={ '/welcome' } element={ <WelcomePage /> } ></Route>
          <Route path={ '/' } element={ <ChopPage /> } ></Route>
          <Route path={ '/test' } element={<main><div className='chop-page-wrapper'><div className='chopper-wrapper'><div className='chopper-body'><Finalizer originalAudioFile={new File([''], '')} pairs={[ { stub: 'This is a stub', range: { from: 0.0, to: 0.1 }}, { stub: 'Here is another', range: { from: 0.2, to: 0.3 }} ]} /></div></div></div></main>}></Route>
          <Route path={ '*' } element={ <WelcomePage /> } ></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;