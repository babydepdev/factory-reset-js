const { exec } = require('child_process');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const portPath = '/dev/ttyACM0';
const baudRate = 9600;
let port;
let parser;

function connectSerial() {
    console.log('Attempting to connect to serial port...');
    port = new SerialPort(portPath, { baudRate, autoOpen: false });

    port.open((err) => {
        if (err) {
            console.error(`Serial Port Error: ${err.message}`);
            console.log('Retrying connection in 5 seconds...');
            setTimeout(connectSerial, 5000);
        } else {
            console.log('Serial Port Opened');
            setupParser();
        }
    });

    port.on('close', () => {
        console.log('Serial Port Closed. Reconnecting...');
        setTimeout(connectSerial, 5000);
    });

    port.on('error', (err) => {
        console.error(`Serial Port Error: ${err.message}`);
        console.log('Reconnecting in 5 seconds...');
        setTimeout(connectSerial, 5000);
    });
}

function setupParser() {
    parser = port.pipe(new Readline({ delimiter: '\n' }));

    parser.on('data', (data) => {
        if (parseInt(data) === 1) {
            controlSystem();
        } else {
            console.log('Invalid Data:', data);
        }
    });
}

function controlSystem() {
    exec('ls', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Warning: ${stderr}`);
            return;
        }
        console.log(`Success: ${stdout}`);
    });
}

connectSerial();