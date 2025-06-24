import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  imports: [NgIf, NgForOf, FormsModule],
})
export class App {
  loading = false;
  cacheBust = '';
  imageUrl = 'https://ray-tracer.onrender.com/image';
  renderUrl = 'https://ray-tracer.onrender.com/render';

  // Scene config
  camera = {
    look_from: [0, 0, 1],
    look_at: [0, 0, 0],
    look_up: [0, 1, 0],
    aspect_ratio: 16 / 9,
    image_width: 400,
    vfov: 90,
  };

  lights = {
    direction: [1, 1, 1],
    color: [1, 1, 1],
    ambient: [0.1, 0.1, 0.1],
  };

  background: number[] = [0.2, 0.2, 0.2];

  spheres: any[] = [];
  triangles: any[] = [];

  jsonInput: string = `{
  "camera": {
    "look_from": [0, 1.5, 6],
    "look_at": [0, 1, 0],
    "look_up": [0, 1, 0],
    "aspect_ratio": 1.6,
    "image_width": 400,
    "vfov": 45
  },
  "lights": {
    "direction": [1, 1, 1],
    "color": [1, 1, 1],
    "ambient": [0.4, 0.4, 0.4]
  },
  "background": [0.53, 0.81, 0.98],
  "spheres": [
    {
      "center": [-1.8, 1, 0],
      "radius": 0.5,
      "material": {
        "diffuse": [1, 0, 0],
        "specular": [1, 1, 1],
        "glossiness": 40,
        "diffuse_coef": 0.8,
        "specular_coef": 0.3,
        "ambient_coef": 0.2,
        "reflection_factor": 0.5
      }
    },
    {
      "center": [-0.6, 1, 0],
      "radius": 0.5,
      "material": {
        "diffuse": [0, 1, 0],
        "specular": [1, 1, 1],
        "glossiness": 30,
        "diffuse_coef": 0.8,
        "specular_coef": 0.3,
        "ambient_coef": 0.2,
        "reflection_factor": 0.0
      }
    },
    {
      "center": [0.6, 1, 0],
      "radius": 0.5,
      "material": {
        "diffuse": [0, 0, 1],
        "specular": [1, 1, 1],
        "glossiness": 40,
        "diffuse_coef": 0.7,
        "specular_coef": 0.4,
        "ambient_coef": 0.2,
        "reflection_factor": 0.5
      }
    },
    {
      "center": [1.8, 1, 0],
      "radius": 0.5,
      "material": {
        "diffuse": [1, 1, 0],
        "specular": [1, 1, 1],
        "glossiness": 20,
        "diffuse_coef": 0.8,
        "specular_coef": 0.2,
        "ambient_coef": 0.2,
        "reflection_factor": 0.0
      }
    }
  ],
  "triangles": [
    {
      "a": [-2, 0.2, -2],
      "b": [2, 0.2, -2],
      "c": [0, 0.2, 2],
      "material": {
        "diffuse": [0.6, 0.3, 0.6],
        "specular": [1, 1, 1],
        "glossiness": 10,
        "diffuse_coef": 0.6,
        "specular_coef": 0.2,
        "ambient_coef": 0.3,
        "reflection_factor": 0.1
      }
    },
    {
      "a": [-3, 0, -3],
      "b": [-3, 0, 3],
      "c": [3, 0, 3],
      "material": {
        "diffuse": [0.1, 0.5, 0.3],
        "specular": [1, 1, 1],
        "glossiness": 10,
        "diffuse_coef": 0.6,
        "specular_coef": 0.2,
        "ambient_coef": 0.3,
        "reflection_factor": 0.1
      }
    },
    {
      "a": [-2, 0.5, -2.5],
      "b": [2, 0.5, -2.5],
      "c": [0, 3, -2.5],
      "material": {
        "diffuse": [1.0, 0.37, 0.0],
        "specular": [1, 1, 1],
        "glossiness": 40,
        "diffuse_coef": 0.9,
        "specular_coef": 0.4,
        "ambient_coef": 0.2,
        "reflection_factor": 0.4
      }
    }
  ]
}`;


