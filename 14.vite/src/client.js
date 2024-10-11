
console.log(`[vite] connecting.....`)


var socket = new WebSocket(`ws://${window.location.host}`,'vite-hmr');


socket.addEventListener('message',async ({data})=>{

  await handleMessage(JSON.parse(data))
   
})


async function handleMessage(payload){
    switch(payload.type){
      case 'connected':
      console.log(`[vite] connected`)  
      break;
      case 'update':
         console.log(payload)
        payload.updtates.forEach(async (update)=>{
           if(update.type === 'js-update'){
              await fetchUpdate(update)
           }
        })
      }
}

async function fetchUpdate({path,acceptedPath}){
   const module = window.hostModulesMap.get(path);
   if(!module){
      return;
   }
   const moduleMap = new Map()
   const modulesToUpdate = new Set()
   for(const {deps,callback} of module.callbacks){
      deps.forEach((dep)=>{
         if(acceptedPath === dep){
            modulesToUpdate.add(dep);
         }
      })
   }
   await Promise.all(Array.from(modulesToUpdate).map(async dep =>{
      const newModule = await import(dep + '?ts' + Date.now());
      moduleMap.set(dep,newModule);
   }))

   for(const {deps,callback} of module.callbacks){
      callback(deps.map(dep=> moduleMap.get(dep)));
   }

   const logged = `${acceptedPath} via ${path}`;

   console.log(`[vite] hot update ${logged}`);
}