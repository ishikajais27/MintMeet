#!/usr/bin/env python3
import os
import sys


def generate_badge(template_path, attendee_name, event_name):
    # Mock implementation for testing
    output_dir = "uploads/generated_badges"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"mock-badge-{attendee_name}.png")
    
    # Create a mock file
    with open(output_path, 'w') as f:
        f.write("mock badge content")
    
    return output_path

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("ERROR: Invalid arguments")
        sys.exit(1)
    
    template_image = sys.argv[1]
    attendee_name = sys.argv[2]
    event_name = sys.argv[3]
    
    result_path = generate_badge(template_image, attendee_name, event_name)
    
    if result_path:
        print(result_path)
    else:
        print("ERROR: Failed to generate badge")
        sys.exit(1)