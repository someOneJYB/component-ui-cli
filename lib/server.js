const fs = require('fs');
const inquirer = require('inquirer');
const shell = require('child_process');
const cwd = process.cwd();

const js = `import React from 'react'
import { render } from 'react-dom'

import Comp from '../components/PLACE'

const elRoot = document.getElementById('app');

const renderD = Component => {
    render(
    <Component/>, elRoot
)
};
if(module.hot) {
    renderD(Comp);
}
`
inquirer.prompt([
    {
        type: 'input',
        name: 'card',
        message: '输出测试组件库文件名',
        default: true
    }
]).then((answers) => {
    let card = answers.card
    const Card = card[0].toUpperCase() + card.slice(1).toLowerCase();
    fs.writeFileSync(cwd + '/public/index.js', js.replace('PLACE', Card));
    shell.exec('npm run dev',function (error) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
})