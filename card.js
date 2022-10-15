export default class Card extends Phaser.GameObjects.Image{
    pointerover = false
    tapped = false
    zoneTag
    previousZone
    objectTag
    clickDuration = 0
    cardPile // To track cards being carried under this
    constructor(scene, x, y, cardfront, cardback, zoneTag){
        super(scene, x, y, cardfront, cardback, zoneTag)
        scene.add.existing(this)

        this.cardfront = cardfront
        this.cardback = cardback
        this.zoneTag = zoneTag
        this.previousZone = zoneTag
        this.objectTag = zoneTag
        scene.GOD(this) // Para criar logo uma entry para esta carta

        this.setScale(0.2)

        this.setInteractive()
        this.input.dropZone = true

        this.card_augmented = scene.add.image(1300, 350, cardfront)
        this.card_augmented.setAlpha(0)
        this.card_augmented.setScale(0.8)

        this.displayHeight = Math.round(this.displayHeight)
        this.displayWidth = Math.round(this.displayWidth)

        scene.input.setDraggable(this)

        this.on('dragstart', function () {
            scene.children.bringToTop(this)
            this.input.dropZone = false
        })

        this.on('drag', function(pointer, dragX, dragY) {
            if(this.scene.clickDuration > 20){
                var cardPile = this.scene.cardPiles.get(this.zoneTag)
                for(var card of cardPile){
                    this.scene.cards_on_board[+card].x = dragX
                    this.scene.cards_on_board[+card].y = dragY
                    this.scene.cards_on_board[+card].input.dropZone = false
                }   
            }
            else{
                this.scene.clickDuration = 0
                this.x = dragX
                this.y = dragY
            }
        })

        this.on('dragend', function () {
            this.input.dropZone = true
        })

        this.on('pointerover', function () {
            this.card_augmented.setAlpha(1)
            this.pointerover = true
        })
        
        this.on('pointerout', function () {
            this.card_augmented.setTexture(this.texture.key) // Se o rato sair do scry antes de lagar o "S", a vista volta ao normal
            this.card_augmented.setAlpha(0)
            this.pointerover = false
        })

        this.on('pointerdown', function () {
            console.log(this.scene.cardPiles)
        })

        this.on('drop', function (pointer, dropZone) {

            var cardPile = this.scene.cardPiles.get(this.zoneTag).slice()
            for(var card of cardPile){
                if (dropZone.zoneTag != "board"){
                    console.log(this.objectTag, cardPile)
                    this.scene.cards_on_board[+card].x = dropZone.x 
                    this.scene.cards_on_board[+card].y = dropZone.y
                    this.scene.cards_on_board[+card].zoneTag = dropZone.zoneTag
                    
                }
                else{
                    this.scene.cards_on_board[+card].zoneTag = cardPile[0].toString()
                }
                
                this.scene.GOD(this.scene.cards_on_board[+card])
                this.scene.cards_on_board[+card].previousZone = this.scene.cards_on_board[+card].zoneTag
            }
            for(var card of cardPile){
                this.scene.cards_on_board[+card].input.dropZone = true
            }
        })
    }

    tap(){
        if (!this.tapped){
            this.rotation += 3.14/2
            this.tapped = true
        }
        else{
            this.rotation -= 3.14/2
            this.tapped = false
        }
    }

    flip(){
        if(this.texture.key == this.cardback){
            this.setTexture(this.cardfront)
            this.card_augmented.setTexture(this.cardfront)
        }
        else{
            this.setTexture(this.cardback)
            this.card_augmented.setTexture(this.cardback)
        }
    }

    scry(){
        if(this.texture.key == this.cardback){
            this.card_augmented.setTexture(this.cardfront)
        }
        else{
            this.card_augmented.setTexture(this.cardback)
        }
    }

    unscry(){
        this.card_augmented.setTexture(this.texture.key)
    }
}