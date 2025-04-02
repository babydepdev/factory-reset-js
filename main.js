const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const port = new SerialPort('/dev/ttyACM0', {
    baudRate: 9600,
});

const parser = port.pipe(new Readline({ delimiter: '\n' }));

parser.on('data', (data) => {
    console.log(`📥 Arduino says: ${data}`);
});

port.on('open', () => {
    console.log('✅ Serial Port Opened');
});

port.on('error', (err) => {
    console.error('❌ Serial Port Error:', err);
});