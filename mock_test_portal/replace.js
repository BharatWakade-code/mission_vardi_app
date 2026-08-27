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
  // Backgrounds
  '#0b1120': '#ffffff',
  '#0f172a': '#f8fafc',
  '#020617': '#f1f5f9',
  'rgba(15, 23, 42, 0.7)': '#ffffff',
  'rgba(15, 23, 42, 0.8)': '#ffffff',
  'rgba(15, 23, 42, 0.9)': '#ffffff',
  'rgba(15, 23, 42, 0.95)': '#ffffff',
  'rgba(30, 41, 59, 0.7)': '#ffffff',
  'rgba(30, 41, 59, 0.8)': '#ffffff',
  'rgba(30, 41, 59, 0.9)': '#ffffff',
  'rgba(30, 41, 59, 0.95)': '#ffffff',
  'rgba(15, 23, 42, 1)': '#ffffff',
  'rgba(30, 41, 59, 1)': '#ffffff',
  
  // Text
  '#ffffff': '#0f172a',
  '#f8fafc': '#1e293b',
  '#cbd5e1': '#475569',
  '#94a3b8': '#64748b',
  '#64748b': '#94a3b8',
  
  // Borders and subtle overlays
  'rgba(255, 255, 255, 0.05)': 'rgba(0, 0, 0, 0.02)',
  'rgba(255,255,255,0.05)': 'rgba(0,0,0,0.02)',
  'rgba(255, 255, 255, 0.1)': 'rgba(0, 0, 0, 0.06)',
  'rgba(255,255,255,0.1)': 'rgba(0,0,0,0.06)',
  'rgba(255, 255, 255, 0.15)': 'rgba(0, 0, 0, 0.08)',
  'rgba(255,255,255,0.15)': 'rgba(0,0,0,0.08)',
  'rgba(255, 255, 255, 0.2)': 'rgba(0, 0, 0, 0.1)',
  'rgba(255,255,255,0.2)': 'rgba(0,0,0,0.1)',
  'rgba(255, 255, 255, 0.3)': 'rgba(0, 0, 0, 0.15)',
  'rgba(255,255,255,0.3)': 'rgba(0,0,0,0.15)',
  
  // Gradients and specific themes
  'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)': 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
  'linear-gradient(90deg, #1e3a8a 0%, #7c2d12 100%)': 'linear-gradient(90deg, #e0f2fe 0%, #ffedd5 100%)',
  'linear-gradient(180deg, #0b1120 0%, #0f172a 100%)': 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
  'radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, transparent 70%)': 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)',
  'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)': 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)',
  
  // Shadows (lightening them)
  'rgba(0, 0, 0, 0.3)': 'rgba(0, 0, 0, 0.05)',
  'rgba(0,0,0,0.3)': 'rgba(0,0,0,0.05)',
  'rgba(0, 0, 0, 0.4)': 'rgba(0, 0, 0, 0.08)',
  'rgba(0, 0, 0, 0.5)': 'rgba(0, 0, 0, 0.1)',
  'rgba(249, 115, 22, 0.4)': 'rgba(37, 99, 235, 0.15)',
  'rgba(249, 115, 22, 0.2)': 'rgba(37, 99, 235, 0.1)',
  'rgba(249, 115, 22, 0.3)': 'rgba(37, 99, 235, 0.1)',
  
  // Primary brand colors
  '#f97316': '#2563eb',
  '#ea580c': '#1d4ed8',
  '#fb923c': '#3b82f6',
  'rgba(249, 115, 22, 0.15)': 'rgba(37, 99, 235, 0.1)',
  
  // Green
  '#34d399': '#10b981',
  '#10b981': '#059669',
  'rgba(52, 211, 153, 0.3)': 'rgba(16, 185, 129, 0.2)',
  'rgba(16, 185, 129, 0.15)': 'rgba(16, 185, 129, 0.1)',
  
  // Blue/Purple mappings
  '#60a5fa': '#2563eb',
  '#3b82f6': '#2563eb',
  '#a78bfa': '#7c3aed',
  '#8b5cf6': '#6d28d9',
  
  // Extra mapping
  '#000000': '#0f172a'
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
