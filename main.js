const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const port = new SerialPort('/dev/ttyACM0', {
    baudRate: 9600,
});

const parser = port.pipe(new Readline({ delimiter: '\n' }));

parser.on('data', (data) => {
    if (data === 1) { 
        console.log('✅ Factory Reset Successful');
        process.exit(0);
    } else {
        console.log('❌ Factory Reset Failed');
        process.exit(1);
    }
});

port.on('open', () => {
    console.log('Serial Port Opened');
});

port.on('error', (err) => {
    console.error('❌ Serial Port Error:', err);
});