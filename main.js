const { exec } = require('child_process');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const portPath = '/dev/ttyACM0';
const baudRate = 9600;
let port;
let parser;

function connectSerial() {
    try {
        port = new SerialPort(portPath, { baudRate }, (err) => {
            if (err) {
                console.error(`⚠️ Serial Port Error: ${err.message}`);
                console.log('⏳ Retrying connection in 5 seconds...');
                setTimeout(connectSerial, 5000);
            } else {
                console.log('✅ Serial Port Opened');
                setupParser();
            }
        });
    } catch (error) {
        console.error(`❌ Failed to initialize serial port: ${error.message}`);
        console.log('⏳ Retrying connection in 5 seconds...');
        setTimeout(connectSerial, 5000);
    }
}

function setupParser() {
    parser = port.pipe(new Readline({ delimiter: '\n' }));

    parser.on('data', (data) => {
        if (parseInt(data) === 1) {
            console.log('🚨 Reboot Triggered!');
            rebootSystem();
        } else {
            console.log('❌ Invalid Data');
        }
    });

    port.on('error', (err) => {
        console.error('❌ Serial Port Error:', err);
        console.log('🔄 Reconnecting...');
        setTimeout(connectSerial, 5000);
    });
}

function rebootSystem() {
    console.log('⚠️ Rebooting Ubuntu 24...');
    exec('sudo reboot', (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️ Warning: ${stderr}`);
            return;
        }
        console.log(`✅ Success: ${stdout}`);
    });
}

// Start connection attempt
connectSerial();
console.log('🚀 Program is running. Waiting for Serial Device...');
