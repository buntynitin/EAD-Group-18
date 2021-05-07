import React, {useEffect,useState} from 'react'
import { useStateValue } from '../StateProvider'
import {Grid,Card, CardActionArea, Typography, Button} from '@material-ui/core'
import axios from 'axios'
import ReactPlaceholder from 'react-placeholder';
import { useHistory } from 'react-router-dom'
import { useTheme } from '@material-ui/core/styles'
export default function OrderView() {
    const [state] = useStateValue()
    const theme = useTheme()
    const [orderList, setOrderList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const history = useHistory()

    const updatePage = () =>{
        setPage(prevState => prevState + 1)
    }

    useEffect(() => {
        axios.get(`http://192.168.29.82:3001/api/order/getOrderbyuserid?page_no=${page}`,{
            headers: {
                'auth-token': state.token
            }
        }
        
        ).then(function (response){
            setIsLoading(false)
            setHasError(false)
            if(response.data.length === 0)
                setHasMore(false)
            setOrderList([...orderList,...response.data])

        }).catch(function(error){
        
            setIsLoading(false)
            setHasError(true)
            

        })
        
    },[page])
    return (
        <div>
           {
           isLoading?
           <div>
            {/* <center><img style={{marginTop:"35vh"}} width='200px' height="130px" src="/loading.svg" alt="loading"/>
           <Typography style={{transform:"translateY(-40px)"}}>
               Getting your Orders ..
           </Typography>
           </center> */}
           <Typography variant="h5" style={{color:(theme.palette.type === 'dark')?"#9FA8DA":"rgb(63,81,181)", marginTop:"18px", marginLeft:"8px", marginBottom:"8px"}}>
                           Your Orders
                       </Typography>

                    <div style={{height:"82vh", borderRadius:"18px", overflow:"hidden"}}>
                       <Grid container spacing={3}>
                            {[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}].map((placeHolder, index) =>
                                <Grid item xs={12} md={4} sm={6} key={index} >
                                    <ReactPlaceholder style={{ borderRadius: "18px", width: "100%", height: "100px" }} type="rect" ready={false} showLoadingAnimation={true} color={(theme.palette.type === 'dark')?"#424242":'rgba(63,81,181,0.3)'} />


                                </Grid>
                            )}
                        </Grid>
                    </div>
           </div>
           :
           <div>
               {
                   (hasError || orderList.length === 0)? <div>
                       <center style={{marginTop:"30vh"}}>
                   
                   <img  width='200px' height="130px" src="/order.svg" alt="loading"/>
                   <Typography  variant='h5'>
                        No orders to show
                   </Typography>
                   <br></br>
                   <Button variant='outlined' style={{ color:(theme.palette.type === 'dark')?"#9FA8DA":"rgb(63,81,181)"}} onClick={()=> history.replace('home') }>
                       Order Now
                   </Button>
                   
                   </center>
                   </div>:
                   <div>
                       <Typography variant="h5" style={{color:(theme.palette.type === 'dark')?"#9FA8DA":"rgb(63,81,181)", marginTop:"18px", marginLeft:"8px", marginBottom:"8px"}}>
                           Your Orders
                       </Typography>
                    
               <Grid container spacing={3}>
                   {orderList.map((item,index)=>
                   <Grid item md={4} sm={6} xs={12} key={index}>
                        <CardActionArea onClick={() => history.push(`orderdetail?order_id=${item.order_id}`)} style={{borderRadius:"18px"}} className="hoverCard" >
                       <Card style={{borderRadius:"18px", height:"100px", padding:"16px"}}>
                      
                       <Grid container spacing={0}>
                
                <Grid item xs={6}>
                    <Typography style={{color: (theme.palette.type ==='dark')?"#dee2e6":"#6c757d"}}>
                        🍽&nbsp;Restaurant
                    </Typography>

                </Grid>
                <Grid item xs={6}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <Typography variant='body2' style={{transform:"translateY(20%)" }}>
                        {item.restaurant_name}
                </Typography>
                </div>

                </Grid>
               
            </Grid>

            <Grid container spacing={0}>
                
                <Grid item xs={6}>
                    <Typography style={{color: (theme.palette.type ==='dark')?"#dee2e6":"#6c757d"}}>
                        📦&nbsp;Status
                    </Typography>

                </Grid>
                <Grid item xs={6}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <Typography variant='body2' style={{transform:"translateY(20%)",color:(item.order_status === 'Order Cancelled')?(theme.palette.type ==='dark')?"#f07167":"#e63946":(theme.palette.type ==='dark')?'#fff':'#000' }}>
                        {item.order_status}
                </Typography>
                </div>

                </Grid>
               
            </Grid>

            <Grid container spacing={0}>
                
                <Grid item xs={6}>
                    <Typography style={{color: (theme.palette.type ==='dark')?"#dee2e6":"#6c757d"}}>
                    📅&nbsp;Ordered on
                    </Typography>

                </Grid>
                <Grid item xs={6}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <Typography variant='body2' style={{transform:"translateY(20%)" }}>
                {(new Date(item.time)).toDateString()}
                </Typography>
                </div>

                </Grid>
               
            </Grid>
            
                       </Card>
                       </CardActionArea>
                       </Grid>
                   )
                   
                   }
                   
                  
                   

                   </Grid>
                   <Button disabled={!hasMore} onClick={updatePage} fullWidth variant="outlined" style={{marginTop:"18px",marginBottom:"18px",borderRadius:"12px"}}>
                       Load more
                   </Button>
                   </div>

             
               }
               
               
           </div>
           }
        </div>
    )
}
