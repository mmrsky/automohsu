const axios = require('axios');



function LueRobo(delta){
axios.get('https://fanuc-robot-http-server.herokuapp.com/')
.then((res) => {
    //console.log(res);
    const regexp = /Joint.*\:\s*([-|\d].*)/gi;
    let joints = [];
    let matches = res.data.matchAll(regexp);
    let count = 0;
    for (const match of matches) {
        count++;
        
        if (count > 6) break;
            const value = parseFloat(match[1]);
            joints.push(value);

    }

    console.log(Date() + "  " + joints + "  " + delta + " ms");
});
    return
}
start_time_stamp = new Date();
const main_loop = () => {
    
    setTimeout(() => {
        //Koodi
        
        const time_stamp = new Date();
        const delta = time_stamp - start_time_stamp;
        LueRobo(delta);
        main_loop();
    }, 1000);
}
main_loop();