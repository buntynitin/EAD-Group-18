import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useStateValue } from '../StateProvider'
import { Typography, Grid, Card, Divider, IconButton, Avatar, Fab, Slide, Dialog, TextField, ButtonBase } from '@material-ui/core'
import { Printer, MessageSquare, ArrowRightCircle, Map as MapIcon, Package} from 'react-feather'
import axios from 'axios'
import { useTheme, makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import ReactPlaceholder from 'react-placeholder';
import Navigation from './Navigation'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import io from "socket.io-client";
const socket = io("http://192.168.29.82:5000/");

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const darktheme = createMuiTheme({
    overrides: {
     MuiStepIcon: {
      root: {
        '&$completed': {
          color: '#7986CB',
        },
        '&$active': {
          color: '#7986CB ',
        },
      
        
      },
      active: {},
      completed: {},
      
    },
  
    },
   
  })

const useStyles = makeStyles((theme) => ({
    input: {
        background: (theme.palette.type === 'dark') ? '#424242' : '#fff',
        '& label.Mui-focused': {
            color: theme.palette.type === 'dark' ? '#9FA8DA' : 'rgba(63,81,181)',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: theme.palette.type === 'dark' ? '#9FA8DA' : 'rgba(63,81,181)',
        },
        '& .MuiOutlinedInput-root': {

            '&.Mui-focused fieldset': {
                borderColor: theme.palette.type === 'dark' ? '#9FA8DA' : 'rgba(63,81,181)',
            },
        },

    },

    notchedOutline: {
        borderColor: (theme.palette.type === 'dark') ? '#fff' : '#9E9E9E'
    }

}))

var messagesEnd

function getSteps() {
    return ['Order Processing', 'Order Confirmed', 'Preparing your meal', 'Awaiting delivery agent', 'In Transit', 'Delivered'];
}

export default function OrderDetailView() {
    const theme = useTheme()
    const steps = getSteps();
    const classes = useStyles();
    const location = useLocation()
    const [state] = useStateValue()
    const [newMessage, setNewMessage] = useState('')
    const [order, setOrder] = useState({})
    const [hasError, setHasError] = useState(false)
    const [trackingOpen, setTrackingOpen] = useState(false)
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [load, setLoad] = useState(false)

    useEffect(() =>{
        socket.emit("join_room",{room_id:(new URLSearchParams(location.search).get('order_id'))})

        socket.on("getMessageFromRestaurant",(data) => {
            recallAPI()
        }) 

        socket.on("receiveUpdateFromRestaurant",(data) => {
            recallAPI()
        }) 
        
    },[])


    const recallAPI = () =>{


        if (new URLSearchParams(location.search).get('order_id')) {
            axios.get(`http://192.168.29.82:3001/api/order/getOrderbyidv2?order_id=${new URLSearchParams(location.search).get('order_id')}`, {
                headers: {
                    'auth-token': state.token
                }
            }).then((response) => {
            
                setOrder(response.data)
                setHasError(false)
                scrollToBottom();
                


            }).catch((err) => {
                setHasError(true)
            });

        } else {

            setHasError(true)
        }

    }

    


    const getIndex = (status) => {
        switch (status) {
            case 'Order Processing':
                return 0
            case 'Order Confirmed':
                return 1
            case 'Preparing your meal':
                return 2
            case 'Awaiting delivery agent':
                return 3
            case 'In Transit':
                return 4
            case 'Delivered':
                return 5
            default:
                return 0;
        }

    }

    const scrollToBottom = () => {
        messagesEnd.scrollIntoView();
    }


    const handleClickOpen = () => {
        setOpen(true);

    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpen1 = () => {
        setOpen1(true);

    };

    const handleClose1 = () => {
        setOpen1(false);
    };




    const handleSend = () => {

        if (newMessage.replace(/\s/g, '') === '')
            return
        else {
            setLoad(true)
            const obj = { order_id: order.order_id, by: 'user', message: newMessage }
            axios.post('http://192.168.29.82:3001/api/order/addMessage', obj, {

                headers: {
                    'auth-token': state.token
                }
            }).then((response) => {
                
                setOrder({...order,custom_chat:[...order.custom_chat,{by: 'user', message: newMessage}]}) 
                scrollToBottom();
                setLoad(false)
                setNewMessage('')


            }).catch((err) => {
                scrollToBottom();
                setLoad(false)
                setNewMessage('')

            });

        }
    }

    const getTotalamount = () => {
        var total = 0
        var i
        for (i = 0; i < order.basket.length; i++)
            total += order.basket[i].price * order.basket[i].count

        return total
    }

    useEffect(() => {
        if (messagesEnd) scrollToBottom();
    }, [open])

    useEffect(() => {
        recallAPI()
    },[])
    
    return (
        <div style={{ marginBottom: "80px" }}>

           
            { ((JSON.stringify(order).replace(/\s/g, '') === '{}') && !hasError) ?
                // <center><img style={{marginTop:"35vh"}} width='200px' height="130px" src="/loading.svg" alt=""/>
                // <Typography style={{transform:"translateY(-40px)"}}>
                //     Getting Order detail ..
                // </Typography>

                // </center>
                <div style={{ marginTop: "16px" }}>
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={6} >
                            <ReactPlaceholder style={{ borderRadius: "18px", width: "100%", height: "450px" }} type="rect" ready={false} showLoadingAnimation={true} color={(theme.palette.type === 'dark') ? "#424242" : 'rgba(63,81,181,0.3)'} />


                        </Grid>
                        <Grid item xs={12} sm={6} >

                            <ReactPlaceholder style={{ borderRadius: "18px", width: "100%", height: "450px" }} type="rect" ready={false} showLoadingAnimation={true} color={(theme.palette.type === 'dark') ? "#424242" : 'rgba(63,81,181,0.3)'} />
                        </Grid>
                    </Grid>

                </div> :
                <div>

                    <div>
                        {hasError ?
                            <center><img style={{ marginTop: "35vh" }} width='200px' height="130px" src="/order.svg" alt="" />
                                <Typography variant='h5'>
                                    No such Order
         </Typography>

                            </center> :
                            <div>

                                <div style={{ position: "fixed", bottom: "16px", right: "16px" }}>
                                    {(order.order_status === 'In Transit') && <Fab onClick={handleClickOpen1} style={{ marginRight: "8px", background: (theme.palette.type === 'dark') ? "#F48FB1" : "#E91E63", color: (theme.palette.type === 'dark') ? "#000000" : "#ffffff" }}>
                                        <MapIcon />
                                    </Fab>
                                    }
                                    <Fab onClick={handleClickOpen} style={{ background: (theme.palette.type === 'dark') ? "#9FA8DA" : "rgb(63,81,181)", color: (theme.palette.type === 'dark') ? "#000000" : "#ffffff" }} >
                                        <MessageSquare />
                                    </Fab>
                                </div>

                                <Dialog
                                    open={trackingOpen}
                                    onClose={() => setTrackingOpen(false)}
                                >
                                    <ThemeProvider theme={(theme.palette.type === 'dark') ? darktheme : theme}>
                                        <div style={{padding:"8px"}}>
                                        <div style={{padding:"8px"}}>
                                        <Typography style={{color:(theme.palette.type === 'dark')?"#9FA8DA":"rgb(63,81,181)"}}>
                                            Order Status&nbsp;<Package style={{transform:"translateY(4px)"}} />
                                        </Typography>
                                        </div>
                                        <Divider style={{backgroundColor:(theme.palette.type === 'dark')?"#9FA8DA":"rgb(63,81,181)"}} />
                                       
                                        <Stepper activeStep={getIndex(order.order_status)} style={{width:"320px", background: (theme.palette.type === 'dark') ? "#424242" : "#fff" }} orientation="vertical">
                                            {steps.map((label, index) => (
                                                <Step key={label}>
                                                    <StepLabel><Typography variant="body1" style={{ fontSize: (index === getIndex(order.order_status)) ? "20px" : "15px", color: (index === getIndex(order.order_status)) ? (theme.palette.type === 'dark') ? "#fff" : "#000" : (theme.palette.type === 'dark') ? "#9E9E9E" : "gray" }}>{label}</Typography></StepLabel>

                                                </Step>
                                            ))}
                                        </Stepper>
                                        </div>
                                    </ThemeProvider>
                                </Dialog>


                                <Grid container spacing={2}>

                                    <Grid item sm={6} xs={12}>
                                        <Card style={{ marginTop: "16px", padding: "16px", borderRadius: "18px" }} >
                                            <Typography style={{ fontSize: "18px" }}>
                                                Order Detail <IconButton onClick={() => window.print()} style={{ transform: "scale(0.8)" }}>
                                                    <Avatar style={{ background: (theme.palette.type === 'dark') ? "#9FA8DA" : "rgb(63,81,181)" }}>
                                                        <Printer />
                                                    </Avatar>
                                                </IconButton>
                                            </Typography>
                                            {/* <Divider style={{ marginTop: "2px", marginBottom: "8px" }}/> */}
                                            <Card style={{ padding: "8px", marginBottom: "8px" }} variant="outlined">
                                                <Grid container spacing={0}>

                                                    <Grid item xs={6}>
                                                        <Typography style={{ color: (theme.palette.type === 'dark') ? "#dee2e6" : "#6c757d" }}>
                                                            Restaurant
                    </Typography>

                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                                            <Typography variant='body2' style={{ transform: "translateY(20%)" }}>
                                                                {order.restaurant_name}
                                                            </Typography>
                                                        </div>

                                                    </Grid>

                                                </Grid>
                                            </Card>
                                            <Card style={{ padding: "8px", marginBottom: "8px" }} variant="outlined">
                                                <Grid container spacing={0}>
                                                    <Grid item xs={6}>
                                                        <Typography style={{ color: (theme.palette.type === 'dark') ? "#dee2e6" : "#6c757d" }}>
                                                            Amount
                    </Typography>

                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                                            <Typography variant='body2' style={{ transform: "translateY(20%)" }}>
                                                                ₹{order.total_amount}
                                                            </Typography>
                                                        </div>
                                                    </Grid>

                                                </Grid>
                                            </Card>
                                            <Card style={{ padding: "8px", marginBottom: "8px" }} variant="outlined">
                                                <Grid container spacing={0}>
                                                    <Grid item xs={6}>
                                                        <Typography style={{ color: (theme.palette.type === 'dark') ? "#dee2e6" : "#6c757d" }}>
                                                            Payment type
                    </Typography>

                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                                            <Typography variant='body2' style={{ transform: "translateY(20%)" }}>
                                                                {order.payment_type}
                                                            </Typography>
                                                        </div>

                                                    </Grid>

                                                </Grid>
                                            </Card>
                                            {(order.payment_type === 'PREPAID') ?
                                                <div>
                                                    <Card style={{ padding: "8px", marginBottom: "8px" }} variant="outlined">
                                                        <Grid container spacing={0}>
                                                            <Grid item xs={6}>
                                                                <Typography style={{ color: (theme.palette.type === 'dark') ? "#dee2e6" : "#6c757d" }}>
                                                                    Payment status
                    </Typography>

                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                                                    <Typography variant='body2' style={{ transform: "translateY(20%)", color: (order.payment_status === 'Payment failed') ? (theme.palette.type === 'dark') ? "#f07167" : "#e63946" : (theme.palette.type === 'dark') ? '#fff' : '#000' }} >

                                                                        {order.payment_status}
                                                                    </Typography>
                                                                </div>
                                                            </Grid>


                                                        </Grid>
                                                    </Card>
                                                </div>
                                                :
                                                <div />
                                            }
                                            <Card style={{ padding: "8px", marginBottom: "8px" }} variant="outlined">
                                                <Grid container spacing={0}>
                                                    <Grid item xs={6}>
                                                        <div style={{ display: "flex", flexDirection: "row" }}>
                                                            <Typography style={{ color: (theme.palette.type === 'dark') ? "#dee2e6" : "#6c757d" }}>
                                                                Order status
                                                        </Typography>
                                                            {
                                                                (order.order_status !== 'Order Cancelled') &&
                                                                <div style={{ marginLeft: "4px" }}>
                                                                    <ButtonBase style={{ borderRadius: "8px" }} onClick={() => setTrackingOpen(true)}>
                                                                        <div style={{ background: (theme.palette.type === 'dark') ? "rgba(159,168,218,0.2)" : "rgba(63,81,181,0.2)", paddingLeft: "4px", paddingRight: "4px", borderRadius: "8px", borderWidth: "1.5px", borderStyle: "solid", borderColor: (theme.palette.type === 'dark') ? "#9FA8DA" : "rgb(63,81,181)" }}>
                                                                            <Typography variant="caption">
                                                                                Track
                                                        </Typography>
                                                                        </div>
                                                                    </ButtonBase>
                                                                </div>
                                                            }



                                                        </div>


                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                                            <Typography variant='body2' style={{ transform: "translateY(20%)", color: (order.order_status === 'Order Cancelled') ? (theme.palette.type === 'dark') ? "#f07167" : "#e63946" : (theme.palette.type === 'dark') ? '#fff' : '#000' }}>
                                                                {order.order_status}
                                                            </Typography>
                                                        </div>
                                                    </Grid>

                                                </Grid>
                                            </Card>

                                            <Card style={{ padding: "8px", marginBottom: "8px" }} variant="outlined">
                                                <Grid container spacing={0}>
                                                    <Grid item xs={6}>
                                                        <Typography style={{ color: (theme.palette.type === 'dark') ? "#dee2e6" : "#6c757d" }}>
                                                            Date
                    </Typography>

                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                                            <Typography variant='body2' style={{ transform: "translateY(20%)" }}>
                                                                {(new Date(order.time)).toDateString()}
                                                            </Typography>
                                                        </div>

                                                    </Grid>

                                                </Grid>
                                            </Card>

                                            <Card style={{ padding: "8px", marginBottom: "8px" }} variant="outlined">
                                                <Grid container spacing={0}>
                                                    <Grid item xs={6}>
                                                        <Typography style={{ color: (theme.palette.type === 'dark') ? "#dee2e6" : "#6c757d" }}>
                                                            Time
                    </Typography>

                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                                            <Typography variant='body2' style={{ transform: "translateY(20%)" }}>
                                                                {(new Date(order.time)).toLocaleTimeString()}
                                                            </Typography>
                                                        </div>

                                                    </Grid>

                                                </Grid>
                                            </Card>



                                        </Card>
                                    </Grid>
                                    <Grid item sm={6} xs={12}>
                                        <Card style={{ marginTop: "16px", padding: "16px", borderRadius: "18px" }}>
                                            <Typography style={{ fontSize: "18px" }}>
                                                Food Items
            </Typography>

                                            <Divider style={{ marginTop: "2px", marginBottom: "8px" }} />

                                            {order.basket.map((item, index) =>
                                                <div key={index}>
                                                    <div style={{ fontSize: "16px", color: (theme.palette.type === 'dark') ? "#e9ecef" : "#343a40" }}>
                                                        <img alt="" draggable={false} style={{ width: "12px", heigth: "12px" }} src={item.isnonveg ? "/nveg.svg" : "/veg.svg"} />
                                &nbsp;
                                {item.name}



                                                    </div>

                                                    <Grid container>
                                                        <Grid item xs={10}>
                                                            <div style={{ display: "flex", alignItems: "flex-end" }}>
                                                                <div style={{ padding: "1px", borderRadius: "2px", width: "24px", background: (theme.palette.type === 'dark') ? "rgba(159,168,218,0.2)" : "rgba(63,81,181,0.2)", borderWidth: "1.5px", borderStyle: "solid", borderColor: (theme.palette.type === 'dark') ? "#9FA8DA" : "rgb(63,81,181)" }}>
                                                                    <center>{item.count}</center>
                                                                </div>
                                                                <Typography variant="caption" style={{ fontSize: "13px", marginLeft: "12px", color: (theme.palette.type === 'dark') ? "#e9ecef" : "#343a40" }}>X&nbsp;&nbsp;₹{item.price}</Typography>
                                                            </div>

                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                                                <Typography variant="caption" style={{ fontSize: "13px", color: (theme.palette.type === 'dark') ? "#e9ecef" : "#343a40" }}>
                                                                    ₹{(item.price * item.count).toFixed(2)}
                                                                </Typography>

                                                            </div>

                                                        </Grid>
                                                    </Grid>





                                                    <Divider style={{ marginTop: "20px", marginBottom: "8px" }} />



                                                </div>


                                            )}
                                            <Grid container>
                                                <Grid item xs={10}>
                                                    <Typography style={{ color: (theme.palette.type === 'dark') ? "#dee2e6" : "#495057" }}>
                                                        Item total
                                       </Typography>

                                                </Grid>
                                                <Grid item xs={2}>
                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                                        <Typography style={{ color: (theme.palette.type === 'dark') ? "#dee2e6" : "#495057" }}>
                                                            ₹{getTotalamount().toFixed(2)}
                                                        </Typography>

                                                    </div>

                                                </Grid>
                                                <Grid item xs={10}>
                                                    <Typography variant="caption" style={{ fontSize: "13px", color: (theme.palette.type === 'dark') ? "#adb5bd" : "#6c757d" }}>
                                                        Taxes(5%)
                                       </Typography>

                                                </Grid>
                                                <Grid item xs={2}>
                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                                        <Typography variant="caption" style={{ fontSize: "13px", color: (theme.palette.type === 'dark') ? "#adb5bd" : "#6c757d" }}>
                                                            ₹{(getTotalamount() * 0.05).toFixed(2)}
                                                        </Typography>

                                                    </div>

                                                </Grid>
                                                <Grid item xs={10}>
                                                    <Typography variant="caption" style={{ fontSize: "13px", color: (theme.palette.type === 'dark') ? "#adb5bd" : "#6c757d" }}>
                                                        Delivery Charge(10%)
                                       </Typography>

                                                </Grid>
                                                <Grid item xs={2}>
                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", color: (theme.palette.type === 'dark') ? "#adb5bd" : "#6c757d" }}>
                                                        <Typography variant="caption" style={{ fontSize: "13px" }}>
                                                            ₹{(getTotalamount() * 0.1).toFixed(2)}
                                                        </Typography>

                                                    </div>

                                                </Grid>


                                            </Grid>

                                            <Divider style={{ marginTop: "8px" }} />
                                            <Grid container>
                                                <Grid item xs={10}>
                                                    <Typography style={{ color: (theme.palette.type === 'dark') ? "#dee2e6" : "#495057" }}>
                                                        Grand Total
                                       </Typography>

                                                </Grid>
                                                <Grid item xs={2}>
                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                                        <Typography style={{ color: (theme.palette.type === 'dark') ? "#dee2e6" : "#495057" }} >
                                                            <strong>₹{(getTotalamount() * 0.1 + getTotalamount() + getTotalamount() * 0.05).toFixed(2)}</strong>
                                                        </Typography>

                                                    </div>

                                                </Grid>


                                            </Grid>
                                        </Card>
                                    </Grid>
                                </Grid>

                                <Dialog
                                    open={open1}
                                    fullWidth={'sm'}
                                    TransitionComponent={Transition}
                                    keepMounted
                                    onClose={handleClose1}
                                    aria-labelledby="alert-dialog-slide-title"
                                    aria-describedby="alert-dialog-slide-description"
                                >

                                    <Navigation
                                        width='100%'
                                        height='80vh'
                                        room_id={order.order_id}
                                        lat1={order.address.lat}
                                        long1={order.address.long}
                                        lat2={order.restaurant[0].coordinates[1]}
                                        long2={order.restaurant[0].coordinates[0]}
                                    />


                                </Dialog>

                                <Dialog
                                    open={open}
                                    TransitionComponent={Transition}
                                    keepMounted
                                    onClose={handleClose}
                                    aria-labelledby="alert-dialog-slide-title"
                                    aria-describedby="alert-dialog-slide-description"
                                >





                                    <div style={{ width: "320px", height: "80vh", background: (theme.palette.type === 'dark') ? "url(https://res.cloudinary.com/dez3yjolk/image/upload/v1612114941/fooditems/chatbg_mqalhs.svg)" : "url(https://res.cloudinary.com/dez3yjolk/image/upload/v1607089644/samples/chatbackground_tjkimh.svg)" }}>
                                        <div style={{ padding: "16px 8px 8px 8px" }}>
                                            <Typography variant='h5' style={{ color: (theme.palette.type === 'dark') ? "#9FA8DA" : "rgb(63,81,181)" }}>
                                                Chat<MessageSquare />
                                            </Typography>
                                            <Divider style={{ background: (theme.palette.type === 'dark') ? "#9FA8DA" : "rgb(63,81,181)", marginBottom: "12px" }} />
                                            <div className='chatbox' style={{ height: "60vh", overflow: "hidden", overflowY: "auto" }}>
                                                {


                                                    order.custom_chat.map((mssge, index) =>

                                                        <div key={index}>
                                                            {(mssge.by === 'restaurant') ?
                                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                                                    <Card style={{ maxWidth: "70%", padding: "8px", marginBottom: "12px", borderTopRightRadius: "18px", borderBottomLeftRadius: "18px", borderBottomRightRadius: "18px", background: (theme.palette.type === 'dark') ? "rgba(159,168,218,0.8)" : "rgba(63,81,181,0.8)" }}>
                                                                        <Typography style={{ color: (theme.palette.type === 'dark') ? "#000" : "#fff" }}>
                                                                            {mssge.message}
                                                                        </Typography>
                                                                    </Card></div> :
                                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                                                    <Card style={{ maxWidth: "70%", padding: "8px", marginBottom: "12px", borderTopRightRadius: "18px", borderBottomLeftRadius: "18px", borderTopLeftRadius: "18px", background: (theme.palette.type === 'dark') ? "rgba(159,168,218,0.8)" : "rgba(63,81,181,0.8)" }}>
                                                                        <Typography style={{ color: (theme.palette.type === 'dark') ? "#000" : "#fff" }}>
                                                                            {mssge.message}
                                                                        </Typography>
                                                                    </Card>
                                                                </div>



                                                            }
                                                        </div>
                                                    )

                                                }
                                                <div style={{ float: "left", clear: "both" }}
                                                    ref={(el) => { messagesEnd = el; }}>
                                                </div>

                                            </div>



                                        </div>

                                        <Grid container style={{ width: "100%", position: "absolute", bottom: "0px" }}>
                                            <Grid item xs={10}>
                                                <TextField

                                                    fullWidth
                                                    variant='outlined'
                                                    size='small'
                                                    value={newMessage}
                                                    className={classes.input}
                                                    onChange={(e) => {
                                                        setNewMessage(e.target.value)
                                                    }}

                                                    InputProps={{
                                                        classes: {

                                                            notchedOutline: classes.notchedOutline,
                                                        },

                                                    }}

                                                    placeholder='Type a message'>
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <div style={{ width: "100%", border: (theme.palette.type === 'dark') ? "1px solid #9FA8DA" : "1px solid rgb(63,81,181)", background: (theme.palette.type === 'dark') ? "rgba(159,168,218,0.2)" : "rgba(63,81,181,0.2)", height: "100%", display: "flex", alignItems: "center", borderRadius: "4px" }}>


                                                    <ArrowRightCircle className="sendButton" onClick={() => handleSend()} style={{ marginLeft: "50%", transform: "translatex(-50%)" }} color={load ? "gray" : (theme.palette.type === 'dark') ? "#9FA8DA" : "rgb(63,81,181)"} />




                                                </div>


                                            </Grid>
                                        </Grid>
                                    </div>


                                </Dialog>

                            </div>

                        }
                    </div>

                </div>


            }


        </div>
    )
}