  constructor(private http: HttpClient) {}

  addSphere() {
    if (this.spheres.length < 10) {
      this.spheres.push({
        center: [0, 0, 0],
        radius: 0.3,
        material: this.defaultMaterial(),
      });
    }
  }

  removeSphere(index: number) {
    this.spheres.splice(index, 1);
  }

  addTriangle() {
    if (this.triangles.length < 10) {
      this.triangles.push({
        a: [-0.5, 0, 0],
        b: [0.5, 0, 0],
        c: [0, 1, 0],
        material: this.defaultMaterial(),
      });
    }
  }

  removeTriangle(index: number) {
    this.triangles.splice(index, 1);
  }


  defaultMaterial() {
    return {
      diffuse: [1, 0, 0],
      specular: [1, 1, 1],
      glossiness: 16,
      diffuse_coef: 0.7,
      specular_coef: 0.2,
      ambient_coef: 0.1,
      reflection_factor: 0.1,
    };
  }

  renderImage() {
    const scene = {
      camera: this.camera,
      lights: this.lights,
      background: this.background,
      spheres: this.spheres,
      triangles: this.triangles,
    };

    this.loading = true;

    this.http.post(this.renderUrl, scene).subscribe({
      next: () => {
        this.cacheBust = Date.now().toString(); // force image reload
        this.loading = false;
      },
      error: (err) => {
        console.error('Render failed:', err);
        this.loading = false;
      },
    });
  }

  generateRandomScene() {
    const rand = (min: number, max: number) => Math.random() * (max - min) + min;
    const clampColor = (c: number[]) => c.map(v => Math.max(0, Math.min(1, v)));
    const randColor = () => clampColor([rand(0, 1), rand(0, 1), rand(0, 1)]);
    const randVec3 = () => [rand(-1, 1), rand(-1, 1), rand(-1, 1)];
    const randPoint = () => [rand(-3, 3), rand(-1, 3), rand(-3, 3)];

    const randomMaterial = () => ({
      diffuse: randColor(),
      specular: randColor(),
      glossiness: rand(1, 50),
      diffuse_coef: rand(0, 1),
      specular_coef: rand(0, 1),
      ambient_coef: rand(0, 1),
      reflection_factor: rand(0, 1)
    });

    // Keep camera static
    const camera = this.camera;

    // Random lights
    const lights = {
      direction: randVec3(),
      color: randColor(),
      ambient: randColor()
    };

    // Random background
    const background = randColor();

    // Generate random spheres (2 to 6)
    const spheres = Array.from({ length: Math.floor(rand(2, 6)) }, () => ({
      center: randPoint(),
      radius: rand(0.2, 0.8),
      material: randomMaterial()
    }));

    // Generate random triangles (2 to 6)
    const triangles = Array.from({ length: Math.floor(rand(2, 6)) }, () => {
      const a = randPoint();
      const b = randPoint();
      const c = randPoint();
      return { a, b, c, material: randomMaterial() };
    });

    // Build the scene object
    const scene = { camera, lights, background, spheres, triangles };

    // Send to backend
    this.loading = true;
    this.http.post(this.renderUrl, scene).subscribe({
      next: () => {
        this.cacheBust = Date.now().toString();
        this.loading = false;
      },
      error: (err) => {
        console.error('Random scene render failed:', err);
        this.loading = false;
      },
    });
  }

  submitRawJson() {
    try {
      const scene = JSON.parse(this.jsonInput);
      this.loading = true;

      this.http.post(this.renderUrl, scene).subscribe({
        next: () => {
          this.cacheBust = Date.now().toString();
          this.loading = false;
        },
        error: (err) => {
          console.error('Raw JSON render failed:', err);
          this.loading = false;
        }
      });
    } catch (e) {
      alert('Invalid JSON format.');
    }
  }

}
