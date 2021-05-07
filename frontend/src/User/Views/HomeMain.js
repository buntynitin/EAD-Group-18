import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Grid, Card, CardActionArea, Typography, Divider} from '@material-ui/core'
import ReactPlaceholder from 'react-placeholder';
import SearchBar from "material-ui-search-bar";
import { useHistory } from "react-router-dom";
import { useStateValue } from '../LocationStateProvider';
import Dialog from '@material-ui/core/Dialog';
import {useTheme} from '@material-ui/core/styles'
import StarIcon from '@material-ui/icons/Star';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FoodItem from '../constants/FoodItem'
import { encryption, decryption } from '../../Utility/Security'
const placeHolders = [{},{},{},{},{},{}] 
function HomeMain({ update }) {
    const history = useHistory();
    const [state] = useStateValue()
    const theme = useTheme()
    const [allrestaurantList, setAllRestaurantList] = useState([])
    const [restaurantList, setRestaurantList] = useState([])
    const [isLoading,setIsLoading] = useState(true)
    const [query,setQuery] = useState('')
    const [open, setOpen] = useState(false)
    const [foodQuery, setFoodQuery] = useState('')
    const [restaurantByFoodList, setRestaurantByFoodList] = useState([])
    const [isGetting, setIsGetting] = useState(false)
   


    const handleClose = () => {
        setOpen(false)
      };


   
    
      const handleListItemClick = (value) => {
        
        setOpen(true)
        setRestaurantByFoodList([])
        setFoodQuery(value)
        setIsGetting(true)
        
        const interval = setInterval(() => { 
        
            axios.post('http://192.168.29.82:3001/api/restaurant/getRestaurantByFood',{ reqbody :
            encryption(JSON.stringify({
                food_name : value,
                latitude : state.currentaddress.lat,
                longitude : state.currentaddress.long
            })) })
            .then((res) => {
                setRestaurantByFoodList(JSON.parse(decryption(res.data.resbody)))
                setIsGetting(false)
            })
            .catch((err)=>{
                setIsGetting(false)
            })
            clearInterval(interval)
        },0)
        
      };


    useEffect(() => {
        setQuery('')
        axios.get(`http://192.168.29.82:3001/api/restaurant/restaurantList?latitude=${state.currentaddress.lat}&longitude=${state.currentaddress.long}`)
            .then(function (response) {
                setRestaurantList(response.data)
                setAllRestaurantList(response.data)
                setIsLoading(false)
            }).catch(function (error) {
                setIsLoading(false)
            })
    },[update])

    const tagFilter = (arr,query)=>{
        var i=0
        for (;i<arr.length;i++)
        {
            
            if(arr[i].label.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, '')))
                 return true

        }
        return false
    }


    const handleSearch = (str) =>{
      
        
            var i = 0
            var newlist = []
            for(;i<allrestaurantList.length;i++)
               {   
               
                   if((allrestaurantList[i].restaurantname.toLowerCase().replace(/\s+/g, '').includes(str.toLowerCase().replace(/\s+/g, '')))||
                       tagFilter(allrestaurantList[i].tags,str)   )
                    newlist = [...newlist, allrestaurantList[i]]
               }
            setRestaurantList(newlist)
           
        
    }

    const isOpened = (t1,t2) =>{
        var hours = (new Date()).getHours().toString()
        if(hours.length === 1)
            hours = "0".concat(hours);
        var mins = (new Date()).getMinutes().toString()

       return ((`${hours}:${mins}` >= t1)&&(`${hours}:${mins}` <= t2))
        
       

    }
    return (
        <div>
   
            
            <div style={{marginTop:"16px"}}/>




            <Typography
                variant="h5"
                style={{ color:(theme.palette.type === 'dark')?"#e26d5c":"rgb(226,55,68)" }}
            >
                &nbsp; Foods
        </Typography>

        <Typography
                variant="subtitle1"
                style={{color:(theme.palette.type === 'dark')?"#9FA8DA":"rgb(63,81,181)"}}
            >&nbsp;&nbsp;Trending near you</Typography>

        <center>
        <Grid container>
    
        {
            FoodItem.map((item,index)=>
          <Grid item xs key={index}>
           
            <Card style={{borderRadius:"18px", width:"100px", margin:"8px",display:"inline-block"}} className="hoverCard">
            <CardActionArea onClick={()=>handleListItemClick(item.name)}>
                <img alt="" draggable={false} src={item.image_url} />
                <center><Typography variant="body2">
                    {item.name}
                    </Typography></center>
                    </CardActionArea>
            </Card>
            </Grid>
           
            )
        }
        </Grid>
        </center>




       






      

        
        {/* <Button onClick={()=>handleListItemClick("Sandwich")}>
            Sandwich
        </Button>
        <Button onClick={()=>handleListItemClick("Burger")}>
            Burger
        </Button>
        <Button onClick={()=>handleListItemClick("Pizza")}>
            Pizza
        </Button> */}





            <Divider style={{margin:"18px"}} />



     

            <Typography
                variant="h5"
                style={{ color:(theme.palette.type === 'dark')?"#e26d5c":"rgb(226,55,68)" }}
            >
                &nbsp; Marketplace
        </Typography>
            <Typography
                variant="subtitle1"
                style={{color:(theme.palette.type === 'dark')?"#9FA8DA":"rgb(63,81,181)"}}
            >
                &nbsp;&nbsp; {isLoading? "Getting":restaurantList.length} restaurant{restaurantList.length===1?"":"s"} around you{isLoading? " ..":""}

        </Typography>


     
        <SearchBar
            style={{borderRadius:"18px",marginTop:"8px"}}
            value={query}
            
            onChange={(val) => {
                setQuery(val)
                handleSearch(val)
            }
            }
            onCancelSearch={() => {setQuery('')
                    setRestaurantList(allrestaurantList)
            }}
            // onRequestSearch={handleSearch}
            placeholder="Restaurant name or a cuisine .."
            />

        <div style={{marginBottom:"8px",marginTop:"16px"}}/>
            <Grid container spacing={3}>
                {isLoading?placeHolders.map((placeHolder,index) =>
                        <Grid item xs={12} md={4} sm={6} key={index} >
                            <ReactPlaceholder style={{borderRadius:"18px",width:"100%",height:"215px"}} type="rect" ready={false} showLoadingAnimation={true} color={theme.palette.type === 'dark' ?"#424242":"rgba(63,81,181,0.3)"}>
                            
                            </ReactPlaceholder>
                            </Grid>
                )
                            :

               
                    (restaurantList).map((item, index) =>
                        <Grid item xs={12} md={4} sm={6} key={index} >
                            <Card className="hoverCard" style={{ borderRadius: "18px" }}>
                           { item.average_rating &&
                            <div style={{position:'absolute',display:"flex",flexDirection:"row",zIndex:1, background:"rgba(0,0,0,0.5)",borderTopLeftRadius:"18px",borderBottomRightRadius:"18px",padding:"8px",alignItems:"center"}}>
                               
                                                       <StarIcon style={{color:"#faa307"}} />
                                                       &nbsp;
                                                 <Typography variant="body2" style={{color:"white"}}>
                                                    ({
                                                        (item.average_rating.toFixed(1))
                                                    }
                                                    /5.0)
                                                    </Typography>
                                                  

                            </div>
                                }

                           


                                <CardActionArea onClick={() => history.push(`restaurant?id=${item._id}`) }>

                                {
                            !isOpened(item.openingtime,item.closingtime) && 
                          
                                <div style={{width:"100%",height:"100%", position:"absolute",display:"flex",zIndex:1,justifyContent:"center"}}>
                                    
                                    <img alt="" draggable={false} width="100px" height="100px" src="/closed.svg" style={{marginTop:"25px"}}/>
                               

                                </div>
                              

                            }
                                  
                                    {/* {console.log(((`${(new Date()).getHours().toString()}:${(new Date()).getMinutes().toString()}` >= item.openingtime) &&
                                                (`${(new Date()).getHours().toString()}:${(new Date()).getMinutes().toString()}` <= item.closingtime)))} */}

                                
                                    
                                    {/* {console.log(item.openingtime)}
                                    {console.log(item.closingtime)}
                                    {console.log(`${(new Date()).getHours().toString()}:${(new Date()).getMinutes().toString()}`.length)} */}
                    
                                    <img style={{
                                        height: "150px", width: "100%", objectFit:"cover",filter:
                                            isOpened(item.openingtime,item.closingtime) ?
                                                "none" : "grayscale(100%)"
                                    }} src={item.image?item.image:"https://res.cloudinary.com/dez3yjolk/image/upload/v1606580112/fooditems/FoodAndDrinkDesign_1_yjvvep.svg"} alt="restaurant" draggable={false} />
                                    
                                    <div style={{ paddingBottom: "8px", paddingLeft: "8px", paddingRight: "8px" }}>
                                        
                                                <Typography variant="h6">
                                                    {item.restaurantname}
                                                   
                                                </Typography>
                                        
                                        <div style={{ flexDirection: "row", display: "flex" }}>
                                            {
                                                item.tags.slice(0, Math.min(3, item.tags.length)).map((tag, index) =>

                                                    <div key={tag.key}>
                                                        {
                                                            (index+1 === Math.min(3, item.tags.length)) ? <Typography variant="caption" style={{color:(theme.palette.type === 'dark')?'#dee2e6':'#495057'}}>{tag.label}</Typography> :
                                                                <Typography variant="caption" style={{color:(theme.palette.type === 'dark')?'#dee2e6':'#495057'}}>{tag.label + ' |'}&nbsp;</Typography>
                                                        }


                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    )
                    
                    
                }
            </Grid>


        <Dialog onClose={handleClose} open={open}>
        <div style={{width:"100%",height:"80vh",padding:"18px"}}>

                        <div style={{display:"flex",flexDirection:"row",color:(theme.palette.type === 'dark')?"#9FA8DA":"rgb(63,81,181)"}}>
                            <ArrowBackIcon onClick={handleClose}/>&nbsp;&nbsp;

        
                        {
                            foodQuery && <Typography style={{color:(theme.palette.type === 'dark')?"#9FA8DA":"rgb(63,81,181)"}}>
                            Restaurants serving <em>{foodQuery}</em>
                         </Typography>

                        }
                        </div>
                        <Divider style={{marginBottom:"16px",marginTop:"8px"}} />
        
         <Grid container spacing={2}>
                {isGetting?[{},{}].map((placeHolder,index) =>
                        <Grid item xs={12} key={index} >
                            <div>
                            <div>
                            <svg height="0px" width="100%">
                                
                                </svg>
                                </div>                              
                            <ReactPlaceholder style={{borderRadius:"18px",width:"100%",height:"215px"}} type="rect" ready={false} showLoadingAnimation={true} color={theme.palette.type === 'dark' ?"#616161":"rgba(63,81,181,0.3)"}>
                            
                            </ReactPlaceholder>
                            </div>
     
                 
                            </Grid>
                )
                            :

               
                    (restaurantByFoodList).map((item, index) =>
                  
                        
                        <Grid item xs={12} key={index} >
                            <Card className="hoverCard" style={{ borderRadius: "18px",backgroundColor:(theme.palette.type === 'dark')?"#616161":"#ffffff" }} >
                            { item.average_rating &&
                            <div style={{position:'absolute',display:"flex",flexDirection:"row",zIndex:1, background:"rgba(0,0,0,0.5)",borderTopLeftRadius:"18px",borderBottomRightRadius:"18px",padding:"8px",alignItems:"center"}}>
                               
                                                       <StarIcon style={{color:"#faa307"}} />
                                                       &nbsp;
                                                 <Typography variant="body2" style={{color:"white"}}>
                                                    ({
                                                        (item.average_rating.toFixed(1))
                                                    }
                                                    /5.0)
                                                    </Typography>
                                                  

                            </div>
                                }

                                <CardActionArea onClick={() => history.push(`restaurant?id=${item._id}`) }>

                                {
                            !isOpened(item.openingtime,item.closingtime) && 
                          
                                <div style={{width:"100%",height:"100%", position:"absolute",display:"flex",zIndex:1,justifyContent:"center"}}>
                                    
                                    <img alt="" draggable={false} width="100px" height="100px" src="/closed.svg" style={{marginTop:"25px"}}/>
                               

                                </div>
                              

                            }
                                  
                                    {/* {console.log(((`${(new Date()).getHours().toString()}:${(new Date()).getMinutes().toString()}` >= item.openingtime) &&
                                                (`${(new Date()).getHours().toString()}:${(new Date()).getMinutes().toString()}` <= item.closingtime)))} */}

                                
                                    
                                    {/* {console.log(item.openingtime)}
                                    {console.log(item.closingtime)}
                                    {console.log(`${(new Date()).getHours().toString()}:${(new Date()).getMinutes().toString()}`.length)} */}
                    
                                    <img style={{
                                        height: "150px", width: "100%", objectFit:"cover",filter:
                                            isOpened(item.openingtime,item.closingtime) ?
                                                "none" : "grayscale(100%)"
                                    }} src={item.image?item.image:"https://res.cloudinary.com/dez3yjolk/image/upload/v1606580112/fooditems/FoodAndDrinkDesign_1_yjvvep.svg"} alt="restaurant" draggable="false"/>
                                   
                                    <div style={{ paddingBottom: "8px", paddingLeft: "8px", paddingRight: "8px" }}>
                                      
                                                <Typography variant="h6">
                                                    {item.restaurantname}
                                                   
                                                </Typography>
                                            
                                        <div style={{ flexDirection: "row", display: "flex" }}>
                                            {
                                                item.tags.slice(0, Math.min(3, item.tags.length)).map((tag, index) =>

                                                    <div key={tag.key}>
                                                        {
                                                            (index+1 === Math.min(3, item.tags.length)) ? <Typography variant="caption" style={{color:(theme.palette.type === 'dark')?'#dee2e6':'#495057'}}>{tag.label}</Typography> :
                                                                <Typography variant="caption" style={{color:(theme.palette.type === 'dark')?'#dee2e6':'#495057'}}>{tag.label + ' |'}&nbsp;</Typography>
                                                        }


                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </CardActionArea>
                            </Card>
                        </Grid>
                  
                    )
                    
                    
                }
            </Grid>
            {
                (!isGetting && restaurantByFoodList.length === 0) && 
               
                    
                            <div style={{marginTop:"20vh"}}>
                            <img src="/norestaurant.svg" width="100%" height="100px" alt="" draggable={false}/>&nbsp;
                            <center>
                            <Typography variant="h6" style={{color:(theme.palette.type === 'dark')?"#9FA8DA":"rgb(63,81,181)"}}>
                                No Restaurant near you
                            </Typography>
                            </center>
                            {/* <svg height="0px" width="100%">
                                
                                </svg> */}

                                </div>                              
                           
     
                 
                    
                    

            }
            </div>
        </Dialog>

        </div>
    )
}

export default HomeMain
