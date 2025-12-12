import os

file_path = 'src/pages/Admin.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Trouver la première occurrence de 'export default Admin'
export_line = -1
for i, line in enumerate(lines):
    if 'export default Admin' in line:
        export_line = i
        break

if export_line != -1:
    # Garder juste jusqu'à export_line+1 (include la ligne export)
    clean_lines = lines[:export_line+1]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(clean_lines)
    print(f"Fichier nettoyé! Gardé {export_line+1} lignes, supprimé {len(lines)-export_line-1} lignes dupliquées")
else:
    print("export default Admin not found!")
