/* - load even
        - it will  make sure that the entire website includeing all dependent
          resourses such as stylesheets and images is fully loaded and 
          available before we run any javascript code
*/
window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    // const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    /*
        - particle system is a collection of small objects
        - each particle is a small graphical element, it can be image or shape.
          we can program these particles ot look and  behave in certain way to
          simulate all different kinds of effect
        - it could be fire , fog, bouncing balls, swarms of enemies in a game 
          or many other things.
    */

    /*
        - javascript classes are buleprints to create many  similar objects
        - javascript is a prototype language, every javascript object has a
          internal property called "prototype"  that it can be used to extend
          object properties ans methods
    */

    /*
        - classes in javascript are so called "syntactical sugar".
          it's a cleaner and more elegant syntax built over native Javacript
          prototype based inheritance, that mimics(模仿) classes for other 
          programming languages.
        - class is a template, everytime you call the particle class, it will
          create a  particle for you.
    
    */

    // const image1 = document.getElementById("image1")

    /* create one  particle object */
    class Particle {
        constructor(effect, x, y, color) {
            this.effect = effect;
            this.x = Math.random() * this.effect.width;
            this.y = Math.random() * this.effect.height;

            // this.x = x;
            // this.y = y;

            /* where the particle sits in the overall image */
            this.originX = Math.floor(x);
            this.originY = Math.floor(y);
            this.color = color;
            // this.size = 5;
            this.size = this.effect.gap;


            // this.velocity_x = Math.random() * 2 - 1;
            // this.velocity_y = Math.random() * 2 - 1;

            this.velocity_x = 0;
            this.velocity_y = 0;

            this.ease = 0.6;

            this.friction = 0.95;

            this.dx = 0;
            this.dy = 0;
            this.radius = 0;
            this.angle = 0;

            this.active = true;

            this.timeout = undefined;

        }
        draw(context) {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.size, this.size);
            // ctx.drawImage(image1, 100, 100, 100, 100);
        }
        update() {
            if (this.active) {
                this.dx = this.effect.mouse.x - this.x;
                this.dy = this.effect.mouse.y - this.y;

                this.distance = this.dx * this.dx + this.dy * this.dy;
                this.force = -this.effect.mouse.radius / this.distance;

                if (this.distance < this.effect.mouse.radius) {
                    this.angle = Math.atan2(this.dy, this.dx);

                    this.velocity_x += this.force * Math.cos(this.angle);
                    this.velocity_y += this.force * Math.sin(this.angle);
                }


                // this.x += this.velocity_x;
                // this.y += this.velocity_y;

                /* 让每个像素点回位 */
                this.x += (this.velocity_x *= this.friction) + (this.originX - this.x) * this.ease;
                this.y += (this.velocity_y *= this.friction) + (this.originY - this.y) * this.ease;


            }
        }
        warp() {
            this.x = Math.random() * this.effect.width;
            this.y = Math.random() * this.effect.height;
            this.ease = 0.3;
            this.size = this.effect.gap;
        }
        blocks() {
            this.x = Math.random() * this.effect.width;
            this.y = Math.random() > 0.5 ? 0 : this.effect.height;
            this.ease = 0.2;
            this.size = 10;
        }

        assemble() {
            clearTimeout(this.timeout);
            this.x = Math.random() * this.effect.width;
            this.y = Math.random() * this.effect.height;
            this.ease = 0.3;
            this.size = this.effect.gap;
            this.active = false;
            this.effect.counter++;

            this.timeout = setTimeout(() => {
                this.active = true;
            }, this.effect.counter * 0.002);

        }

        particlePrint() {
            clearTimeout(this.timeout);
            this.x = 0.5 * this.effect.width;
            this.y = 0.5 * this.effect.height;
            this.ease = 0.3;
            this.size = this.effect.gap;
            this.active = false;
            this.effect.counter++;

            this.timeout = setTimeout(() => {
                this.active = true;
            }, this.effect.counter * 0.002);

        }

    }

    /* handle a bounch of particles for particular effect */
    class Effect {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.particlesArray = [];
            this.image = document.getElementById("image1")
            this.centerX = this.width * 0.5;
            this.centerY = this.height * 0.5;

            /* 这里的 centerX  centerY 是相对于 canvas 的 中心点 canvas(centerX, centerY) */
            console.log(this.width, this.height);
            console.log(this.centerX, this.centerY);

            this.x = this.centerX - this.image.width * 0.5;
            this.y = this.centerY - this.image.height * 0.5;

            this.gap = 4;

            console.log(this.x, this.y);


            /* 鼠标位置 */
            this.mouse = {
                radius: 40000,
                x: undefined,
                y: undefined,
            };

            window.addEventListener('mousemove', event => {
                this.mouse.x = event.x;
                this.mouse.y = event.y;
                console.log(this.mouse.x, this.mouse.y)
            });


            this.counter = 0;



        }

        init(context) {
            context.drawImage(this.image, this.x, this.y);
            /*
            variable pixels is an array that each element containe  the pixel's postion and color values
            */
            const pixels = context.getImageData(0, 0, this.width, this.height).data;
            console.log(pixels)

            for (let y = 0; y < this.height; y += this.gap) {
                for (let x = 0; x < this.width; x += this.gap) {
                    const index = (y * this.width + x) * 4;
                    const red = pixels[index];
                    const green = pixels[index + 1];
                    const blue = pixels[index + 2];
                    const alpha = pixels[index + 3];
                    const color = 'rgb(' + red + ',' + green + ',' + blue + ')';

                    if (alpha > 0) {
                        this.particlesArray.push(new Particle(this, x, y, color));
                    }
                }
            }

            // for (let i = 0; i < 100; ++i) {
            //     this.particlesArray.push(new Particle(this))
            // }

        }

        draw(ctx) {
            this.particlesArray.forEach(particle => particle.draw(ctx));
        }
        update() {
            this.particlesArray.forEach(particle => particle.update());
        }
        warp() {
            this.particlesArray.forEach(particle => particle.warp());

        }
        blocks() {
            this.particlesArray.forEach(particle => particle.blocks());

        }
        assemble() {
            this.counter = 0;
            this.particlesArray.forEach(particle => particle.assemble());

        }
        particlePrint() {
            this.counter = 0;
            this.particlesArray.forEach(particle => particle.particlePrint());

        }
    }



    /* ctx.fillRect(postionX, postionY, width, height) */
    // ctx.fillRect(120, 340, 100, 200);

    /* ctx.drawImage(the image we try to draw, postionX, postionY , width, height) */
    // ctx.drawImage(image1, 100, 100, 100, 100);



    // const particle1 = new Particle();
    // particle1.x = 100;
    // particle1.y = 100;
    // particle1.draw();


    const ctx = canvas.getContext('2d');
    const effect = new Effect(canvas.width, canvas.height);
    effect.init(ctx);

    // draw the particle effect
    // effect.draw(ctx);
    console.log(effect);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.draw(ctx);
        effect.update();
        requestAnimationFrame(animate);
    }

    animate();



    /* warp button */
    const warpButton = document.getElementById("warpButton");
    warpButton.addEventListener("click", function () {
        effect.warp();
    });





    /* block button */
    const blocksButton = document.getElementById("blockButton");
    blocksButton.addEventListener("click", function () {
        effect.blocks();
    });




    /* assemble button */
    const assembleButton = document.getElementById("assembleButton");
    assembleButton.addEventListener("click", function () {
        effect.assemble();
    });

    /* particlePrint */

    const particlePrint = document.getElementById("particlePrint");
    particlePrint.addEventListener("click", function () {
        effect.particlePrint();
    });


});
