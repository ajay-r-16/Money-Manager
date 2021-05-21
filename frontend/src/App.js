
// import './App.css';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import Login from './Login/index';
import Register from './Register/index';
import Home from './Home/index';


function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/home" component={Home}/>
        <Route exact path="/"><Redirect to="/home"></Redirect></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
