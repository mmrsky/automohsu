const axios = require('axios');
const mqtt = require('mqtt');


const mqtt_client = mqtt.connect('wss://mqtt-worker.herokuapp.com');
mqtt_client.on('connect', () => {
    console.log('connected to mqtt broker');
    main_loop();
});

const main_loop = () => {
    setTimeout(() => {

    let start_time_stamp = new Date();
    axios.get('https://fanuc-robot-http-server.herokuapp.com/')
    .then((res) => {
        const time_stamp = new Date();
        const delta = time_stamp - start_time_stamp;
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
        let data = {
            time: time_stamp,
            joints: joints
            };
        mqtt_client.publish('joints', JSON.stringify(data));
        main_loop();
    });
},100);
}
