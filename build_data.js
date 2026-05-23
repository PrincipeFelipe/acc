const fs = require('fs');
const path = require('path');

const basePath = 'e:\\Proyectos\\ACC\\imagenes';

let data = {
    categorias: [
        { id: 1, nombre: 'Obra Civil' },
        { id: 2, nombre: 'Obras' }
    ],
    trabajos: [],
    promociones: []
};

let trabajoId = 1;
let promoId = 1;

function processCategory(dirName, catId) {
    const dirPath = path.join(basePath, dirName);
    if (!fs.existsSync(dirPath)) return;
    const subDirs = fs.readdirSync(dirPath);
    
    subDirs.forEach(subDir => {
        const fullPath = path.join(dirPath, subDir);
        if (fs.statSync(fullPath).isDirectory()) {
            const files = fs.readdirSync(fullPath).filter(f => /\.(jpg|jpeg|png|gif|jfif)$/i.test(f));
            if (files.length > 0) {
                const title = subDir.replace(/^\d+\.\d+\.?\s*/, '');
                const imageObjects = files.map((f, i) => ({
                    url: `imagenes/${dirName}/${subDir}/${f}`,
                    es_principal: i === 0
                }));
                
                data.trabajos.push({
                    id: trabajoId++,
                    titulo: title,
                    categoria_id: catId,
                    categorias: { nombre: data.categorias.find(c => c.id === catId).nombre },
                    descripcion: '',
                    ubicacion: '',
                    fecha: '2024-01-01',
                    trabajo_imagenes: imageObjects
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
                data.promociones.push({
                    id: promoId++,
                    titulo: title,
                    descripcion: 'Promoción ' + title,
                    imagen_url: `imagenes/${dirName}/${subDir}/${files[0]}`,
                    activa: true,
                    destacada: index === 0,
                    precio: 'Consultar',
                    habitaciones: 3,
                    banos: 2,
                    metros_cuadrados: '100m²'
                });
            }
        }
    });
}

processCategory('2_OBRA CIVIL', 1);
processCategory('3_OBRAS', 2);
processPromotions('4_PROMOCIONES PROPIAS');

const fileContent = 'window.LOCAL_DATA = ' + JSON.stringify(data, null, 4) + ';\n';
fs.writeFileSync('e:\\Proyectos\\ACC\\js\\data.js', fileContent);
console.log('data.js created successfully!');
