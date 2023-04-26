import Phaser from 'phaser'

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
		},
	},
	scene: [],
}

export default new Phaser.Game(config)
