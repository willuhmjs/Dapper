import gendap from "../src/lib/gendap";
import { writeFileSync } from "node:fs";

test("generated image is type buffer", async () => {
	type TestUser = { displayAvatarURL: () => string }
	const TestUser = { displayAvatarURL: () => "https://media.discordapp.net/attachments/1028766392989794444/1029202069812424764/dapper.png?width=406&height=406" }
	const image = await gendap(TestUser, TestUser)
	writeFileSync("./file.png", image)
	expect(image).toBeInstanceOf(Buffer)
}, 20000);