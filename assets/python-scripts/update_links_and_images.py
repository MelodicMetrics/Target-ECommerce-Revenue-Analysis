import re
import os

# Specify the directory containing your HTML files
directory = "./"  # Adjust this to the folder containing your HTML files

# Regex patterns for href and src attributes
href_pattern = r'href="(/[^"]+)"'
src_pattern = r'src="(/[^"]+)"'

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(".html"):
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            # Replace href values to include {{ site.baseurl }}
            updated_content = re.sub(href_pattern, r'href="{{ site.baseurl }}\1"', content)

            # Replace src values to include {{ site.baseurl }}
            updated_content = re.sub(src_pattern, r'src="{{ site.baseurl }}\1"', updated_content)

            # Save the updated content back to the file
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(updated_content)

print("All href and src links updated with {{ site.baseurl }}!")
