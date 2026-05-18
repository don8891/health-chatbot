import os
from PIL import Image, ImageDraw

def create_health_icon(size):
    # Create an RGBA image with transparent background
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw a rounded rectangle for the background gradient/fill
    # Gradient from primary blue (#0284c7) to health green (#10b981)
    # We will simulate a linear gradient diagonally
    for y in range(size):
        for x in range(size):
            # Calculate gradient factor
            factor = (x + y) / (2.0 * size)
            r = int(2 + (16 - 2) * factor)       # #0284c7 (2, 132, 199) -> #10b981 (16, 185, 129)
            g = int(132 + (185 - 132) * factor)
            b = int(199 + (129 - 199) * factor)
            
            # Rounded corner check (inset radius)
            radius = size * 0.2
            # Distance from corners
            if x < radius and y < radius: # Top-left
                if (x - radius)**2 + (y - radius)**2 > radius**2: continue
            elif x > size - radius and y < radius: # Top-right
                if (x - (size - radius))**2 + (y - radius)**2 > radius**2: continue
            elif x < radius and y > size - radius: # Bottom-left
                if (x - radius)**2 + (y - (size - radius))**2 > radius**2: continue
            elif x > size - radius and y > size - radius: # Bottom-right
                if (x - (size - radius))**2 + (y - (size - radius))**2 > radius**2: continue
                
            img.putpixel((x, y), (r, g, b, 255))
            
    # Now draw the heartbeat symbol in white
    # Points normalized to size
    pts = [
        (0.15 * size, 0.50 * size),
        (0.35 * size, 0.50 * size),
        (0.40 * size, 0.58 * size),
        (0.47 * size, 0.20 * size),
        (0.55 * size, 0.80 * size),
        (0.62 * size, 0.44 * size),
        (0.67 * size, 0.54 * size),
        (0.72 * size, 0.50 * size),
        (0.85 * size, 0.50 * size)
    ]
    
    # Smooth line draw
    stroke_width = max(3, int(size * 0.04))
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i+1]], fill=(255, 255, 255, 255), width=stroke_width, joint="round")
        
    return img

# Create directories if they don't exist
public_dir = r"c:\Users\LENOVO\OneDrive\Documents\health-chatbot\frontend\public"
os.makedirs(public_dir, exist_ok=True)

# Generate 192x192
icon_192 = create_health_icon(192)
icon_192.save(os.path.join(public_dir, "icon-192.png"))
print("Generated icon-192.png successfully!")

# Generate 512x512
icon_512 = create_health_icon(512)
icon_512.save(os.path.join(public_dir, "icon-512.png"))
print("Generated icon-512.png successfully!")
