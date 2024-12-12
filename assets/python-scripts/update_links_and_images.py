import os
import re

# Function to update href and src references in a file
def update_links_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Regex patterns for href and src starting with / or ./
    href_pattern = r'href=["\'](\./|/)([^"\']+)["\']'
    src_pattern = r'src=["\'](\./|/)([^"\']+)["\']'

    # Replace href references
    updated_content = re.sub(
        href_pattern, r'href="{{ site.baseurl }}/\2"', content
    )

    # Replace src references
    updated_content = re.sub(
        src_pattern, r'src="{{ site.baseurl }}/\2"', updated_content
    )

    # Write the updated content back to the file
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(updated_content)

# Function to recursively update all HTML files in a directory
def update_links_in_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                print(f"Updating links in: {file_path}")
                update_links_in_file(file_path)

# Path to your project directory (update this as needed)
project_directory = '.'  # Current directory

# Run the script
update_links_in_directory(project_directory)
