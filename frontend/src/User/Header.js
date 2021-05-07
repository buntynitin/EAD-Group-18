import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import ButtonBase from '@material-ui/core/ButtonBase'
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static" style={{background: props.isDark ? 'rgb(60,60,60)': 'rgb(63,81,181)'}}>
        <Toolbar>
         
          <img style={{height:"35px" ,width:"35px"}}
      alt="Logo"
      src="/userlogo.svg"
    
    />
          <Typography variant="h6" className={classes.title} style={{color:'#fff'}}>
            &nbsp;&nbsp;FooDE
          </Typography>
         

            &nbsp;&nbsp;
            <Tooltip title={props.isDark?"Light":"Dark"} style={{float:"right"}}>
            <ButtonBase disableRipple disableTouchRipple onClick = {() =>
              props.setIsDark(prevState => !prevState)}>
          <div  className={props.isDark?"toggle_dark":"toggle_light"} />
          </ButtonBase>
        </Tooltip>
        </Toolbar>
      </AppBar>
    </div>
  );
}