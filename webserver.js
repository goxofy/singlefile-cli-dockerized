const express = require('express');
const { spawn } = require('child_process');
const app = express();

// 配置常量
const SINGLEFILE_EXECUTABLE = '/usr/src/app/node_modules/.bin/single-file';
const BROWSER_PATH = '/usr/bin/chromium-browser';
const BROWSER_ARGS = '["--no-sandbox"]';

// 配置中间件来解析 form 数据
app.use(express.urlencoded({ extended: true }));

app.post('/', (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(500).send('Error: url parameter not found.');
    }

    const singlefile = spawn(SINGLEFILE_EXECUTABLE, [
        `--browser-executable-path=${BROWSER_PATH}`,
        `--browser-args='${BROWSER_ARGS}'`,
        url,
        '--dump-content'
    ]);

    let output = '';

    singlefile.stdout.on('data', (data) => {
        output += data.toString();
    });

    singlefile.on('close', () => {
        res.setHeader('Content-Type', 'text/html');
        res.send(output);
    });

    singlefile.on('error', (error) => {
        res.status(500).send(`Error executing single-file: ${error.message}`);
    });
});

app.listen(6880, '0.0.0.0', () => {
    console.log('Server running on port 6880');
}); 
