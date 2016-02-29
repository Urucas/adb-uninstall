import inquirer from 'inquirer';
import ADB from 'adbjs';

export default function uninstall() {
  
  let adb = new ADB();
  
  let error = (msg) => {
    console.log(msg);
    process.exit(0);
  }
  
  let deviceInfo2Phrase = (info) => {
    return [info.model, "-", info.version, "(id:", info.id, ")"].join(" "); 
  }
  
  let ask_device = () => {
       
    let devices = {};
    let choices = [];
    
    let devs = adb.devices();
    if(!devs.length) error("No devices available!");
    
    for(let i=0; i<devs.length;i++) {
      let id = devs[i].id;
      try { 
        let info = adb.deviceInfo(id);
        devices[id] = info; 
        choices.push({name:deviceInfo2Phrase(info), value:id});
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
      ask_package(id);
    });
  }
  
  let ask_package = (device) => {

    let packages = adb.listPackages(device);
    let packages_prompt = {
      type: "list", 
      name: "pkg",
      message: "Choose a package to uninstall",
      choices: packages
    }
    inquirer.prompt(packages_prompt, (answer) => {
      let pkg = answer.pkg;
      adb.promptUninstall(pkg);
    });
  }

  ask_device();
}
