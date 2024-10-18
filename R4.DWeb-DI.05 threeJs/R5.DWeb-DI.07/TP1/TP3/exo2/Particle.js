import * as THREE from 'three';

export default class Particle {
  constructor(_pos, _velocity, _geom) {
    this.material = new THREE.MeshBasicMaterial({ color: 0x156213, transparent: true, opacity: 1.0 });

    this.mesh = new THREE.Mesh(_geom, this.material);
    let size = .3;
    this.mesh.scale.set(size, size, size);
    this.mesh.position.set(_pos.x, _pos.y, _pos.z);

    this.velocity = _velocity.clone();
    this.alpha = 255;

  }

  update(dt) {
    this.mesh.position.add(this.velocity);
    this.alpha -= 5;
    this.material.opacity = this.alpha / 255.0;
  }

  finished() {
    return this.alpha <= 0;
  }
}