import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Tooltip from '@material-ui/core/Tooltip';
import Slide from '@material-ui/core/Slide';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import {
    Home as HomeIcon,
    ShoppingBag,
    User,
    Clipboard,
    ArrowLeft
  } from 'react-feather';
import { useStateValue } from './StateProvider';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, ButtonBase } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import HomeView from './Views/HomeView'
import RestaurantView from './Views/RestaurantView'
import ProfileCard from './ProfileCard'
import WorkerSetup from './workerSetup'

function HideOnScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({ target: window ? window() : undefined });
  
    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children}
      </Slide>
    );
  }
  

const drawerWidth = 256;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(2),
        
    },
    icon: {
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(2)
      },
      button: {
        color: theme.palette.text.secondary,
        justifyContent: 'flex-start',
        letterSpacing: 0,
        padding: '10px 8px',
        textTransform: 'none',
        width: '100%'
      },
      
  
}));

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
  };






function Home( props ) {

    const Categories = [{ 'text': 'Home', 'url': '/user/home', 'active': true, icon:HomeIcon },
    { 'text': 'Orders', 'url': '/user/orders', 'active': false, icon:ShoppingBag },
    { 'text': 'Profile', 'url': '/user/profile', 'active': false, icon:User }
    ]
  
    let history = useHistory();
    const classes = useStyles();
    const [state, dispatch] = useStateValue()
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    React.useEffect(() => {
        setTimeout(function(){ WorkerSetup(state) }, 5000);
    }, [state])  


    


    function onOpen(){
        setMobileOpen(!mobileOpen)
    }
    
    function handleDrawerToggle() {
        setMobileOpen(!mobileOpen)
    }

    function handlemyDrawer()
     { 
        setMobileOpen(false)
    }

    const drawer = (
        <div>
           
        <ProfileCard />
        
        <div style={{marginTop:"16px" }} />
            

            {Categories.map((item, index) => (
                <div key={index}>
                    {(props.restaurantview && item.active)?
                     <Button key={index}
                     fullWidth
                     className={classes.button}
                     disableElevation={true}
                     disableTouchRipple={true}
                     disableRipple={true}
                     style={(item.active && !props.restaurantview )?{color:props.isDark?"#9FA8DA":"rgb(63,81,181)"}:{color:props.isDark?"#adb5bd":"gray"}}
                     disabled={item.active && !props.restaurantview}
                     //  component={RouterLink}
                     // to={item.url}
                     onClick={() => {
                             if(props.restaurantview && item.active)
                             history.goBack()
                             else
                             history.replace(item.url)
                     }}
                 >
                     {(props.restaurantview && item.active)?<ArrowLeft className={classes.icon}
                 size="20"/>:<item.icon className={classes.icon}
                 size="20"/>}
                     
                     {item.text}
                 </Button>
                    :<div />}
                {!props.restaurantview?
                     <Button key={index}
                     fullWidth
                     className={classes.button}
                
                     disableElevation={true}
                     disableTouchRipple={true}
                     disableRipple={true}
                     style={(item.active && !props.restaurantview )?{color:props.isDark?"#9FA8DA":"rgb(63,81,181)"}:{color:props.isDark?"#adb5bd":"gray"}}
                     disabled={item.active && !props.restaurantview}
                     //  component={RouterLink}
                     // to={item.url}
                     onClick={() => {
                             if(props.restaurantview && item.active)
                             history.goBack()
                             else
                             history.replace(item.url)
                     }}
                 >
                     {(props.restaurantview && item.active)?<ArrowLeft className={classes.icon}
                 size="20"/>:<item.icon className={classes.icon}
                 size="20"/>}
                     
                     {item.text}
                 </Button>
                    :<div />}
               
                {props.restaurantview && item.active?
                <Button
                className={classes.button}
                size="small"
                style={{color:props.isDark?"#9FA8DA":"rgb(63,81,181)", textTransform:"none"}}
                fullWidth
                disabled
                >
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Clipboard className={classes.icon}
                size="16"/>{"Catalog"}
                </Button>:
                <div />
            }
                </div>
                //   <ListItem button key={text}>
                //       <Button>{text}</Button>
                //     <ListItemText primary={text} />
                //   </ListItem>
            ))}
            </div>

 
    );
    return (
        <div className={classes.root}>
            <CssBaseline />
            {/* <HideOnScroll {...props}> */}
            <AppBar position="fixed" className={classes.appBar} style={{background: props.isDark ? 'rgb(60,60,60)': 'rgb(63,81,181)'}}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <img style={{height:"35px" ,width:"35px"}}
      alt="Logo"
      src="/userlogo.svg"
    
    />

          <Typography variant="h6" className={classes.title}>
            &nbsp;&nbsp;FooDE
          </Typography>
         
        <div style={{width:"100%"}}>
        <Tooltip title={props.isDark?"Light":"Dark"} style={{float:"right"}}>
            <ButtonBase disableRipple disableTouchRipple  onClick = {() =>
              props.setIsDark(prevState => !prevState)}>
          <div  className={props.isDark?"toggle_dark":"toggle_light"} />
          </ButtonBase>
        </Tooltip>
        
        </div>
 
                </Toolbar>
            </AppBar>
            {/* </HideOnScroll> */}

            <nav className={classes.drawer}>
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <SwipeableDrawer
                        
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onOpen={handleDrawerToggle}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        
                        {drawer}
                    </SwipeableDrawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <SwipeableDrawer
                    
                        className={classes.drawer}
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        open={mobileOpen}
                        onOpen={handleDrawerToggle}
                        onClose={handleDrawerToggle}
                    >   
                        <div className={classes.toolbar} />
                        {drawer}
                    </SwipeableDrawer>
                </Hidden>
            </nav>
            <div className={classes.content}>
                <div className={classes.toolbar} />
                {!props.restaurantview?<HomeView handlemyDrawer={handlemyDrawer} /> :<RestaurantView />}
            </div>
        </div>
    );
}
Home.propTypes = {
    container: PropTypes.object,
};
export default Home;
