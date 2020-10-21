import {
  Box3, Camera, Group, Vector3,
} from 'three';
import { world } from '~/index';
import { keyboard } from '~/misc/Keyboard';
import { createCarObject3d } from '~/bodies/createCarObject3d';

export class Car {
  angle: number;
  power: number;
  reverse: number;
  angularVelocity: number;
  isThrottling: boolean;
  isReversing: boolean;
  isTurningLeft: boolean;
  isTurningRight: boolean;
  isTurbo: boolean;
  velocity: Vector3;
  x: number;
  y: number;
  z: number;
  health: number;
  turbo: number;
  object3d: Group;
  color: string
  boundingBox: Box3;

  constructor() {
    document.addEventListener('keydown', (event) => keyboard.keyDownHandler(event.key));
    document.addEventListener('keyup', (event) => keyboard.keyUpHandler(event));
    this.color = 'blue';
    this.object3d = createCarObject3d(this.color);
    this.boundingBox = new Box3().setFromObject(this.object3d);
    this.x = 0;
    this.y = -50;
    this.z = this.boundingBox.max.z / 2;
    this.velocity = new Vector3(0, 0, 0);
    this.angle = 0;
    this.power = 0;
    this.reverse = 0;
    this.angle = 0;
    this.angularVelocity = 0;
    this.isThrottling = false;
    this.isReversing = false;
    this.isTurningLeft = false;
    this.isTurningRight = false;
    this.isTurbo = false;
    this.health = 100;
    this.turbo = 100;
  }

  public handleCollision(): void {
    this.health = Math.max(0, this.health - this.power * 200);
    this.velocity = this.velocity.multiplyScalar(-1);
    this.power *= 0.5;
  }

  public setColor(color: string): void {
    world.scene.remove(this.object3d);
    this.color = color;
    this.object3d = createCarObject3d(color);
    world.scene.add(this.object3d);
  }

  public update() {
    this.updateProperties();
    this.updateObject3d();
    this.updateBoundingBox();
  }

  public updateBoundingBox(): void {
    this.boundingBox = new Box3().setFromObject(this.object3d);
  }

  public updateProperties(): void {
    this.isThrottling = keyboard.up;
    this.isReversing = keyboard.down;
    this.isTurningRight = keyboard.right;
    this.isTurningLeft = keyboard.left;
    this.isTurbo = keyboard.space;

    let maxPower = 0.175;
    const maxReverse = 0.0375;
    const powerFactor = 0.001;
    const reverseFactor = 0.0005;

    const drag = 0.95;
    const angularDrag = 0.95;
    const turnSpeed = 0.002;

    if (this.isThrottling) {
      this.power += powerFactor;
    }

    if (this.isTurbo) {
      maxPower = 3;
      this.power += 5 * powerFactor;
      this.turbo = Math.max(0, this.turbo - 1);
    }

    if (!this.isThrottling && !this.isTurbo) {
      maxPower = 0.175;
      this.power -= powerFactor;
    }

    this.reverse = this.isReversing ? this.reverse + reverseFactor : this.reverse - reverseFactor;
    this.power = Math.max(0, Math.min(maxPower, this.power));
    this.reverse = Math.max(0, Math.min(maxReverse, this.reverse));

    const direction = this.power >= this.reverse ? 1 : -1;

    if (this.isTurningLeft) {
      this.angularVelocity -= direction * turnSpeed;
    }

    if (this.isTurningRight) {
      this.angularVelocity += direction * turnSpeed;
    }

    this.velocity.x += Math.sin(this.angle) * (this.power - this.reverse);
    this.velocity.y += Math.cos(this.angle) * (this.power - this.reverse);

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.x *= drag;
    this.velocity.y *= drag;
    this.angle += this.angularVelocity;
    this.angularVelocity *= angularDrag;
    this.health = Math.min(this.health + 0.1, 100);
    this.turbo = Math.min(this.turbo + 0.3, 100);
  }

  updateObject3d(): void {
    this.object3d.position.x = this.x;
    this.object3d.position.y = this.y;
    this.object3d.position.z = this.z;
    this.object3d.rotation.z = -this.angle;
  }

  updateBehindCarCameraPosition(camera: Camera): void {
    const x = this.x - 40 * Math.sin(this.angle);
    const y = this.y - 40 * Math.cos(this.angle);
    const z = this.z + 20;
    camera.position.set(x, y, z);
    camera.lookAt(this.x, this.y, this.z);
    camera.up.set(0, 0, 1);
  }
}
