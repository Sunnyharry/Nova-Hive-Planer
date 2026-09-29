import fs from 'node:fs';
const scripts=[];
let html=fs.readFileSync('dist/index.html','utf8');
html=html.replace(/<link rel="stylesheet" href="([^"]+)">/g,(_,file)=>'<style>'+fs.readFileSync('dist/'+file,'utf8')+'</style>');
html=html.replace(/<script src="([^"]+)" defer><\/script>/g,(_,file)=>{scripts.push('<script>'+fs.readFileSync('dist/'+file,'utf8').replace(/<\/script/gi,'<\\/script')+'</script>');return '';});
html=html.replace('</body>',scripts.join('\n')+'\n</body>');
fs.writeFileSync('nova-hive-planner.html',html);
console.log('Built standalone planner from dist sources.');
