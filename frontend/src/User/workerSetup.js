import axios from 'axios'
const publicVapidkey="BCeTHaAuVH4EdRA8dbrbdv9xR0NqwA6EBReXEeCdMzSOgZLL7L8mGnzgDJBxj_tqA2n7Q3-Rth1iTbWqQJNGYbg";
const send = async(state) => {

  await navigator.serviceWorker.register('/worker.js',{
      scope: '/'
  });

  return navigator.serviceWorker.ready
    .then(async(serviceWorker)=>{
      return await serviceWorker.pushManager.subscribe ({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidkey)
    });
    })

    .then((pushSubscription)=>{
        axios.post('http://192.168.29.82:3001/api/user/addEndpoint',pushSubscription,{
          headers: {
              'auth-token': state.token
          }
      }).then(()=>{}).catch(()=>{})

        // await fetch('http://192.168.29.82:3001/subscribe',{
        //     method:'POST',
        //     body:JSON.stringify(pushSubscription),
        //     headers:{
        //         'content-type':'application/json'
        //     }
        // });
    });
  
}




function urlBase64ToUint8Array(base64String){
    const padding ='='.repeat((4-base64String.length%4)%4);
    const base64=(base64String + padding)
    .replace(/\-/g,'+')
    .replace(/_/g,'/');
  
    const rawData=window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for(let i=0;i<rawData.length;++i)
    {
        outputArray[i]=rawData.charCodeAt(i);
    }
    return outputArray;
  
  
  }

  //register service worker
export default function registerWorker(state){
    
    if('serviceWorker' in navigator){
        send(state).catch(err=>console.error(err));
      }

}
  


