import React, { Fragment } from "react";
import { Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from 'react-router-dom'
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    textAlign: "center",
    backgroundImage: "url(/completion.svg)",
    backgroundRepeat: "repeat",
    backgroundSize: "auto",
    minHeight: "100vh"
  },
  title: {
    padding: theme.spacing(5, 0),
    color: (theme.palette.type === 'dark')?"#fff":"#000"
  },
  subtitle: {
    color: (theme.palette.type === 'dark')?"#9FA8DA":"rgb(63,81,181)"
  },
  button:{
    color: (theme.palette.type === 'dark')?"#9FA8DA":"rgb(63,81,181)"
  }

}));

const Success =  () => {
  const classes = useStyles();
  return (
    
       <Fragment >
        
      <div className={classes.root}>
      <Typography variant='h4' className={classes.title}>
        Congratulation! 
      </Typography>
      <Typography variant='h6' className={classes.subtitle}>
      You have been registered.
      </Typography>
      <br />
      <Link to="/user/Login" style={{textDecoration:"none"}}>
      <Button variant="outlined" className={classes.button}>
        Login
      </Button>
      </Link>
      
      </div>
    </Fragment>
    
   
  );
};

export default Success