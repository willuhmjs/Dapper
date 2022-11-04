import { readFileSync } from 'node:fs';
import { join } from "node:path";
import { Canvas, loadImage } from 'canvas-constructor/napi-rs';
import sizeOf from "image-size";
import { User } from 'discord.js';

const options = [{
	pfpsize: 400,
	user1coords: {x: 566, y: 1240 },
	user2coords: {x: 1740, y: 1064 },
	src: "../images/0.png"
}
]

type TestUser = { displayAvatarURL: () => string }
export default async (user1: User | TestUser, user2: User | TestUser) => {


const choice = options[Math.floor(Math.random() * options.length)];
const ip = join(__dirname, choice.src)
const image = await loadImage(readFileSync(ip));
const user1avatar = await loadImage(user1.displayAvatarURL({ extension: "png" }))
const user2avatar = await loadImage(user2.displayAvatarURL({ extension: "png" }))

const dimensions = sizeOf(ip)
if (!dimensions.width || !dimensions.height) throw Error("problem getting dimensions!");
return new Canvas(dimensions.width, dimensions.height)
	.printImage(image, 0, 0, dimensions.width, dimensions.height)
	.printImage(user1avatar, choice.user1coords.x, choice.user1coords.y, choice.pfpsize, choice.pfpsize)
	.printImage(user2avatar, choice.user2coords.x, choice.user2coords.y, choice.pfpsize, choice.pfpsize)
	.pngAsync();
}