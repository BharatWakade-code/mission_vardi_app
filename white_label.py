import os
import re

replacements = {
    'EduSaaS': 'EduSaaS',
    'EduSaaS': 'EduSaaS',
    'edusaas': 'edusaas',
    'edusaas': 'edusaas',
    'EduSaaS Web': 'EduSaaS Web',
    'edusaasweb': 'edusaasweb',
    'Competitive Exams': 'Competitive Exams',
    'Aptitude Tests': 'Aptitude Tests',
    'Global': 'Global',
    'Mock Test': 'Mock Test',
    'Exam': 'Exam'
}

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return
        
    new_content = content
    for k, v in replacements.items():
        new_content = new_content.replace(k, v)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {filepath}')

for root, dirs, files in os.walk('a:/Projects/edusaas_app'):
    # Exclude heavy/hidden directories
    dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '.next', 'build', '.dart_tool', '__pycache__', 'windows', 'linux', 'macos']]
    
    for name in files:
        if name.endswith(('.ts', '.tsx', '.dart', '.py', '.json', '.md', '.html', '.xml', '.plist', '.env')):
            replace_in_file(os.path.join(root, name))
print('White-labeling complete on branch!')
