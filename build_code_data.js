const fs = require('fs');
const path = require('path');

const basePath = 'e:\\Proyectos\\ACC\\imagenes';
const codePath = 'e:\\Proyectos\\ACC\\code.html';
let codeContent = fs.readFileSync(codePath, 'utf8');

let proyectos = [];
let promociones = [];

function processCategory(dirName, category) {
    const dirPath = path.join(basePath, dirName);
    if (!fs.existsSync(dirPath)) return;
    const subDirs = fs.readdirSync(dirPath);
    
    subDirs.forEach(subDir => {
        const fullPath = path.join(dirPath, subDir);
        if (fs.statSync(fullPath).isDirectory()) {
            const files = fs.readdirSync(fullPath).filter(f => /\.(jpg|jpeg|png|gif|jfif)$/i.test(f));
            if (files.length > 0) {
                const title = subDir.replace(/^\d+\.\d+\.?\s*/, '');
                proyectos.push({
                    title: title,
                    category: category,
                    location: 'Ceuta',
                    desc: 'Proyecto ' + title,
                    img: `imagenes/${dirName}/${subDir}/${files[0]}`
                });
            }
        }
    });
}

function processPromotions(dirName) {
    const dirPath = path.join(basePath, dirName);
    if (!fs.existsSync(dirPath)) return;
    const subDirs = fs.readdirSync(dirPath);
    
    subDirs.forEach((subDir, index) => {
        const fullPath = path.join(dirPath, subDir);
        if (fs.statSync(fullPath).isDirectory()) {
            const files = fs.readdirSync(fullPath).filter(f => /\.(jpg|jpeg|png|gif|jfif)$/i.test(f));
            if (files.length > 0) {
                const title = subDir.replace(/^\d+\.\d+\.?\s*/, '');
                promociones.push({
                    title: title,
                    location: 'Ceuta',
                    price: 'Consultar',
                    img: `imagenes/${dirName}/${subDir}/${files[0]}`,
                    tags: { label: index === 0 ? 'En Venta' : 'Próximamente', color: index === 0 ? 'green' : 'blue' },
                    specs: { bed: 3, bath: 2, size: '100m²' }
                });
            }
        }
    });
}

processCategory('2_OBRA CIVIL', 'Obra Civil');
processCategory('3_OBRAS', 'Edificación');
processPromotions('4_PROMOCIONES PROPIAS');

codeContent = codeContent.replace(/const PROJECTS = \[[\s\S]*?\];/, 'const PROJECTS = ' + JSON.stringify(proyectos, null, 12) + ';');
codeContent = codeContent.replace(/const PROMOTIONS = \[[\s\S]*?\];/, 'const PROMOTIONS = ' + JSON.stringify(promociones, null, 12) + ';');

fs.writeFileSync(codePath, codeContent);
console.log('code.html updated');
