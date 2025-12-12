const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/Admin.jsx');

try {
  let content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // Trouver la première occurrence de 'export default Admin'
  let exportLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('export default Admin')) {
      exportLine = i;
      break;
    }
  }
  
  if (exportLine !== -1) {
    // Garder juste jusqu'à exportLine (include la ligne export)
    const cleanLines = lines.slice(0, exportLine + 1);
    const cleanContent = cleanLines.join('\n');
    
    fs.writeFileSync(filePath, cleanContent, 'utf-8');
    console.log(`Fichier nettoyé! Gardé ${exportLine + 1} lignes, supprimé ${lines.length - exportLine - 1} lignes dupliquées`);
  } else {
    console.log('export default Admin not found!');
  }
} catch (error) {
  console.error('Erreur:', error.message);
}
