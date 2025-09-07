#!/usr/bin/env python3
import os
import sys
import textwrap
import uuid

from PIL import Image, ImageDraw, ImageFont


def generate_badge(template_path, attendee_name, event_name):
    try:
        # Load template image
        if not os.path.exists(template_path):
            # If template doesn't exist, create a default one
            img = Image.new('RGB', (800, 600), color=(73, 109, 137))
            draw = ImageDraw.Draw(img)
            # Add some default text
            draw.text((400, 300), "EventProof Badge", fill=(255, 255, 255))
        else:
            img = Image.open(template_path)
        
        draw = ImageDraw.Draw(img)
        
        # Try to load a font, fall back to default if not available
        try:
            font_large = ImageFont.truetype("arial.ttf", 40)
            font_small = ImageFont.truetype("arial.ttf", 20)
        except:
            font_large = ImageFont.load_default()
            font_small = ImageFont.load_default()
        
        # Calculate text positions
        width, height = img.size
        name_position = (width // 2, height - 150)
        event_position = (width // 2, height - 80)
        
        # Draw attendee name
        name_text = f"{attendee_name}"
        name_bbox = draw.textbbox((0, 0), name_text, font=font_large)
        name_width = name_bbox[2] - name_bbox[0]
        name_position = ((width - name_width) // 2, height - 150)
        draw.text(name_position, name_text, font=font_large, fill=(255, 255, 255))
        
        # Draw event name
        event_text = f"{event_name}"
        event_bbox = draw.textbbox((0, 0), event_text, font=font_small)
        event_width = event_bbox[2] - event_bbox[0]
        event_position = ((width - event_width) // 2, height - 80)
        draw.text(event_position, event_text, font=font_small, fill=(255, 255, 255))
        
        # Draw attendance date
        from datetime import datetime
        date_text = datetime.now().strftime("%Y-%m-%d")
        date_bbox = draw.textbbox((0, 0), date_text, font=font_small)
        date_width = date_bbox[2] - date_bbox[0]
        date_position = (20, height - 40)
        draw.text(date_position, date_text, font=font_small, fill=(255, 255, 255))
        
        # Save the generated badge
        # output_dir = "uploads/generated_badges"
        # os.makedirs(output_dir, exist_ok=True)
        # output_filename = f"{uuid.uuid4().hex}.png"
        # output_path = os.path.join(output_dir, output_filename)
        output_dir = "uploads/generated_badges"
        os.makedirs(output_dir, exist_ok=True)
        output_filename = f"{uuid.uuid4().hex}.png"
        output_path = os.path.join(output_dir, output_filename)
        
        img.save(output_path)
        
        # return output_path
        return f"/generated_badges/{output_filename}"
    except Exception as e:
        print(f"Error generating badge: {str(e)}")
        return None

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python generate_badge.py <template_image> <attendee_name> <event_name>")
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

