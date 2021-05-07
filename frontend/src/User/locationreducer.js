export const locationinitialState = {"hasaddress":true,"gpsaddress":{"lat":25.7523712,"long":82.6867712,"address":{"houseNumber":"","houseName":"","poi":"Galaxy Medical Store","poi_dist":"83","street":"Nawab Yousuf Road","street_dist":"91","subSubLocality":"","subLocality":"","locality":"Rizwikhan","village":"","district":"Jaunpur District","subDistrict":"Jaunpur","city":"Jaunpur","state":"Uttar Pradesh","pincode":"222001","lat":"25.7523712","lng":"82.6867712","area":"India","formatted_address":"Nawab Yousuf Road, Rizwikhan, Jaunpur, Uttar Pradesh. 83 m from Galaxy Medical Store pin-222001 (India)"}},"currentaddress":{"lat":25.7523712,"long":82.6867712,"address":{"houseNumber":"","houseName":"","poi":"Galaxy Medical Store","poi_dist":"83","street":"Nawab Yousuf Road","street_dist":"91","subSubLocality":"","subLocality":"","locality":"Rizwikhan","village":"","district":"Jaunpur District","subDistrict":"Jaunpur","city":"Jaunpur","state":"Uttar Pradesh","pincode":"222001","lat":"25.7523712","lng":"82.6867712","area":"India","formatted_address":"Nawab Yousuf Road, Rizwikhan, Jaunpur, Uttar Pradesh. 83 m from Galaxy Medical Store pin-222001 (India)"}}}

//export const locationinitialState = {hasaddress:false}
const locationreducer = (state, action) => {
    switch (action.type) {
        case 'ADDLOCATION':
            return action.item;
        default:
            return state;

    }
}


export default locationreducer
