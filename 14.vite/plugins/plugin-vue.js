const { 
    parse ,
    compileScript,
    rewriteDefault, 
    compileTemplate,
    compileStyleAsync
  } = require("vue/compiler-sfc")
const fs = require('fs-extra')
const descriptorCache = new Map()
const has = require('hash-sum')

function vue(){
  let root;
  return {
    name:'vue',
   async config(config){ 
      root = config.root
      return{
        define:{
          __VUE_OPTIONS_API__:true,
          __VUE_PROD_DEVTOOLS__:false,
          __VUE_PROD_HYDRATION_MISMATCH_DETAILS__:false
        }
      }
    },
    async transform(code,id){
      const {filename,query} = parseVueRequest(id)

      if(filename.endsWith('.vue')){
        if(query.get('type') === 'style'){
          const descriptor = await getDescriptor(filename)
          let result = await transformStyle(code,descriptor,Number(query.get('index')))
          return result
        }else{
          return await transformMain(code,filename)
        }
     }
      return null
    },
    async load(id){
        const {filename,query}  = parseVueRequest(id)
        if(query.has('vue')){
          const descriptor = await getDescriptor(filename)
          if(query.get('type') === 'style'){
            let styleBlock = descriptor.styles[Number(query.get('index'))]
            if(styleBlock){
               return {code:styleBlock.content}
            }
          }
        }
     }
  }
}

async function transformStyle(code,descriptor,index){
   const styleBlock = descriptor.styles[index]
   const result = await compileStyleAsync({
     filename:descriptor.filename,
     source:code,
     id:`data-v-${descriptor.id}`,
     scoped:styleBlock.scoped
   })
   let styleCode = result.code
  
   return{
     code:`
     var style = document.createElement('style');
     style.innerHTML = ${JSON.stringify(styleCode)};
     document.head.appendChild(style);
   `
   }
} 

async function transformMain(source,filename){
 const descriptor = await getDescriptor(filename)
 const scriptCode = genScriptCode(descriptor,filename)
 const templateCode = genTemplateCode(descriptor,filename)
 const styleCode = genStyleCode(descriptor,filename)

  let code = [
    styleCode,
    scriptCode,
    templateCode,
      '_sfc_main.render = render;',
      'export default _sfc_main;',
   ].join('\n');

   return {code}
 
}

function genStyleCode(descriptor,filename){
  let styleCode = ''
  if(descriptor.styles.length>0){
    descriptor.styles.forEach((style,index) => {
      const query = `?vue&type=style&index=${index}&lang.css`;
      const styleRequest = (filename + query).replace(/\\/g,'/');
      styleCode += `\nimport "${styleRequest}"`;
    });
    return styleCode;
  }
}

function genTemplateCode(descriptor,id){
   const content = descriptor.template.content
   const result = compileTemplate({source:content,id})
   return result.code
}

function  genScriptCode(descriptor,id) {
   const script = compileScript(descriptor,{id})

   return rewriteDefault(script.content,'_sfc_main')
} 

async function getDescriptor(filename){

  let descriptor = descriptorCache.get(filename)

  if(descriptor) return descriptor

   const content = await fs.readFile(filename,'utf8')

   const result = parse(content,{filename})

   descriptor = result.descriptor

   descriptor.id = has(filename)

   descriptorCache.set(filename,descriptor)

   return descriptor
}

function parseVueRequest(id){
   const [filename,querystring = ''] = id.split('?');

   let query = new URLSearchParams(querystring);

   return {query,filename};
}

module.exports = vue



