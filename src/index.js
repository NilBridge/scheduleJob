
//LiteXLoader Dev Helper
/// <reference path="c:\Users\amsq\.vscode\extensions\moxicat.lxldevhelper-0.1.8/Library/JS/Api.js" /> 

const schedule = require('node-schedule');
const JSON5 = require('json5');
var colors = require('colors');
const fs = require('./file');

if(fs.exists('./plugins/schedulejob') == false){
    fs.mkdir('./plugins/schedulejob');
    fs.WriteTo('./plugins/schedulejob/start.json',JSON5.stringify({}));
}

function run(name,jobs){
    for(let index in jobs){
        let item = jobs[index];
        try{
            switch(item.type){
                case 'cmd':
                    mc.runcmd(item.cmd);
                    break;
                case 'bc':
                    mc.broadcast(item.text);
                    break;
                default:
                    throw new Error('没有这样的type -> '+item.type);
                    break;
            }
        }catch(err){
            log(`执行 ${name} - 第${index}条`,`任务时出错!!`.red);
            console.log(err);
        }
    }
}

let all_plugins;
const all_job = new Map();

function load(job){
    for(let i in job){
        log('启动 ',i.green,' 中……');
        let action = job[i].actions;
        if(job[i].use){
            if(all_plugins.includes(job[i].use) == false){
                logger.warn(`无法在插件列表中找到 [${job[i].use}] 插件， 任务 ${i.green} 启动失败`);
                continue;
            }
        }
        let j = schedule.scheduleJob(job[i].cron,()=>{
            log(i.green,' 执行中');
            run(i,action);
        });
        all_job.set(i,j);
        log(i.green,' 已启动');
    }
}



mc.listen("onServerStarted",()=>{
    let all = fs.getFilesList('./plugins/schedulejob/');
    all_plugins = ll.listPlugins();
    for(let _file in all){
        try{
            if(!_file.endsWith('.json'))return;
            log('正在加载 '+_file.green);
            let content = fs.readFrom('./plugins/schedulejob/'+_file);
            let obj = JSON5.parse(content);
            load(obj);
        }catch(err){
            console.log(err);
            log('文件 ',_file,' 加载失败！！'.red);
        }
    }
});

mc.listen('onConsoleCmd',((cmd)=>{
    if(cmd.toLowerCase() == 'stop'){
        log('清除所有任务...');
        all_job.forEach((v,k)=>{
            v.cancel();
        })
    }
}))