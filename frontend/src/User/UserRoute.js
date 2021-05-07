import React from 'react';
import Login from './Login'
import Home from './Home'
import Register from './Register'
import Orders from './Orders'
import Profile from './Profile'
import OrderCallback from './OrderCallback'
import { useStateValue } from './StateProvider';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  Redirect
} from "react-router-dom";
import NotFound from './NotFound'
import { createMuiTheme, ThemeProvider, makeStyles } from "@material-ui/core";

function UserRoute() {
  const { path } = useRouteMatch();
  const [state , dispatch] = useStateValue();
  const [isDark, setIsDark] = React.useState(getInitialMode());

  const mytheme = createMuiTheme({
    palette: {
      type: isDark ? "dark" : "light"
    }
  });

  const useStyles = makeStyles(() => ({
    mydiv: {
      minHeight: "100vh",
      backgroundColor: mytheme.palette.background.default,
      color: mytheme.palette.getContrastText(mytheme.palette.background.default)
    }
  }));

  let classes = useStyles();

  React.useEffect(() => {
    localStorage.setItem("dark", JSON.stringify(isDark))
  }, [isDark])

  function getInitialMode() {
    const isReturninguser = "dark" in localStorage
    const savedMode = JSON.parse(localStorage.getItem('dark'))
    const userPrefersDark = getPrefColorScheme();
    if(isReturninguser) return savedMode
    else if(userPrefersDark) return true
    else return false
  }

  function getPrefColorScheme(){
    if(!window.matchMedia) return

    return window.matchMedia("(prefers-color-scheme: dark)").matches
  }
  return (
    <ThemeProvider theme={mytheme}>
      <div className={classes.mydiv}>
    
    <Router>
     <Switch>
       
        <Route exact path={`${path}/`}>
        <Redirect
            to={{
              pathname: `${path}/login`,
            }}
          />
          </Route>

          <Route path={`${path}/login`}>
          {state.isLoggedin?<Redirect
            to={{
              pathname: `${path}/home`,
            }}
          />:<Login isDark={isDark} setIsDark={setIsDark} />}
          </Route>

          <Route path={`${path}/home`}>
          {!state.isLoggedin?<Redirect
            to={{
              pathname: `${path}/login`,
            }}
          />:<Home isDark={isDark} setIsDark={setIsDark} />}
          </Route>

          <Route path={`${path}/orders`}>
          {!state.isLoggedin?<Redirect
            to={{
              pathname: `${path}/login`,
            }}
          />:<Orders isDark={isDark} setIsDark={setIsDark} />}
          </Route>
          
          <Route path={`${path}/orderdetail`}>
          {!state.isLoggedin?<Redirect
            to={{
              pathname: `${path}/login`,
            }}
          />:<Orders orderdetailview={true} isDark={isDark} setIsDark={setIsDark} />}
        </Route>



          <Route path={`${path}/profile`}>
          {!state.isLoggedin?<Redirect
            to={{
              pathname: `${path}/login`,
            }}
          />:<Profile isDark={isDark} setIsDark={setIsDark} />}
          </Route>


          <Route path={`${path}/register`}>
          {state.isLoggedin?<Redirect
            to={{
              pathname: `${path}/home`,
            }}
          />:<Register isDark={isDark} setIsDark={setIsDark} />}
        </Route>

        <Route path={`${path}/restaurant`}>
          {!state.isLoggedin?<Redirect
            to={{
              pathname: `${path}/login`,
            }}
          />:<Home restaurantview={true} isDark={isDark} setIsDark={setIsDark} />}
        </Route>

        <Route path={`${path}/ordercallback`}>
        {!state.isLoggedin?<Redirect
            to={{
              pathname: `${path}/login`,
            }}
          />:<OrderCallback isDark={isDark} setIsDark={setIsDark} />}

          
        </Route>

    
          
        <Route path="*">
        <NotFound />
        </Route>
      
       
        </Switch>
    
    </Router>
    </div>
    </ThemeProvider>
   
  );
}

export default UserRoute


