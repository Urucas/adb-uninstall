import inquirer from 'inquirer';
import ADB from 'adbjs';
import lo from 'lodash';

let helper = {
  adb : new ADB(),
  deviceInfo2Phrase: (info) => {
    return [info.model, "-", info.version, "(id:", info.id, ")"].join(" "); 
  },
  get_packages : (device) => {
    let packages = helper.adb.listPackages(device);
    packages = lo.sortBy(packages, (key) => { return key });
    return packages
  },
  error : (msg) => {
    process.exit(0);
  },
  ask_device : () => {
    let devices = {};
    let choices = [];
    
    let devs = helper.adb.devices();
    if(!devs.length) error("No devices available!");
    
    for(let i=0; i<devs.length;i++) {
      let id = devs[i].id;
      try { 
        let info = helper.adb.deviceInfo(id);
        devices[id] = info; 
        choices.push({name:helper.deviceInfo2Phrase(info), value:id});
      }catch(e){}
    }
    let device_prompt = {
      type: "list", 
      name: "device",
      message: "Choose an Android device",
      choices: choices
    }
    inquirer.prompt(device_prompt, (answer) => {
      let id = answer.device;
      helper.ask_package(id);
    });
  },
  ask_package: (device) => {
    let packages_prompt = {
      type: "list", 
      name: "pkg",
      message: "Choose a package to uninstall",
      choices: helper.get_packages(device)
    }
    inquirer.prompt(packages_prompt, (answer) => {
      let pkg = answer.pkg;
      helper.adb.promptUninstall(pkg);
    });
  },
  uninstall: _ => {
    helper.ask_device();
  }
}

export { helper }
export default function(){ helper.uninstall() } 
