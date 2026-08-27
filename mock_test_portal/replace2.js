const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f === 'node_modules' || f === '.next') return; // Skip
      walk(dirPath, callback);
    } else {
      if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
        callback(dirPath);
      }
    }
  });
}

const colorMap = {
  // Dark blues and reds
  'rgba(30, 58, 138, 0.4)': 'rgba(37, 99, 235, 0.05)',
  'rgba(30, 58, 138, 0.6)': 'rgba(37, 99, 235, 0.08)',
  'rgba(30, 58, 138, 0.8)': 'rgba(37, 99, 235, 0.1)',
  'rgba(30, 58, 138, 0.25)': 'rgba(37, 99, 235, 0.03)',
  'rgba(15, 23, 42, 0.6)': '#ffffff',
  'rgba(15, 23, 42, 0.98)': '#ffffff',
  'rgba(124, 45, 18, 0.6)': 'rgba(239, 68, 68, 0.05)',
  'rgba(124, 45, 18, 0.8)': 'rgba(239, 68, 68, 0.08)',
  '#1e3a8a': '#eff6ff',
  '#7c2d12': '#fff1f2',
  'rgba(0, 0, 0, 0.85)': 'rgba(0, 0, 0, 0.1)',
  'rgba(0, 0, 0, 0.88)': 'rgba(0, 0, 0, 0.15)',
  'rgba(0, 0, 0, 0.95)': 'rgba(0, 0, 0, 0.2)',
  'rgba(0, 0, 0, 0.8)': 'rgba(0, 0, 0, 0.1)',
  
  // Bright oranges mapping to softer light ones
  'rgba(249, 115, 22, 0.5)': 'rgba(37, 99, 235, 0.1)',
  'rgba(249, 115, 22, 0.6)': 'rgba(37, 99, 235, 0.12)',
  'rgba(249, 115, 22, 0.25)': 'rgba(37, 99, 235, 0.05)',
  'rgba(234, 179, 8, 0.15)': 'rgba(234, 179, 8, 0.1)',
  'rgba(148, 163, 184, 0.15)': 'rgba(148, 163, 184, 0.1)',
  'rgba(217, 119, 6, 0.15)': 'rgba(217, 119, 6, 0.1)',
  'rgba(255, 255, 255, 0.08)': 'rgba(0, 0, 0, 0.04)',
  
  // Left over generic darks
  'rgba(0,0,0,0.5)': 'rgba(0,0,0,0.1)',
  'rgba(0,0,0,0.25)': 'rgba(0,0,0,0.08)'
};

const regexes = Object.keys(colorMap).map(k => {
  const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return {
    regex: new RegExp(escaped, 'g'),
    replacement: colorMap[k]
  };
});

let changedFiles = 0;
walk('src', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  regexes.forEach(({regex, replacement}) => {
    content = content.replace(regex, replacement);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    changedFiles++;
    console.log('Modified ' + filePath);
  }
});

console.log('Total modified ' + changedFiles + ' files.');
