class VaultGame extends PIXI.Container {
    constructor(app) {
        super();
  
        this.initializeGame = this.initializeGame.bind(this);
        this.handlePointerDown = this.handlePointerDown.bind(this);
  
        this.scaleFactor = 0.25;
  
        this.timer = 0;
        this.timerText = new PIXI.Text('0', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
            align: 'center',
        });
        this.timerInterval = null;
  
        this.initializeGame(app);
    }
  
    initializeGame(app) {
        this.bg = new PIXI.Sprite(PIXI.Texture.from('assets/bg.png'));
        this.blink = new PIXI.Sprite(PIXI.Texture.from('assets/blink.png'));
        this.door = new PIXI.Sprite(PIXI.Texture.from('assets/door.png'));
        this.doorOpen = new PIXI.Sprite(PIXI.Texture.from('assets/doorOpen.png'));
        this.doorOpenShadow = new PIXI.Sprite(PIXI.Texture.from('assets/doorOpenShadow.png'));
        this.handle = new PIXI.Sprite(PIXI.Texture.from('assets/handle.png'));
        this.handleShadow = new PIXI.Sprite(PIXI.Texture.from('assets/handleShadow.png'));
        this.handleContainer = new PIXI.Container();
        this.doorContainer = new PIXI.Container();
  
        const sprites = [
            this.bg,
            this.blink,
            this.door,
            this.doorOpen,
            this.doorOpenShadow,
            this.handle,
            this.handleShadow,
        ];
  
        sprites.forEach(sprite => {
            sprite.width *= this.scaleFactor;
            sprite.height *= this.scaleFactor;
        });
  
        this.bg.width = app.screen.width;
        this.bg.height = app.screen.height;
  
        this.addChild(this.bg);
        this.addChild(this.blink);
        this.addChild(this.door);
  
        this.doorContainer.addChild(this.doorOpenShadow);
        this.doorContainer.addChild(this.doorOpen);
        this.addChild(this.doorContainer);
  
  
        this.handleContainer.addChild(this.handleShadow);
        this.handleContainer.addChild(this.handle);
        this.addChild(this.handleContainer);
  
        this.addChild(this.timerText);
  
        this.timerText.anchor.set(0.5);
        this.timerText.position.set(app.screen.width / 2 - 285, app.screen.height / 2 - 35);
  
        this.startTimer();
  
        this.bg.anchor.set(0.5, 0.5);
        this.blink.anchor.set(0.5);
        this.door.anchor.set(0.57, 0.52);
        this.doorOpen.anchor.set(0.5);
        this.doorOpenShadow.anchor.set(0.5);
        this.handle.anchor.set(0.5);
        this.handleShadow.anchor.set(0.5);
  
        this.bg.position.set(app.screen.width / 2, app.screen.height / 2);
        this.blink.position.set(app.screen.width / 2 - 10, app.screen.height / 2 - 10);
        this.door.position.set((app.screen.width / 2) + 50, (app.screen.height / 2)) + 200;
  
        this.doorOpenShadow.position.set(40, 10);
        this.doorContainer.position.set(app.screen.width / 2 + 370, app.screen.height / 2 - 10);
        this.handleShadow.position.set(10, 10);
        this.handleContainer.position.set(app.screen.width / 2 - 10, app.screen.height / 2 - 10);
  
        this.blink.visible = false;
  
        this.doorContainer.visible = false;
  
        this.handle.interactive = true;
        this.handle.buttonMode = true;
  
        this.handle.on('pointerdown', this.handlePointerDown);
        this.generateNewCombination();
    }
  
    generateNewCombination() {
        this.secretCombination = [
            [Math.ceil(Math.random() * 9), Math.random() < 0.5 ? 'clockwise' : 'counterclockwise'],
            [Math.ceil(Math.random() * 9), Math.random() < 0.5 ? 'clockwise' : 'counterclockwise'],
            [Math.ceil(Math.random() * 9), Math.random() < 0.5 ? 'clockwise' : 'counterclockwise'],
        ];
  
        console.log('New secret combination:', this.secretCombination);
        this.currentCombination = [];
    }
  
    attempts = [];
    completed = [];
  
    handlePointerDown(event) {
        const clockwise = event.data.global.x > this.handleContainer.position.x;
        const rotationStep = (clockwise ? 1 : -1) * (Math.PI / 6);
        const direction = clockwise ? 'clockwise' : 'counterclockwise';
  
        gsap.to(this.handleContainer, {
            rotation: this.handleContainer.rotation + rotationStep,
            duration: 0.2,
        });
  
        this.checkCombination(direction);
    }
  
    checkCombination(direction) {
        const currentStep = this.completed.length;
        const currentSecret = this.secretCombination[currentStep];
  
        if (currentSecret[1] === direction) {
            this.attempts[currentStep] = (this.attempts[currentStep] || 0) + 1;
  
            if (currentSecret[0] === this.attempts[currentStep]) {
                this.completed.push(currentSecret);
                this.attempts[currentStep] = 0;
  
                if (this.completed.length === this.secretCombination.length) {
                    this.unlockVault();
                }
            }
        } else {
            this.resetGame();
        }
    }
  
    async unlockVault() {
        this.door.visible = false;
        this.doorContainer.visible = true;
        this.handleContainer.visible = false;
        this.blink.visible = true;
        this.animateBlink();
  
        await new Promise(resolve => setTimeout(resolve, 5000));
  
        this.door.visible = true;
        this.doorContainer.visible = false;
        this.handleContainer.visible = true;
        this.blink.visible = false;
  
        this.resetGame();
    }
  
    animateBlink() {
        gsap.fromTo(
            this.blink, {
                alpha: 0
            }, {
                alpha: 1,
                duration: 0.5,
                repeat: -1,
                yoyo: true
            }
        );
    }
  
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer += 1;
            this.timerText.text = this.timer;
        }, 1000);
    }
  
    resetGame() {
        this.attempts = [];
        this.completed = [];
        this.currentCombination = [];
        gsap.to(this.handleContainer, {
            rotation: this.handleContainer.rotation + 6 * Math.PI,
            duration: 0.5,
            onComplete: () => {
                this.generateNewCombination();
            },
        });
  
        this.timer = 0;
        clearInterval(this.timerInterval);
        this.startTimer();
    }
  }

  export default VaultGame;