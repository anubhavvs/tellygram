import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './Home';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

import { useAuthContext } from '../context/auth';


const Routes = () => {
    const { user } = useAuthContext();

    return (
        <Switch>
            <Route exact path='/'>
                { user ? <Home /> : <Redirect to='/login' /> }
            </Route>
            <Route exact path='/login'>
                { !user ? <LoginPage /> : <Redirect to='/' />}
            </Route>
            <Route exact path='/register'>
                {!user ? <RegisterPage /> : <Redirect to='/' />}
            </Route>
        </Switch>
    )
}

export default Routes;
