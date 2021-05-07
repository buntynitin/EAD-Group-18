import React, {useEffect,useState} from 'react'
import {
    makeStyles,
    Container,
    Grid,
    Card,
    Button,
    Divider,
    Typography
} from '@material-ui/core';
import Page from '../../components/Page';
import { useStateValue } from '../../../StateProvider';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import axios from 'axios';
import ReactPlaceholder from 'react-placeholder';
import "react-placeholder/lib/reactPlaceholder.css";
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import StorefrontIcon from '@material-ui/icons/Storefront';

import AlarmIcon from '@material-ui/icons/Alarm';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import BusinessIcon from '@material-ui/icons/Business';
import Map from './Map'
const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(3),

    },
}));

function SettingsView() {
    const classes = useStyles();
    const [state, dispatch] = useStateValue();
    const [isloading, setIsloading] = useState(true);
    const [resDetail,setresDetail] = useState({})
    

    useEffect(()=>{
        axios.get(`http://192.168.29.82:3001/api/restaurant/restaurantDetail?owner_id=${state._id}`
    ).then(function (response) {
   
      setresDetail(response.data)
      setIsloading(false)
      
    }).catch(function (err) {
     
      console.log(err)

  })
    

    },[])

    const handleLogout = ()=>{
        dispatch({
            type:"LOGOUT",
        })

    }


    return (
        <Page
        className={classes.root}
        title="Products"
      >
          <Container maxWidth={false}>
          
             <div style={{width:"100%",textAlign:"right"}}>       
         
               <Button onClick={handleLogout} variant="contained" color="primary">
          Logout &nbsp;<ExitToAppIcon />
</Button></div>
 

      
          
              <Divider style={{marginBottom:"32px", marginTop:"32px"}}/>
              <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                  <ReactPlaceholder type='rect' showLoadingAnimation={true} ready={!isloading} style={{width:"100%",height:"300px",borderRadius:"4px"}}>
                      <Card style={{height:"300px",padding:"16px"}}>
                         <StorefrontIcon fontSize="large" /> <Typography variant="h2">{resDetail.restaurantname} </Typography>
                         <Divider style={{marginBottom:"8px",marginTop:"16px"}}/>
                         
                          <PhoneAndroidIcon style={{transform:"translateY(5px)"}}/> {resDetail.mobile}
                          <Divider style={{marginBottom:"8px",marginTop:"16px"}}/>
                          <BusinessIcon style={{transform:"translateY(5px)"}} /> {resDetail.address}, {resDetail.city}, {resDetail.state} - {resDetail.zipcode}
                          <Divider style={{marginTop:"16px", marginBottom:"8px"}}/>
                          
                            <AlarmIcon style={{transform:"translateY(5px)"}} /> {resDetail.openingtime}&nbsp;&nbsp;&nbsp;<strong>|</strong>&nbsp;&nbsp;&nbsp;
                            
                              {/* <Grid item xs={3}>
                              
                              </Grid> */}
                             
                           <AlarmOffIcon style={{transform:"translateY(5px)"}} /> {resDetail.closingtime}
                            
                          
                          
                      </Card>
                      </ReactPlaceholder>

                  </Grid>
                  <Grid item xs={12} sm={4}>
                  <ReactPlaceholder type='rect' showLoadingAnimation={true} ready={!isloading} style={{width:"100%",height:"300px"}}>
                      <Card style={{height:"300px"}}>
                         
                          <img  style={{maxWidth: "100%",
        height: "100%",
        }} src={resDetail.image} />
                          
                         
                      </Card>
                      </ReactPlaceholder>

                  </Grid>
                  <Grid item xs={12} sm={4}>
                  <ReactPlaceholder type='rect' showLoadingAnimation={true} ready={!isloading} style={{width:"100%",height:"300px"}}>
                      <Card>
                         {resDetail.coordinates && <Map latitude={resDetail.coordinates[1]} longitude={resDetail.coordinates[0]} text={"Your Restaurant"}/>}
                      </Card>
                      </ReactPlaceholder>

                  </Grid>

              </Grid>

              
          </Container>
         
        
        </Page>
    )
}

export default SettingsView
