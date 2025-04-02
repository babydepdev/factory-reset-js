const { exec } = require('child_process');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const portPath = '/dev/ttyACM0';
const baudRate = 9600;

let port;
try {
    port = new SerialPort(portPath, { baudRate }, (err) => {
        if (err) {
            console.error(`❌ Serial Port Error: ${err.message}`);
            console.log('⚠️  Continuing without serial connection...');
        }
    });
} catch (error) {
    console.error(`❌ Failed to initialize serial port: ${error.message}`);
    console.log('⚠️  Continuing without serial connection...');
    port = null;
}

if (port) {
    const parser = port.pipe(new Readline({ delimiter: '\n' }));

    parser.on('data', (data) => {
        if (parseInt(data) === 1) {
            console.log('🚨 Reboot Triggered!');
            rebootSystem();
        } else {
            console.log('❌ Invalid Data');
        }
    });

    port.on('open', () => console.log('✅ Serial Port Opened'));
    port.on('error', (err) => console.error('❌ Serial Port Error:', err));
} else {
    console.log('⚠️  Serial port not available, running in fallback mode.');
}

function rebootSystem() {
    console.log('⚠️  Rebooting Ubuntu 24...');

    exec('sudo reboot', (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️  Warning: ${stderr}`);
            return;
        }
        console.log(`✅ Success: ${stdout}`);
    });
}
