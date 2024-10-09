class Ball {
    constructor(x, y, segments, radius) {
        this.center = createVector(x, y);
        this.masses = [];
        this.springs = [];
        this.radius = radius;

        for (let i = 0; i < segments; i++) {
            let angle = i * (2.0 * Math.PI / segments);
            let x = this.center.x + radius * Math.cos(angle);
            let y = this.center.y + radius * Math.sin(angle);

            this.masses.push(new Mass(x, y));
        }

        for (let i = 0; i < this.masses.length; i++)
            for (let j = i + 1; j < this.masses.length; j++)
                this.springs.push(new Spring(this.masses[i], this.masses[j]));
    }

    updateMasses() {
        for (const m of this.masses) {
            m.updatePosition();
        }

        this.center = createVector(0, 0);
        for (const m of this.masses) {
            this.center.add(m.position);
        }
        this.center.div(this.masses.length);
    }

    checkCollisionWithBox(x, y, width, height) {
        let left = x;
        let top = y;
        let right = left + width;
        let bottom = top + height;

        for (const m of this.masses) {
            if (m.position.x < left || m.position.x > right || m.position.y < top || m.position.y > bottom) {
                return;
            }
            if (m.position.y > top && m.previousPosition.y <= top) {
                m.position.y = top;
                m.velocity.y = 0;
                m.velocity.x *= friction;
            }
            if (m.position.y < bottom && m.previousPosition.y >= bottom) {
                m.position.y = bottom;
                m.velocity.y = 0;
                m.velocity.x *= friction;
            }
            if (m.position.x < left && m.previousPosition.x <= left) {
                m.position.x = left;
                m.velocity.x = 0;
                m.velocity.y *= friction;
            }
            if (m.position.x < right && m.previousPosition.x >= right) {
                m.position.x = right;
                m.velocity.x = 0;
                m.velocity.y *= friction;
            }
        }
    }

    checkCollisionBalls(balls) {
        for (const otherBall of balls) {
            if (otherBall == this) continue;
            let distance = this.center.copy().sub(otherBall.center).mag();

            if (distance > (this.radius + otherBall.radius)) continue;

            for (const m of this.masses) {
                let d = m.position.copy();
                d.sub(otherBall.center);
                if (d.mag() < otherBall.radius) {
                    m.velocity.add(d);
                    d.normalize();
                    d.mult(otherBall.radius);
                    d.add(otherBall.center);
                    m.position = d.copy();
                }
            }
        }
    }

    updateSprings() {
        for (const s of this.springs) {
            s.applyConstraint();
        }
    }

    display() {
        for (const m of this.masses) {
            m.display();
        }
        for (const s of this.springs) {
            s.display();
        }
    }
}