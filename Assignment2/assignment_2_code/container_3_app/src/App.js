import React from 'react';
import { Profile } from "./component/Profile/Profile";
import { BrowserRouter, Route, Switch } from 'react-router-dom';

export const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/:id" component={Profile} />
      </Switch>
    </BrowserRouter>
  );
};