import React, {useState} from 'react'
import Card from '@material-ui/core/Card'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useStateValue } from '../StateProvider'
import Switch from '@material-ui/core/Switch';
import { Grid } from '@material-ui/core';


function ProfileView(props) {
    const [state, dispatch] = useStateValue()
    const [notificationAllowed, setNotificationAllowed] = useState(false)
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
    

    const handleLogoutDialog = () => {
    
        setOpenLogoutDialog(true);
    };

    const handleCloseLogoutDialog = () => {
    
        setOpenLogoutDialog(false);
    };


    const handleLogout = () => {
        dispatch({
            type: "LOGOUT",
        })

    }
    return (
        <div>
            <Container maxWidth={false}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginTop: "16px" }}>
                        <Button onClick={handleLogoutDialog} variant="contained"  style={{borderRadius:"12px",background:props.isDark?"#9FA8DA":"rgb(63,81,181)",color:props.isDark?"#000000":"#ffffff"}}>
                            Logout &nbsp;<ExitToAppIcon />
                        </Button>

                    </div>

                    <div style={{ margin:"18px" }} />
                    <center>
                        <Card style={{ padding: "16px", borderRadius:"18px" }}>

                            {state.picture?
                            <img draggable={false} style={{borderRadius:"50%"}} width="75px"
                            height="75px" src={state.picture} alt='' />

                        :<img 
                        width="100px"
                        height="100px"
                        draggable={false}
                        alt=""
                        src="/man.svg"

                    />   

                        }
                        
                            
                            <Typography variant='h5'>
                                {state.name}
                            </Typography>

                            <Typography variant='body1'>
                                {state.email}
                            </Typography>


                            <Typography>
                                {(new Date(parseInt(state._id.substring(0, 8), 16) * 1000)).toDateString()}
                            </Typography>




                        </Card>
                    </center>
                    <Card style={{padding:"16px",marginTop:"18px",borderRadius:"18px"}}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6}>
                            <Card variant="outlined">
                            <Grid container spacing={0}>
                                <Grid item xs={6}>
                                    <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"row",alignItems:"center"}}>
                                    <Typography style={{marginLeft:"8px"}}>
                                    Dark UI
                                    </Typography>
                                    </div>
                                    
                                </Grid>
                                <Grid item xs={6}>
                                <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"flex-end"}}>
                              
                                    <Switch
                                    color="primary"
                                    style={{color:props.isDark?"#9FA8DA":"#F5F5F5"}}
                                    checked={props.isDark}
                                    onChange={() =>
                                     props.setIsDark(prevState => !prevState)}
                                    />
                                   

                                  
                                </div>
                                </Grid>

                            </Grid>
                            
                        </Card>

                            </Grid>

                            <Grid item xs={12} sm={6}>
                            <Card variant="outlined">
                            <Grid container spacing={0}>
                                <Grid item xs={6}>
                                    <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"row",alignItems:"center"}}>
                                    <Typography style={{marginLeft:"8px"}}>
                                    Notifications
                                    </Typography>
                                    </div>
                                    
                                </Grid>
                                <Grid item xs={6}>
                                <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"flex-end"}}>
                                   <Switch
                                   color="primary"
                                   style={{color:notificationAllowed?props.isDark?"#9FA8DA":"rgb(63,81,181)":"#F5F5F5"}}
                                   checked={notificationAllowed}
                                    onChange={() =>
                                     setNotificationAllowed(prevState => !prevState)}
                                    />
                                   
                                </div>
                                </Grid>

                            </Grid>
                            
                        </Card>

                            </Grid>
                        </Grid>
                        
                        
                    </Card>
                </Container>

                <Dialog
        open={openLogoutDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        
        <DialogTitle id="alert-dialog-title">{"Logout"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You will be Logged out of this Device. All cached data will be deleted, the app may load slower for the first usage.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog} style={{color:props.isDark?"#9FA8DA":"rgb(63,81,181)"}}>
            CANCEL
          </Button>
          <Button style={{color:props.isDark?"#9FA8DA":"rgb(63,81,181)"}} autoFocus onClick={handleLogout}>
            LOGOUT
          </Button>
        </DialogActions>
      </Dialog>

            
        </div>
    )
}


export default ProfileView