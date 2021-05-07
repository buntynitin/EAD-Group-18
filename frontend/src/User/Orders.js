import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ButtonBase from '@material-ui/core/ButtonBase'
import Tooltip from '@material-ui/core/Tooltip';
import {
    Home as HomeIcon,
    ShoppingBag,
    User,
    ArrowLeft,
    Info
  } from 'react-feather';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import OrderDetailView from './Views/OrderDetailView'
import { useHistory } from 'react-router-dom';
import ProfileCard from './ProfileCard'
import OrderView from './Views/OrderView'
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
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    closeMenuButton: {
        marginRight: 'auto',
        marginLeft: 0,
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
function Orders( {orderdetailview, isDark, setIsDark} ) {
    const Categories = [{ 'text': 'Home', 'url': '/user/home', 'active': false, icon:HomeIcon },
    { 'text': 'Orders', 'url': '/user/orders', 'active': true, icon:ShoppingBag },
    { 'text': 'Profile', 'url': '/user/profile', 'active': false, icon:User }
    ]
    let history = useHistory();
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    function handleDrawerToggle() {
        setMobileOpen(!mobileOpen)
    }
    const drawer = (
        <div>
            <ProfileCard />

            <div style={{marginTop:"16px" }} />
            

            {orderdetailview?<div>
                <Button 
                    fullWidth
                    className={classes.button}
                    disableElevation={true}
                    disableTouchRipple={true}
                    disableRipple={true}
                    style={{color:isDark?"#adb5bd":"gray"}}

                    //  component={RouterLink}
                    // to={item.url}
                    onClick={() => {
                        setMobileOpen(false)
                        history.goBack()
                    }}
                ><ArrowLeft className={classes.icon}
                size="20"/>
                    Orders
                </Button>
                <Button
                className={classes.button}
                size="small"
                style={{color:isDark?"#9FA8DA":"rgb(63,81,181)", textTransform:"none"}}
                fullWidth
                disabled
                >
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Info className={classes.icon}
                size="16"/>{"Order Detail"}
                </Button>
                

            </div>:
            <div>
            {Categories.map((item, index) => (
                <Button key={index}
                    fullWidth
                    className={classes.button}
                    disableElevation={true}
                    disableTouchRipple={true}
                    disableRipple={true}
                    style={item.active?{color:isDark?"#9FA8DA":"rgb(63,81,181)",alignItems:"left"}:{color:isDark?"#adb5bd":"gray"}}
                    disabled={item.active}
                    //  component={RouterLink}
                    // to={item.url}
                    onClick={() => {
                       
                        history.replace(item.url)
                    }}
                ><item.icon className={classes.icon}
                size="20"/>
                    {item.text}
                </Button>
                
                
            ))}
            </div>
            }
            </div>
    );
    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar} style={{background: isDark ? 'rgb(60,60,60)': 'rgb(63,81,181)'}}>
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
          <Tooltip title={isDark?"Light":"Dark"} style={{float:"right"}}>
            <ButtonBase disableRipple disableTouchRipple  onClick = {() =>
              setIsDark(prevState => !prevState)}>
          <div  className={isDark?"toggle_dark":"toggle_light"} />
          </ButtonBase>
        </Tooltip>
        </div>
                </Toolbar>
            </AppBar>

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
                {orderdetailview?<OrderDetailView />:<OrderView />}
            </div>
        </div>
    );
}
Orders.propTypes = {
    container: PropTypes.object,
};
export default Orders;
