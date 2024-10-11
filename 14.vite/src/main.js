import {render} from './renderModule.js';
render();
window.hostModulesMap = new Map();
var ownPath = '/src/main.js';
import.meta.hot = {
  accept(deps,callback){
    const ownmodule = hostModulesMap.get(ownPath) || {
      id:ownPath,
      callbacks:[]
    }
 
    ownmodule.callbacks.push({
      deps,
      callback
    });
 
    hostModulesMap.set(ownPath,ownmodule);
  }
}

if(import.meta.hot){
  import.meta.hot.accept(['./renderModule.js'],([renderModule])=>{
    renderModule.render();
  }) 
}


